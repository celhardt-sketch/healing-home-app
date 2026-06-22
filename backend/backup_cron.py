"""
Standalone backup script — run via Railway cron job or systemd timer.
Creates a daily backup and verifies it can be restored.

Usage:
    python backup_cron.py

Schedule in Railway as a cron job: 0 3 * * * (daily at 3 AM UTC)
"""

import sys
import os

# Ensure the app package is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.backup import create_backup, verify_backup


def main() -> None:
    print("Starting daily backup...")
    backup_path = create_backup()
    print(f"Backup created: {backup_path}")

    print("Verifying backup (restoring to separate test location)...")
    is_valid = verify_backup(backup_path)

    if is_valid:
        print("✓ Backup verified successfully — restore test passed")
    else:
        print("✗ BACKUP VERIFICATION FAILED — restore test did not pass")
        sys.exit(1)


if __name__ == "__main__":
    main()
