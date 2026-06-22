import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from .config import JWT_ALGORITHM, JWT_EXPIRY_HOURS, get_jwt_secret

# PBKDF2-HMAC-SHA256 settings (matching course platform)
PBKDF2_ITERATIONS = 600_000
HASH_ALGORITHM = "sha256"
SALT_LENGTH = 32  # 256-bit random salt


def generate_salt() -> str:
    """Generate a cryptographically secure unique random salt."""
    return secrets.token_hex(SALT_LENGTH)


def hash_password(password: str, salt: str) -> str:
    """
    Hash a password using PBKDF2-HMAC-SHA256 with 600,000 iterations.
    Each user has a unique random salt. Never stored in plaintext.
    """
    dk = hashlib.pbkdf2_hmac(
        HASH_ALGORITHM,
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS,
    )
    return dk.hex()


def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    """Verify a password against stored hash and salt."""
    computed_hash = hash_password(password, salt)
    # Constant-time comparison to prevent timing attacks
    return secrets.compare_digest(computed_hash, stored_hash)


def create_token(user_id: int, email: str) -> str:
    """
    Create a JWT token. Algorithm pinned to HS256.
    Secret stored ONLY as environment variable (never in code).
    """
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT token.
    - Algorithm PINNED to HS256 only
    - Rejects "alg: none" and any other algorithm
    - Validates expiration
    """
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[JWT_ALGORITHM],  # ONLY allow HS256 — rejects "none"
            options={"require": ["exp", "sub", "email"]},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidAlgorithmError:
        raise ValueError("Invalid token algorithm — only HS256 is accepted")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
