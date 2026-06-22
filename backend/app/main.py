from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

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
    return {"status": "healthy", "service": "healing-home-backend"}


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


@app.post("/api/auth/login", response_model=TokenResponse)
def login(body: LoginRequest) -> TokenResponse:
    """Authenticate with email and password."""
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
