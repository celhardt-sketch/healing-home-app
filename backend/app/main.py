import os
import uuid

from fastapi import FastAPI, File, Form, HTTPException, Depends, Header, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr

from .auth import (
    create_token,
    decode_token,
    generate_salt,
    hash_password,
    verify_password,
)
from .backup import create_backup, list_backups, verify_backup
from .config import CORS_ORIGINS, get_uploads_dir
from .database import get_db, init_db

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


# --- Resource Library endpoints ---

VALID_SECTIONS = [
    "professionals",
    "foster-adoptive",
    "kinship",
    "biological",
]

VALID_CATEGORIES = [
    "articles",
    "behavior-support",
    "mental-health",
    "policy",
    "research",
    "resources",
]


class ResourceResponse(BaseModel):
    id: int
    section: str
    category: str
    title: str
    original_filename: str
    uploaded_at: str


@app.get("/api/resources")
def list_resources(section: str | None = None, category: str | None = None) -> list[dict]:
    """List resources, optionally filtered by section and/or category."""
    query = "SELECT id, section, category, title, original_filename, uploaded_at FROM resources"
    params: list[str] = []
    conditions: list[str] = []

    if section:
        conditions.append("section = ?")
        params.append(section)
    if category:
        conditions.append("category = ?")
        params.append(category)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY uploaded_at DESC"

    with get_db() as conn:
        rows = conn.execute(query, params).fetchall()

    return [dict(row) for row in rows]


@app.post("/api/resources", response_model=ResourceResponse)
def upload_resource(
    section: str = Form(...),
    category: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
) -> ResourceResponse:
    """Upload a PDF resource."""
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=400, detail=f"Invalid section: {section}")
    if category not in VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category: {category}")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    if file.content_type and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    unique_name = f"{uuid.uuid4().hex}.pdf"
    uploads_dir = get_uploads_dir()
    file_path = os.path.join(uploads_dir, unique_name)

    contents = file.file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO resources (section, category, title, filename, original_filename) "
            "VALUES (?, ?, ?, ?, ?)",
            (section, category, title, unique_name, file.filename),
        )
        conn.commit()
        resource_id = cursor.lastrowid

        row = conn.execute(
            "SELECT id, section, category, title, original_filename, uploaded_at "
            "FROM resources WHERE id = ?",
            (resource_id,),
        ).fetchone()

    return ResourceResponse(**dict(row))


@app.get("/api/resources/{resource_id}/download")
def download_resource(resource_id: int) -> FileResponse:
    """Download a resource PDF by its ID."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT filename, original_filename FROM resources WHERE id = ?",
            (resource_id,),
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Resource not found")

    file_path = os.path.join(get_uploads_dir(), row["filename"])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=file_path,
        filename=row["original_filename"],
        media_type="application/pdf",
    )


@app.delete("/api/resources/{resource_id}", response_model=MessageResponse)
def delete_resource(
    resource_id: int,
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:
    """Delete a resource (admin only)."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT filename FROM resources WHERE id = ?",
            (resource_id,),
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Resource not found")

        file_path = os.path.join(get_uploads_dir(), row["filename"])
        if os.path.exists(file_path):
            os.remove(file_path)

        conn.execute("DELETE FROM resources WHERE id = ?", (resource_id,))
        conn.commit()

    return MessageResponse(message="Resource deleted")
