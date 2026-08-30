---
name: testing-thha
description: Test The Healing Home Approach React app end-to-end. Use when verifying UI, brand standards, page routing, or interactive features.
---

# Testing The Healing Home Approach App

## Quick Start

The app is **not** client-side only — most pages read and write through the FastAPI backend in `backend/`.
Start both processes; see README.md for full setup.

```bash
# terminal 1 — backend
cd backend && DATA_DIR=~/efw-data JWT_SECRET=local-dev-secret .venv/bin/uvicorn app.main:app --port 8000

# terminal 2 — frontend
nvm use && VITE_API_URL=http://localhost:8000 npm run dev -- --host
```

Node must be >= 22.12.0 (`.nvmrc`) or the build fails on the rolldown native binding.
Vite dev server port may increment (5173 → 5174 → 5175) if previous instances are still running; check the
terminal output for the actual port. `CORS_ORIGINS` covers 5173-5175 only.

## Auth Flow

Auth is **real**: salted PBKDF2-HMAC-SHA256 password hashes in SQLite, JWT bearer tokens. There is no mock and arbitrary
credentials do not work — register an account first.

1. Navigate to `/disclaimer` — this page is both the login and register form
2. Register: fill first name, last name, email, password → continue to the terms step (6 checkboxes, all
   required) → accept. The code navigates to `/dashboard`, but a brand-new account has no subscription, so
   `ProtectedRoute` immediately bounces it to `/access-gate`. That is the expected landing page after signup.
3. Log in: enter the email + password you registered with → `/dashboard` if the account has access, otherwise
   `/access-gate`

`ProtectedRoute` redirects unauthenticated users to `/disclaimer`, and authenticated users **without a
subscription** to `/access-gate`. So a freshly registered account cannot reach the tool pages. To test them
locally, grant yourself access via the backend rather than going through Stripe:

Both endpoints take **query parameters**, not a JSON body — a JSON body returns HTTP 422:

```bash
# promote to admin (needs ADMIN_SETUP_KEY set on the backend process)
curl -X POST "localhost:8000/api/setup/make-admin?email=dev@example.com&setup_key=$ADMIN_SETUP_KEY"
# log in again to get a token that carries admin rights, then grant access
TOKEN=$(curl -s -X POST localhost:8000/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"dev@example.com","password":"devpass123"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
curl -X POST "localhost:8000/api/admin/grant-access?email=dev@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

Reload the browser tab afterwards so `AuthContext` re-fetches `/api/subscription/status`.

`/account` is the exception — it uses `requireSubscription={false}` and is reachable while logged out of a plan.

## Key Routes

Source of truth is the `<Route>` list in `src/App.tsx`. Public: `/`, `/disclaimer`, `/access-gate`,
`/forgot-password`, `/reset-password`, `/crisis`, `/safety-resources`, `/mandated-reporter-guide`, `/privacy`,
`/terms`. Protected: `/dashboard`, `/kids-regulation`, `/try-again`, `/regulate-me`, `/caregiver-support`,
`/scripts`, `/learning` (+ `/:categorySlug` and `/:categorySlug/:articleSlug`), `/growth-tracker`,
`/family-plan`, `/printables`, `/account`. Also `/admin` and a `*` 404.

| Route | What to Verify |
|-------|----------------|
| `/` | Landing page: logo, hero heading, feature cards, SafetyFooter with 911/988 |
| `/disclaimer` | Register (2-step, terms gate) and login both authenticate; landing page depends on subscription |
| `/access-gate` | Subscribed-only redirect target for accounts without access |
| `/dashboard` | Quick action cards + tool cards, all links resolve |
| `/crisis` | Multi-step de-escalation guide with Next/Previous navigation |
| `/scripts` | Category filter + age group filter + search, populated from the backend |
| `/family-plan` | CRUD child profiles — reload the page to confirm it persisted to the backend |
| `/growth-tracker` | Add/delete growth moments — reload to confirm persistence |
| `/learning` | Category → article drilldown, favorites toggle |
| `/admin` | Content editing writes back and survives a reload |
| `/*` | 404 "Page Not Found" with "Go Home" link |

Content (scripts, articles, printables, page copy) is seeded into backend tables, so exact counts depend on the
seed/admin edits in the database you are pointing at. Verify behaviour, not hardcoded item counts.

## Brand Standards to Verify

- **Primary Color:** Deep Slate Blue `#2A4B84` — headings, nav, primary buttons
- **Secondary Color:** Growth Green `#6ED043` — accent badges, success states
- **Supporting Color:** Healing Purple `#9C70C8` — emotional content highlights
- **Accent Color:** Sky Blue `#90B1F9` — light backgrounds, callouts
- **Neutral:** Charcoal `#0A0A0A` — body text
- **Heading Font:** Playfair Display (serif) — all h1-h6
- **Body Font:** Inter (sans-serif) — paragraphs, buttons, labels
- **Logo:** THHA house-framed family silhouette at `/public/logo.png`

## Testing Tips

- User data persists in SQLite at `$DATA_DIR/healing_home.db`. Delete that file for a clean slate.
- The app is a PWA with `registerType: 'autoUpdate'`. A stale service worker can serve old assets — hard-reload
  or unregister the SW in DevTools when a change does not appear.
- Disclaimer/terms acceptance and favorites use localStorage; clear it or use incognito to re-test those gates.
- `/family-plan` and `/growth-tracker` open behind a one-time "Before you use ..." data notice (`DataNoticeGate`):
  tick "I have read this notice" and click Continue before the tool UI appears. It is localStorage-backed, so it
  does not reappear after a reload.
- The SafetyFooter appears on authenticated pages with 911 and 988 crisis numbers.
- Check the browser console and the uvicorn log together — a blank page is usually a failed API call (CORS,
  wrong `VITE_API_URL`, or a 401 from an expired token), not a render bug.

## Devin Secrets Needed

None for the core flows. Billing tests need `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` /
`STRIPE_WEBHOOK_SECRET`; email tests need `RESEND_API_KEY` and `APP_PUBLIC_URL`; admin bootstrap needs
`ADMIN_SETUP_KEY`.
