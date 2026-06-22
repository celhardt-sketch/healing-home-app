import sqlite3
from contextlib import contextmanager
from typing import Generator

from .config import get_database_path


def init_db() -> None:
    """Initialize the database with the accounts table."""
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            stripe_customer_id TEXT,
            stripe_subscription_id TEXT,
            subscription_status TEXT DEFAULT 'none',
            subscription_updated_at TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    """)
    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)
    """)

    # Add Stripe columns to existing tables (migration-safe)
    _migrate_add_columns(conn)

    # Pre-authorized emails table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS pre_authorized_emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            added_at TEXT NOT NULL DEFAULT (datetime('now')),
            consumed_at TEXT
        )
    """)

    # Webhook events log
    conn.execute("""
        CREATE TABLE IF NOT EXISTS webhook_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL UNIQUE,
            event_type TEXT NOT NULL,
            payload TEXT,
            processed_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    conn.close()


def _migrate_add_columns(conn: sqlite3.Connection) -> None:
    """Add new columns to existing tables if they don't exist."""
    cursor = conn.execute("PRAGMA table_info(users)")
    existing_cols = {row[1] for row in cursor.fetchall()}

    new_cols = [
        ("stripe_customer_id", "TEXT"),
        ("stripe_subscription_id", "TEXT"),
        ("subscription_status", "TEXT DEFAULT 'none'"),
        ("subscription_updated_at", "TEXT"),
    ]
    for col_name, col_type in new_cols:
        if col_name not in existing_cols:
            conn.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
    conn.commit()


@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Get a database connection with row factory."""
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
    finally:
        conn.close()
