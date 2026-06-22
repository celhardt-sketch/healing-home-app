"""
Automated daily database backup system.

Backs up the SQLite database to a location OUTSIDE the main database path.
In production on Railway, backups are written to a separate directory on the
persistent volume and can be synced to external storage (S3, R2, etc.) via cron.

Backup strategy:
- Daily full copy of the SQLite database
- Keeps last 7 daily backups (configurable)
- Backup filenames include timestamp for easy identification
- Verify restore is done to a SEPARATE test location, never against live DB
"""

import os
import shutil
import sqlite3
from datetime import datetime

from .config import get_backup_dir, get_database_path


MAX_BACKUPS = 7  # Keep last 7 daily backups


def create_backup() -> str:
    """
    Create a backup of the database using SQLite's backup API.
    Returns the path to the backup file.
    """
    db_path = get_database_path()
    backup_dir = get_backup_dir()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"healing_home_backup_{timestamp}.db"
    backup_path = os.path.join(backup_dir, backup_filename)

    # Use SQLite's online backup API for a consistent snapshot
    source = sqlite3.connect(db_path)
    dest = sqlite3.connect(backup_path)
    source.backup(dest)
    dest.close()
    source.close()

    # Clean up old backups (keep only MAX_BACKUPS most recent)
    _cleanup_old_backups(backup_dir)

    return backup_path


def verify_backup(backup_path: str) -> bool:
    """
    Verify a backup by restoring to a SEPARATE test location.
    Never restores against the live database.
    """
    test_dir = os.path.join(get_backup_dir(), "verify_test")
    os.makedirs(test_dir, exist_ok=True)
    test_path = os.path.join(test_dir, "test_restore.db")

    try:
        # Copy backup to test location
        shutil.copy2(backup_path, test_path)

        # Verify the restored database is readable
        conn = sqlite3.connect(test_path)
        conn.execute("PRAGMA integrity_check")
        # Verify the users table exists and is queryable
        cursor = conn.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        conn.close()

        return True
    except Exception:
        return False
    finally:
        # Clean up test restore
        if os.path.exists(test_path):
            os.remove(test_path)


def list_backups() -> list[dict]:
    """List all available backups with metadata."""
    backup_dir = get_backup_dir()
    backups = []

    if not os.path.exists(backup_dir):
        return backups

    for filename in sorted(os.listdir(backup_dir), reverse=True):
        if filename.startswith("healing_home_backup_") and filename.endswith(".db"):
            filepath = os.path.join(backup_dir, filename)
            stat = os.stat(filepath)
            backups.append({
                "filename": filename,
                "path": filepath,
                "size_bytes": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            })

    return backups


def _cleanup_old_backups(backup_dir: str) -> None:
    """Remove old backups, keeping only the most recent MAX_BACKUPS."""
    backup_files = sorted(
        [
            f
            for f in os.listdir(backup_dir)
            if f.startswith("healing_home_backup_") and f.endswith(".db")
        ],
        reverse=True,
    )

    for old_backup in backup_files[MAX_BACKUPS:]:
        os.remove(os.path.join(backup_dir, old_backup))
