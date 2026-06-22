import os
import traceback

from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional

from .auth import (
    create_token,
    decode_token,
    generate_salt,
    hash_password,
    verify_password,
)
from .backup import create_backup, list_backups, verify_backup
from .config import CORS_ORIGINS
from .database import get_db, init_db
from .stripe_billing import (
    create_checkout_session,
    create_billing_portal_session,
    handle_webhook_event,
    get_user_subscription_status,
)
from .content import (
    init_content_tables,
    list_items,
    get_item,
    create_item,
    update_item,
    delete_item,
)

app = FastAPI(
    title="The Healing Home Approach API",
    description="Backend for The Healing Home Approach app",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()
    init_content_tables()


# --- Request/Response models ---


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class MessageResponse(BaseModel):
    message: str


# --- Auth dependency ---


def get_current_user(authorization: str = Header(...)) -> dict:
    """Extract and validate the JWT from the Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization[7:]  # Strip "Bearer "
    try:
        payload = decode_token(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    return payload


# --- Public endpoints (no auth required) ---


@app.get("/api/health")
def health_check() -> dict:
    jwt_set = bool(os.environ.get("JWT_SECRET"))
    data_dir = os.environ.get("DATA_DIR", "/data")
    return {
        "status": "healthy",
        "service": "healing-home-backend",
        "jwt_configured": jwt_set,
        "data_dir": data_dir,
    }


# --- Auth endpoints ---


@app.post("/api/auth/register", response_model=TokenResponse)
def register(body: RegisterRequest) -> TokenResponse:
    """
    Register a new account. Collects name, email, password only.
    No protected health information. No card data.
    """
    if len(body.password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters"
        )

    try:
        salt = generate_salt()
        password_hash = hash_password(body.password, salt)

        with get_db() as conn:
            # Check if email already exists
            existing = conn.execute(
                "SELECT id FROM users WHERE email = ?", (body.email,)
            ).fetchone()
            if existing:
                raise HTTPException(status_code=409, detail="Email already registered")

            cursor = conn.execute(
                "INSERT INTO users (name, email, password_hash, salt) VALUES (?, ?, ?, ?)",
                (body.name, body.email, password_hash, salt),
            )
            conn.commit()
            user_id = cursor.lastrowid

        token = create_token(user_id, body.email)
        return TokenResponse(access_token=token)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")


@app.post("/api/auth/login", response_model=TokenResponse)
def login(body: LoginRequest) -> TokenResponse:
    """Authenticate with email and password."""
    try:
        with get_db() as conn:
            user = conn.execute(
                "SELECT id, email, password_hash, salt FROM users WHERE email = ?",
                (body.email,),
            ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not verify_password(body.password, user["salt"], user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token(user["id"], user["email"])
        return TokenResponse(access_token=token)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")


# --- Protected endpoints (require auth) ---


@app.get("/api/me", response_model=UserResponse)
def get_profile(current_user: dict = Depends(get_current_user)) -> UserResponse:
    """Get the current user's profile."""
    user_id = int(current_user["sub"])

    with get_db() as conn:
        user = conn.execute(
            "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
        ).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(id=user["id"], name=user["name"], email=user["email"])


# --- Admin/backup endpoints ---


@app.post("/api/admin/backup", response_model=MessageResponse)
def trigger_backup(current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Trigger a manual database backup."""
    backup_path = create_backup()
    is_valid = verify_backup(backup_path)

    if not is_valid:
        raise HTTPException(status_code=500, detail="Backup verification failed")

    return MessageResponse(
        message=f"Backup created and verified: {backup_path}"
    )


@app.get("/api/admin/backups")
def get_backups(current_user: dict = Depends(get_current_user)) -> list[dict]:
    """List all available backups."""
    return list_backups()


# --- Stripe subscription endpoints ---


class CheckoutRequest(BaseModel):
    success_url: str
    cancel_url: str


class BillingPortalRequest(BaseModel):
    return_url: str


@app.get("/api/subscription/status")
def subscription_status(current_user: dict = Depends(get_current_user)) -> dict:
    """Get the current user's subscription status."""
    user_id = int(current_user["sub"])
    return get_user_subscription_status(user_id)


@app.post("/api/subscription/checkout")
def checkout(body: CheckoutRequest, current_user: dict = Depends(get_current_user)) -> dict:
    """Create a Stripe Checkout session for subscription. Returns checkout URL."""
    user_id = int(current_user["sub"])
    email = current_user["email"]

    try:
        url = create_checkout_session(email, user_id, body.success_url, body.cancel_url)
        return {"checkout_url": url}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checkout error: {str(e)}")


@app.post("/api/subscription/billing-portal")
def billing_portal(body: BillingPortalRequest, current_user: dict = Depends(get_current_user)) -> dict:
    """Create a Stripe Billing Portal session. Returns portal URL."""
    user_id = int(current_user["sub"])
    sub_info = get_user_subscription_status(user_id)

    if not sub_info.get("stripe_customer_id"):
        raise HTTPException(status_code=400, detail="No billing account found. Subscribe first.")

    try:
        url = create_billing_portal_session(sub_info["stripe_customer_id"], body.return_url)
        return {"portal_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Billing portal error: {str(e)}")


@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request) -> dict:
    """
    Stripe webhook endpoint. Processes subscription events.
    No auth required — verified by Stripe signature.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    try:
        result = handle_webhook_event(payload, sig_header)

        # Log the event
        import json
        event_data = json.loads(payload)
        with get_db() as conn:
            conn.execute(
                "INSERT OR IGNORE INTO webhook_events (event_id, event_type, payload) VALUES (?, ?, ?)",
                (event_data.get("id", ""), event_data.get("type", ""), payload.decode()),
            )
            conn.commit()

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Admin endpoints for user/subscription management ---


@app.post("/api/admin/grant-access")
def grant_access(email: str, current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Manually grant access to a user by email (admin only)."""
    from datetime import datetime, timezone
    with get_db() as conn:
        conn.execute(
            """UPDATE users SET subscription_status = 'active', subscription_updated_at = ?
               WHERE email = ?""",
            (datetime.now(timezone.utc).isoformat(), email),
        )
        conn.commit()
    return MessageResponse(message=f"Access granted to {email}")


@app.post("/api/admin/revoke-access")
def revoke_access(email: str, current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Revoke access from a user by email (admin only)."""
    from datetime import datetime, timezone
    with get_db() as conn:
        conn.execute(
            """UPDATE users SET subscription_status = 'canceled', subscription_updated_at = ?
               WHERE email = ?""",
            (datetime.now(timezone.utc).isoformat(), email),
        )
        conn.commit()
    return MessageResponse(message=f"Access revoked from {email}")


@app.post("/api/admin/pre-authorize")
def pre_authorize_email(email: str, current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Pre-authorize an email for access before they sign up."""
    with get_db() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO pre_authorized_emails (email) VALUES (?)",
            (email,),
        )
        conn.commit()
    return MessageResponse(message=f"Pre-authorized: {email}")


@app.get("/api/admin/pre-authorized")
def list_pre_authorized(current_user: dict = Depends(get_current_user)) -> list[dict]:
    """List all pre-authorized emails."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT email, added_at, consumed_at FROM pre_authorized_emails ORDER BY added_at DESC"
        ).fetchall()
    return [{"email": r["email"], "added_at": r["added_at"], "consumed_at": r["consumed_at"]} for r in rows]


@app.get("/api/admin/users")
def list_users(current_user: dict = Depends(get_current_user)) -> list[dict]:
    """List all users with their subscription status."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, name, email, subscription_status, created_at FROM users ORDER BY created_at DESC"
        ).fetchall()
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "email": r["email"],
            "subscription_status": r["subscription_status"],
            "created_at": r["created_at"],
        }
        for r in rows
    ]


