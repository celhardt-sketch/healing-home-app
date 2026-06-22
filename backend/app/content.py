"""Content management CRUD for the Admin Dashboard.

Tables: printables, videos, articles, scripts, first_aid_cards
All content is managed by admin and served to authenticated subscribers.
"""

import sqlite3
from datetime import datetime, timezone
from typing import Optional

from .database import get_db


def init_content_tables() -> None:
    """Create content tables if they don't exist."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS printables (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                file_url TEXT NOT NULL,
                file_type TEXT NOT NULL DEFAULT 'pdf',
                category TEXT,
                age_group TEXT,
                sort_order INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                youtube_url TEXT,
                file_url TEXT,
                description TEXT,
                creator_name TEXT,
                section TEXT,
                category TEXT,
                age_group TEXT DEFAULT 'All Ages',
                duration_seconds INTEGER,
                tone TEXT DEFAULT 'Coaching',
                level TEXT DEFAULT 'Beginner',
                why_it_helps TEXT,
                tags TEXT DEFAULT '[]',
                best_for TEXT DEFAULT '[]',
                medically_reviewed_by TEXT,
                review_status TEXT DEFAULT 'Draft',
                sort_order INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                summary TEXT,
                category TEXT,
                age_group TEXT,
                author TEXT,
                sort_order INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS scripts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT,
                age_group TEXT,
                situation TEXT,
                sort_order INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS first_aid_cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                age_group TEXT,
                category TEXT,
                sort_order INTEGER DEFAULT 0,
                active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)

        conn.commit()


# --- Generic CRUD helpers ---

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def list_items(table: str, active_only: bool = False) -> list[dict]:
    """List all items from a content table."""
    with get_db() as conn:
        query = f"SELECT * FROM {table}"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY sort_order ASC, created_at DESC"
        rows = conn.execute(query).fetchall()
    return [dict(r) for r in rows]


def get_item(table: str, item_id: int) -> Optional[dict]:
    """Get a single item by ID."""
    with get_db() as conn:
        row = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (item_id,)).fetchone()
    return dict(row) if row else None


def create_item(table: str, data: dict) -> dict:
    """Create a new item. Returns the created item."""
    data["created_at"] = _now()
    data["updated_at"] = _now()
    cols = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    with get_db() as conn:
        cursor = conn.execute(
            f"INSERT INTO {table} ({cols}) VALUES ({placeholders})",
            list(data.values()),
        )
        conn.commit()
        item_id = cursor.lastrowid
    return get_item(table, item_id) or {}


def update_item(table: str, item_id: int, data: dict) -> Optional[dict]:
    """Update an item. Returns the updated item."""
    data["updated_at"] = _now()
    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    with get_db() as conn:
        conn.execute(
            f"UPDATE {table} SET {set_clause} WHERE id = ?",
            [*data.values(), item_id],
        )
        conn.commit()
    return get_item(table, item_id)


def delete_item(table: str, item_id: int) -> bool:
    """Delete an item by ID. Returns True if deleted."""
    with get_db() as conn:
        cursor = conn.execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))
        conn.commit()
    return cursor.rowcount > 0
