"""Transactional email sending via Resend.

Uses Resend's REST API over the stdlib (no extra dependency). If RESEND_API_KEY
is not configured the functions no-op gracefully so account creation never fails
because email is unavailable.
"""
import json
import logging
import os
import urllib.error
import urllib.request

logger = logging.getLogger("uvicorn.error")

RESEND_API_URL = "https://api.resend.com/emails"

# The public app URL used in email links (overridable per environment).
APP_PUBLIC_URL = os.environ.get("APP_PUBLIC_URL", "https://healing-home-app.vercel.app")

# Verified sender. Until a custom domain is verified in Resend, the shared
# onboarding@resend.dev sender works for testing.
EMAIL_FROM = os.environ.get(
    "EMAIL_FROM", "The Healing Home Approach <onboarding@resend.dev>"
)


def _send_email(to_email: str, subject: str, html: str, text: str) -> bool:
    """Send one email through Resend. Returns True on success, False otherwise."""
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logger.warning("RESEND_API_KEY not set; skipping email to %s", to_email)
        return False

    payload = json.dumps({
        "from": EMAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html,
        "text": text,
    }).encode("utf-8")

    req = urllib.request.Request(
        RESEND_API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            # A real User-Agent is required: the default "Python-urllib" is
            # blocked by Resend's Cloudflare edge (HTTP 403, error code 1010).
            "User-Agent": "healing-home-app/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
        return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        logger.error("Resend HTTP error sending to %s: %s %s", to_email, e.code, body)
        return False
    except Exception as e:  # noqa: BLE001 - email must never break the caller
        logger.error("Failed to send email to %s: %s", to_email, e)
        return False


def send_welcome_email(to_email: str, name: str) -> bool:
    """Send the welcome email, including an app-installation section."""
    first_name = (name or "").strip().split(" ")[0] or "there"
    subject = "Welcome to The Healing Home Approach"

    html = f"""\
<div style="font-family:Arial,Helvetica,sans-serif;color:#2d3142;line-height:1.5;max-width:560px;margin:0 auto;">
  <h1 style="color:#4f6d8e;font-size:22px;">Welcome, {first_name}!</h1>
  <p>Thank you for joining <strong>The Healing Home Approach</strong>. Your account is ready.
  You can open the app any time here:</p>
  <p><a href="{APP_PUBLIC_URL}" style="color:#4f6d8e;font-weight:bold;">{APP_PUBLIC_URL}</a></p>

  <h2 style="color:#4f6d8e;font-size:18px;margin-top:28px;">Install the App on Your Phone</h2>
  <p>This app is a Progressive Web App (PWA). You do not need an app store, just add it to your
  phone's Home Screen using the steps below.</p>

  <h3 style="font-size:15px;margin-bottom:4px;">Android (Google Chrome)</h3>
  <ol style="margin-top:0;padding-left:20px;">
    <li>Open <strong>Google Chrome</strong> and go to {APP_PUBLIC_URL}</li>
    <li>Tap the <strong>three-dot menu</strong> in the upper-right corner.</li>
    <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
    <li>Confirm the app name, then tap <strong>Install</strong> or <strong>Add</strong>.</li>
    <li>The app icon will appear on your Home Screen.</li>
  </ol>

  <h3 style="font-size:15px;margin-bottom:4px;">iPhone or iPad (Safari)</h3>
  <ol style="margin-top:0;padding-left:20px;">
    <li>Open <strong>Safari</strong> and go to {APP_PUBLIC_URL}</li>
    <li>Tap the <strong>Share button</strong> (the square with an upward-pointing arrow).</li>
    <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
    <li>Confirm the app name, then tap <strong>Add</strong> in the upper-right corner.</li>
    <li>The app icon will appear on your Home Screen.</li>
  </ol>
  <p style="font-size:13px;color:#8a6d3b;background:#fcf8e3;border:1px solid #faebcc;padding:8px 10px;border-radius:6px;">
    <strong>Important for Apple users:</strong> You must open the website in Safari. The
    "Add to Home Screen" option may not appear in Chrome or another browser.
  </p>

  <p style="font-size:12px;color:#6b7280;margin-top:28px;">
    The Healing Home Approach&trade; &middot; Elhardt Family Wellness LLC
  </p>
</div>"""

    text = f"""\
Welcome, {first_name}!

Thank you for joining The Healing Home Approach. Your account is ready.
Open the app any time here: {APP_PUBLIC_URL}

INSTALL THE APP ON YOUR PHONE
This app is a Progressive Web App (PWA). You do not need an app store, just add it
to your phone's Home Screen.

Android (Google Chrome):
1. Open Google Chrome and go to {APP_PUBLIC_URL}
2. Tap the three-dot menu in the upper-right corner.
3. Select "Install app" or "Add to Home screen".
4. Confirm the app name, then tap Install or Add.
5. The app icon will appear on your Home Screen.

iPhone or iPad (Safari):
1. Open Safari and go to {APP_PUBLIC_URL}
2. Tap the Share button (the square with an upward-pointing arrow).
3. Scroll down and select "Add to Home Screen".
4. Confirm the app name, then tap Add in the upper-right corner.
5. The app icon will appear on your Home Screen.

Important for Apple users: You must open the website in Safari. The "Add to Home
Screen" option may not appear in Chrome or another browser.

The Healing Home Approach - Elhardt Family Wellness LLC
"""

    return _send_email(to_email, subject, html, text)