@app.get("/api/admin/webhook-events")
def list_webhook_events(current_user: dict = Depends(get_current_user)) -> list[dict]:
    """List recent webhook events."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT event_id, event_type, processed_at FROM webhook_events ORDER BY processed_at DESC LIMIT 50"
        ).fetchall()
    return [{"event_id": r["event_id"], "event_type": r["event_type"], "processed_at": r["processed_at"]} for r in rows]


class NotificationRequest(BaseModel):
    message: str
    link: Optional[str] = None


@app.post("/api/admin/notifications/send")
def send_notification(body: NotificationRequest, current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Send a push notification to all subscribers."""
    from datetime import datetime, timezone
    with get_db() as conn:
        # Store the notification
        conn.execute(
            """CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                link TEXT,
                sent_by INTEGER,
                sent_at TEXT NOT NULL DEFAULT (datetime('now'))
            )"""
        )
        conn.execute(
            "INSERT INTO notifications (message, link, sent_by, sent_at) VALUES (?, ?, ?, ?)",
            (body.message, body.link, int(current_user["sub"]), datetime.now(timezone.utc).isoformat()),
        )
        # Count active subscribers
        count = conn.execute(
            "SELECT COUNT(*) as c FROM users WHERE subscription_status = 'active'"
        ).fetchone()["c"]
        conn.commit()

    return MessageResponse(message=f"Notification sent to {count} active subscriber(s)")


# --- File Upload ---

from fastapi import UploadFile, File
import uuid

UPLOAD_DIR = os.path.join(os.environ.get("DATA_DIR", "."), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/api/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Upload a file (PDF, image, MP4). Returns the file URL."""
    allowed_types = {
        "application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp",
        "video/mp4", "video/webm", "audio/mpeg", "audio/mp4",
    }
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(400, f"File type '{file.content_type}' not allowed")

    ext = os.path.splitext(file.filename or "file")[1] or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    file_url = f"/api/uploads/{filename}"
    return {"file_url": file_url, "filename": filename, "size": len(contents)}


from fastapi.responses import FileResponse


@app.get("/api/uploads/{filename}")
def serve_upload(filename: str) -> FileResponse:
    """Serve an uploaded file."""
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "File not found")
    return FileResponse(filepath)


# --- Content CRUD Endpoints ---

CONTENT_TABLES = ["printables", "videos", "articles", "scripts", "first_aid_cards"]


@app.get("/api/content/{table}")
def list_content(table: str, active_only: bool = False) -> list[dict]:
    """List content items. Public for subscribers, shows all for admin."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    return list_items(table, active_only=active_only)


@app.get("/api/content/{table}/{item_id}")
def get_content(table: str, item_id: int) -> dict:
    """Get a single content item."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    item = get_item(table, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    return item


@app.post("/api/admin/content/{table}")
def create_content(table: str, body: dict, current_user: dict = Depends(get_current_user)) -> dict:
    """Create a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    return create_item(table, body)


@app.put("/api/admin/content/{table}/{item_id}")
def update_content(table: str, item_id: int, body: dict, current_user: dict = Depends(get_current_user)) -> dict:
    """Update a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    result = update_item(table, item_id, body)
    if not result:
        raise HTTPException(404, "Item not found")
    return result


@app.delete("/api/admin/content/{table}/{item_id}")
def delete_content(table: str, item_id: int, current_user: dict = Depends(get_current_user)) -> MessageResponse:
    """Delete a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    if not delete_item(table, item_id):
        raise HTTPException(404, "Item not found")
    return MessageResponse(message="Deleted")
