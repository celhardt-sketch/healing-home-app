import hashlib
import os
import secrets
import traceback

from fastapi import FastAPI, HTTPException, Depends, Header, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime, timedelta, timezone

from .auth import (
    create_token,
    decode_token,
    generate_salt,
    hash_password,
    verify_password,
)
from .backup import create_backup, list_backups, verify_backup
from .config import CORS_ORIGINS, CORS_ORIGIN_REGEX
from .database import get_db, init_db
from .stripe_billing import (
    create_checkout_session,
    create_billing_portal_session,
    handle_webhook_event,
    get_user_subscription_status,
    confirm_checkout_session,
    cancel_subscription,
    resume_subscription,
    reconcile_subscription_from_stripe,
)
from .content import (
    init_content_tables,
    _migrate_content_tables,
    list_items,
    get_item,
    create_item,
    update_item,
    delete_item,
    get_page_content,
    get_all_page_content,
    upsert_page_content,
)
from .seed import seed_all_content
from .email_service import (
    send_welcome_email,
    send_password_reset_email,
    APP_PUBLIC_URL,
)

app = FastAPI(
    title="The Healing Home Approach API",
    description="Backend for The Healing Home Approach app",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()
    init_content_tables()
    _migrate_content_tables()
    seed_all_content()
    _init_journal_table()
    _init_regulation_plans_table()
    _init_growth_moments_table()
    _init_password_resets_table()


def _init_journal_table() -> None:
    """Create the gratitude journal table if it doesn't exist."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS gratitude_journal (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                entry_date TEXT NOT NULL,
                entry_type TEXT NOT NULL,
                entries TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, entry_date, entry_type)
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_journal_user_date
            ON gratitude_journal(user_id, entry_date)
        """)
        conn.commit()


def _init_regulation_plans_table() -> None:
    """Create the regulation plans table if it doesn't exist."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS regulation_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                child_name TEXT NOT NULL,
                plan_data TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, child_name)
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_regulation_plans_user
            ON regulation_plans(user_id)
        """)
        conn.commit()


def _init_growth_moments_table() -> None:
    """Create the growth moments table if it doesn't exist."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS growth_moments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                moment_date TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                category TEXT NOT NULL DEFAULT 'Other',
                child_name TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_growth_moments_user_date
            ON growth_moments(user_id, moment_date)
        """)
        conn.commit()


