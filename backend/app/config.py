import os


def get_jwt_secret() -> str:
    """Get JWT signing secret from environment variable only. Never hardcoded."""
    secret = os.environ.get("JWT_SECRET")
    if not secret:
        raise RuntimeError(
            "JWT_SECRET environment variable is not set. "
            "Set it as a Railway environment variable."
        )
    return secret


def get_database_path() -> str:
    """Get database path — uses Railway persistent volume when available."""
    data_dir = os.environ.get("DATA_DIR", "/data")
    os.makedirs(data_dir, exist_ok=True)
    return os.path.join(data_dir, "healing_home.db")


def get_backup_dir() -> str:
    """Get backup directory path — defaults to a 'backups' subfolder under DATA_DIR."""
    data_dir = os.environ.get("DATA_DIR", "/data")
    backup_dir = os.environ.get("BACKUP_DIR", os.path.join(data_dir, "backups"))
    os.makedirs(backup_dir, exist_ok=True)
    return backup_dir


def get_uploads_dir() -> str:
    """Get uploads directory path for resource PDFs."""
    data_dir = os.environ.get("DATA_DIR", "/data")
    uploads_dir = os.path.join(data_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    return uploads_dir


# CORS origins for the frontend
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,https://healing-home-app.vercel.app"
).split(",")

# JWT settings
JWT_ALGORITHM = "HS256"  # Pinned — never allow "none" or other algorithms
JWT_EXPIRY_HOURS = 24 * 7  # 7 days