def _init_password_resets_table() -> None:
    """Create the password reset tokens table if it doesn't exist.

    Only a hash of each token is stored, never the token itself.
    """
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS password_resets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                used INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_password_resets_token
            ON password_resets(token_hash)
        """)
        conn.commit()


# --- Request/Response models ---


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


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


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Require admin role. Returns user payload or raises 403."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        row = conn.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row or not row["is_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


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
def register(body: RegisterRequest, background_tasks: BackgroundTasks) -> TokenResponse:
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

        # Send the welcome email out-of-band so a mail failure never blocks signup.
        background_tasks.add_task(send_welcome_email, body.email, body.name)

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


@app.post("/api/me/change-password", response_model=MessageResponse)
def change_password(
    body: ChangePasswordRequest, current_user: dict = Depends(get_current_user)
) -> MessageResponse:
    """Change the current user's password. Requires the current password."""
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")

    user_id = int(current_user["sub"])
    with get_db() as conn:
        user = conn.execute(
            "SELECT password_hash, salt FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not verify_password(body.current_password, user["salt"], user["password_hash"]):
            raise HTTPException(status_code=401, detail="Current password is incorrect")

        salt = generate_salt()
        password_hash = hash_password(body.new_password, salt)
        conn.execute(
            "UPDATE users SET password_hash = ?, salt = ? WHERE id = ?",
            (password_hash, salt, user_id),
        )
        conn.commit()
    return MessageResponse(message="Password updated")


def _hash_reset_token(token: str) -> str:
    """Hash a reset token for storage/lookup (never store the raw token)."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@app.post("/api/auth/forgot-password", response_model=MessageResponse)
def forgot_password(body: ForgotPasswordRequest, background_tasks: BackgroundTasks) -> MessageResponse:
    """Start a self-service password reset.

    Emails a time-limited reset link if the account exists. Always returns the same
    response so the endpoint cannot be used to discover which emails are registered.
    """
    generic = MessageResponse(
        message="If an account exists for that email, a password reset link has been sent."
    )

    with get_db() as conn:
        user = conn.execute(
            "SELECT id FROM users WHERE email = ?", (body.email,)
        ).fetchone()
        if not user:
            return generic

        token = secrets.token_urlsafe(32)
        expires_at = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        # Invalidate any outstanding tokens for this user, then store the new one.
        conn.execute("DELETE FROM password_resets WHERE user_id = ?", (user["id"],))
        conn.execute(
            "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
            (user["id"], _hash_reset_token(token), expires_at),
        )
        conn.commit()

    reset_url = f"{APP_PUBLIC_URL}/reset-password?token={token}"
    background_tasks.add_task(send_password_reset_email, body.email, reset_url)
    return generic


@app.post("/api/auth/reset-password", response_model=MessageResponse)
def reset_password(body: ResetPasswordRequest) -> MessageResponse:
    """Complete a password reset using a token from the emailed link."""
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")

    token_hash = _hash_reset_token(body.token)
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, user_id, expires_at, used FROM password_resets WHERE token_hash = ?",
            (token_hash,),
        ).fetchone()

        if not row or row["used"]:
            raise HTTPException(status_code=400, detail="This reset link is invalid or has already been used.")
        if datetime.fromisoformat(row["expires_at"]) < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="This reset link has expired. Please request a new one.")

        salt = generate_salt()
        password_hash = hash_password(body.new_password, salt)
        conn.execute(
            "UPDATE users SET password_hash = ?, salt = ? WHERE id = ?",
            (password_hash, salt, row["user_id"]),
        )
        conn.execute("UPDATE password_resets SET used = 1 WHERE id = ?", (row["id"],))
        conn.commit()

    return MessageResponse(message="Your password has been reset. You can now sign in.")


@app.get("/api/me/admin-status")
def admin_status(current_user: dict = Depends(get_current_user)) -> dict:
    """Check if the current user is an admin."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        row = conn.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,)).fetchone()
    return {"is_admin": bool(row and row["is_admin"])}


@app.post("/api/admin/promote")
def promote_to_admin(email: str, current_user: dict = Depends(require_admin)) -> MessageResponse:
    """Promote a user to admin by email. Requires existing admin."""
    with get_db() as conn:
        result = conn.execute("UPDATE users SET is_admin = 1 WHERE email = ?", (email,))
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "User not found")
    return MessageResponse(message=f"{email} is now an admin")


ADMIN_SETUP_KEY = os.environ.get("ADMIN_SETUP_KEY", "")


@app.post("/api/setup/make-admin")
def setup_make_admin(email: str, setup_key: str) -> MessageResponse:
    """One-time setup: make a user admin using the ADMIN_SETUP_KEY env variable.
    This allows initial admin creation without needing an existing admin."""
    if not ADMIN_SETUP_KEY:
        raise HTTPException(403, "Admin setup not configured. Set ADMIN_SETUP_KEY env variable.")
    if setup_key != ADMIN_SETUP_KEY:
        raise HTTPException(403, "Invalid setup key")
    with get_db() as conn:
        result = conn.execute("UPDATE users SET is_admin = 1 WHERE email = ?", (email,))
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "User not found. Register first, then call this endpoint.")
    return MessageResponse(message=f"{email} is now an admin")


# --- Admin/backup endpoints ---


@app.post("/api/admin/backup", response_model=MessageResponse)
def trigger_backup(current_user: dict = Depends(require_admin)) -> MessageResponse:
    """Trigger a manual database backup."""
    backup_path = create_backup()
    is_valid = verify_backup(backup_path)

    if not is_valid:
        raise HTTPException(status_code=500, detail="Backup verification failed")

    return MessageResponse(
        message=f"Backup created and verified: {backup_path}"
    )


@app.get("/api/admin/backups")
def get_backups(current_user: dict = Depends(require_admin)) -> list[dict]:
    """List all available backups."""
    return list_backups()


# --- Stripe subscription endpoints ---


class CheckoutRequest(BaseModel):
    success_url: str
    cancel_url: str


class BillingPortalRequest(BaseModel):
    return_url: str


class ConfirmCheckoutRequest(BaseModel):
    session_id: str


@app.get("/api/subscription/status")
def subscription_status(current_user: dict = Depends(get_current_user)) -> dict:
    """Get the current user's subscription status.

    When our record shows no access, reconcile against Stripe first: a user who paid
    but whose activation was missed (webhook/confirm race) is self-healed here, so
    they are never stranded on the paywall (and never tempted to pay again)."""
    user_id = int(current_user["sub"])
    status = get_user_subscription_status(user_id)
    if not status.get("has_access"):
        try:
            status = reconcile_subscription_from_stripe(user_id, current_user["email"])
        except Exception:
            # Never let a Stripe lookup failure break the status check.
            pass
    return status


@app.post("/api/subscription/confirm")
def confirm_subscription(body: ConfirmCheckoutRequest, current_user: dict = Depends(get_current_user)) -> dict:
    """Verify a completed checkout session with Stripe and grant access immediately.

    Used on return from hosted checkout so access does not depend on the webhook."""
    user_id = int(current_user["sub"])
    email = current_user["email"]
    try:
        return confirm_checkout_session(body.session_id, user_id, email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Confirmation error: {str(e)}")


@app.post("/api/subscription/checkout")
def checkout(body: CheckoutRequest, current_user: dict = Depends(get_current_user)) -> dict:
    """Create a Stripe Checkout session for subscription. Returns checkout URL."""
    user_id = int(current_user["sub"])
    email = current_user["email"]

    try:
        # Guard against duplicate charges: if the user already has a live subscription
        # in Stripe, do not start a second checkout — reconcile and tell the client.
        reconciled = reconcile_subscription_from_stripe(user_id, email)
        if reconciled.get("has_access"):
            return {"checkout_url": None, "already_subscribed": True}

        url = create_checkout_session(email, user_id, body.success_url, body.cancel_url)
        return {"checkout_url": url, "already_subscribed": False}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checkout error: {str(e)}")


@app.post("/api/subscription/cancel")
def cancel_membership(current_user: dict = Depends(get_current_user)) -> dict:
    """Cancel the current user's membership at the end of the billing period."""
    user_id = int(current_user["sub"])
    try:
        return cancel_subscription(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cancellation error: {str(e)}")


@app.post("/api/subscription/resume")
def resume_membership(current_user: dict = Depends(get_current_user)) -> dict:
    """Undo a scheduled cancellation so the membership renews normally."""
    user_id = int(current_user["sub"])
    try:
        return resume_subscription(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume error: {str(e)}")


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
def grant_access(email: str, current_user: dict = Depends(require_admin)) -> MessageResponse:
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


@app.post("/api/admin/reset-password")
def admin_reset_password(email: str, current_user: dict = Depends(require_admin)) -> dict:
    """Reset a user's password to a generated temporary password (admin only).

    Returns the temporary password once so the admin can hand it to the user,
    who can then change it from Account settings.
    """
    temporary_password = secrets.token_urlsafe(9)
    salt = generate_salt()
    password_hash = hash_password(temporary_password, salt)
    with get_db() as conn:
        result = conn.execute(
            "UPDATE users SET password_hash = ?, salt = ? WHERE email = ?",
            (password_hash, salt, email),
        )
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": f"Password reset for {email}",
        "temporary_password": temporary_password,
    }


@app.post("/api/admin/revoke-access")
def revoke_access(email: str, current_user: dict = Depends(require_admin)) -> MessageResponse:
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
def pre_authorize_email(email: str, current_user: dict = Depends(require_admin)) -> MessageResponse:
    """Pre-authorize an email for access before they sign up."""
    with get_db() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO pre_authorized_emails (email) VALUES (?)",
            (email,),
        )
        conn.commit()
    return MessageResponse(message=f"Pre-authorized: {email}")


@app.get("/api/admin/pre-authorized")
def list_pre_authorized(current_user: dict = Depends(require_admin)) -> list[dict]:
    """List all pre-authorized emails."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT email, added_at, consumed_at FROM pre_authorized_emails ORDER BY added_at DESC"
        ).fetchall()
    return [{"email": r["email"], "added_at": r["added_at"], "consumed_at": r["consumed_at"]} for r in rows]


@app.get("/api/admin/users")
def list_users(current_user: dict = Depends(require_admin)) -> list[dict]:
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
def list_webhook_events(current_user: dict = Depends(require_admin)) -> list[dict]:
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
def send_notification(body: NotificationRequest, current_user: dict = Depends(require_admin)) -> MessageResponse:
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
    current_user: dict = Depends(require_admin),
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
def create_content(table: str, body: dict, current_user: dict = Depends(require_admin)) -> dict:
    """Create a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    return create_item(table, body)


@app.put("/api/admin/content/{table}/{item_id}")
def update_content(table: str, item_id: int, body: dict, current_user: dict = Depends(require_admin)) -> dict:
    """Update a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    result = update_item(table, item_id, body)
    if not result:
        raise HTTPException(404, "Item not found")
    return result


@app.delete("/api/admin/content/{table}/{item_id}")
def delete_content(table: str, item_id: int, current_user: dict = Depends(require_admin)) -> MessageResponse:
    """Delete a content item (admin only)."""
    if table not in CONTENT_TABLES:
        raise HTTPException(404, f"Unknown content type: {table}")
    if not delete_item(table, item_id):
        raise HTTPException(404, "Item not found")
    return MessageResponse(message="Deleted")


# --- Gratitude Journal Endpoints ---


class JournalEntryRequest(BaseModel):
    entry_date: str  # YYYY-MM-DD
    entry_type: str  # 'morning' or 'evening'
    entries: dict  # JSON object with the form field values


@app.post("/api/journal/save")
def save_journal_entry(
    body: JournalEntryRequest,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Save or update a gratitude journal entry."""
    import json
    user_id = int(current_user["sub"])
    if body.entry_type not in ("morning", "evening"):
        raise HTTPException(400, "entry_type must be 'morning' or 'evening'")

    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM gratitude_journal WHERE user_id = ? AND entry_date = ? AND entry_type = ?",
            (user_id, body.entry_date, body.entry_type),
        ).fetchone()

        entries_json = json.dumps(body.entries)
        if existing:
            conn.execute(
                "UPDATE gratitude_journal SET entries = ?, updated_at = datetime('now') WHERE id = ?",
                (entries_json, existing["id"]),
            )
        else:
            conn.execute(
                "INSERT INTO gratitude_journal (user_id, entry_date, entry_type, entries) VALUES (?, ?, ?, ?)",
                (user_id, body.entry_date, body.entry_type, entries_json),
            )
        conn.commit()

    return {"message": "Saved", "entry_date": body.entry_date, "entry_type": body.entry_type}


@app.get("/api/journal/entries")
def get_journal_entries(
    current_user: dict = Depends(get_current_user),
    entry_date: Optional[str] = None,
    limit: int = 30,
) -> list[dict]:
    """Get journal entries for the current user. Optionally filter by date."""
    import json
    user_id = int(current_user["sub"])

    with get_db() as conn:
        if entry_date:
            rows = conn.execute(
                "SELECT id, entry_date, entry_type, entries, created_at, updated_at "
                "FROM gratitude_journal WHERE user_id = ? AND entry_date = ? "
                "ORDER BY entry_type",
                (user_id, entry_date),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT id, entry_date, entry_type, entries, created_at, updated_at "
                "FROM gratitude_journal WHERE user_id = ? "
                "ORDER BY entry_date DESC, entry_type LIMIT ?",
                (user_id, limit),
            ).fetchall()

    return [
        {
            "id": r["id"],
            "entry_date": r["entry_date"],
            "entry_type": r["entry_type"],
            "entries": json.loads(r["entries"]),
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
        }
        for r in rows
    ]


@app.delete("/api/journal/{entry_id}")
def delete_journal_entry(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    """Delete a journal entry (own entries only)."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        result = conn.execute(
            "DELETE FROM gratitude_journal WHERE id = ? AND user_id = ?",
            (entry_id, user_id),
        )
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "Entry not found")
    return MessageResponse(message="Deleted")


# --- Regulation Plan Endpoints ---


class RegulationPlanRequest(BaseModel):
    child_name: str
    plan_data: dict  # JSON: {sectionKey: [selected chips]}


@app.post("/api/regulation-plan/save")
def save_regulation_plan(
    body: RegulationPlanRequest,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Save or update a regulation plan for a child."""
    import json
    user_id = int(current_user["sub"])
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM regulation_plans WHERE user_id = ? AND child_name = ?",
            (user_id, body.child_name),
        ).fetchone()
        plan_json = json.dumps(body.plan_data)
        if existing:
            conn.execute(
                "UPDATE regulation_plans SET plan_data = ?, updated_at = datetime('now') WHERE id = ?",
                (plan_json, existing["id"]),
            )
        else:
            conn.execute(
                "INSERT INTO regulation_plans (user_id, child_name, plan_data) VALUES (?, ?, ?)",
                (user_id, body.child_name, plan_json),
            )
        conn.commit()
    return {"message": "Saved", "child_name": body.child_name}


@app.get("/api/regulation-plan/list")
def list_regulation_plans(
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """List all regulation plans for the current user."""
    import json
    user_id = int(current_user["sub"])
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, child_name, plan_data, created_at, updated_at "
            "FROM regulation_plans WHERE user_id = ? ORDER BY updated_at DESC",
            (user_id,),
        ).fetchall()
    return [
        {
            "id": r["id"],
            "child_name": r["child_name"],
            "plan_data": json.loads(r["plan_data"]),
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
        }
        for r in rows
    ]


@app.delete("/api/regulation-plan/{plan_id}")
def delete_regulation_plan(
    plan_id: int,
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    """Delete a regulation plan (own plans only)."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        result = conn.execute(
            "DELETE FROM regulation_plans WHERE id = ? AND user_id = ?",
            (plan_id, user_id),
        )
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "Plan not found")
    return MessageResponse(message="Deleted")


# --- Growth Moments Endpoints ---


class GrowthMomentRequest(BaseModel):
    moment_date: str  # YYYY-MM-DD
    title: str
    description: str = ""
    category: str = "Other"
    child_name: str = ""


@app.post("/api/growth/save")
def save_growth_moment(
    body: GrowthMomentRequest,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Create a growth moment."""
    user_id = int(current_user["sub"])
    if not body.title.strip():
        raise HTTPException(400, "title is required")
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO growth_moments (user_id, moment_date, title, description, category, child_name) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, body.moment_date, body.title.strip(), body.description, body.category, body.child_name),
        )
        conn.commit()
        moment_id = cursor.lastrowid
    return {"id": moment_id, "message": "Saved"}


@app.get("/api/growth/list")
def list_growth_moments(
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """List all growth moments for the current user, newest first."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, moment_date, title, description, category, child_name, created_at "
            "FROM growth_moments WHERE user_id = ? ORDER BY moment_date DESC, id DESC",
            (user_id,),
        ).fetchall()
    return [
        {
            "id": r["id"],
            "moment_date": r["moment_date"],
            "title": r["title"],
            "description": r["description"],
            "category": r["category"],
            "child_name": r["child_name"],
            "created_at": r["created_at"],
        }
        for r in rows
    ]


@app.delete("/api/growth/{moment_id}")
def delete_growth_moment(
    moment_id: int,
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    """Delete a growth moment (own moments only)."""
    user_id = int(current_user["sub"])
    with get_db() as conn:
        result = conn.execute(
            "DELETE FROM growth_moments WHERE id = ? AND user_id = ?",
            (moment_id, user_id),
        )
        conn.commit()
    if result.rowcount == 0:
        raise HTTPException(404, "Moment not found")
    return MessageResponse(message="Deleted")


# --- Page Content Endpoints ---


@app.get("/api/page-content/{page}")
def get_page_content_endpoint(page: str) -> list[dict]:
    """Get editable page content sections (public for rendering)."""
    return get_page_content(page)


@app.get("/api/admin/page-content")
def get_all_pages_content(current_user: dict = Depends(require_admin)) -> dict:
    """Get all page content for admin editor."""
    return get_all_page_content()


@app.post("/api/admin/page-content")
def save_page_content(body: dict, current_user: dict = Depends(require_admin)) -> dict:
    """Create or update a page content section."""
    page = body.get("page", "")
    section = body.get("section", "")
    content = body.get("content", "")
    content_type = body.get("content_type", "text")
    if not page or not section:
        raise HTTPException(400, "page and section are required")
    return upsert_page_content(page, section, content, content_type)
