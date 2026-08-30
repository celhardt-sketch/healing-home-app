# The Healing Home Approach

A trauma-informed psychoeducational support tool for foster and adoptive caregivers, by Elhardt Family Wellness.

- **Frontend** — React 19 + TypeScript + Vite 8 + Tailwind 4, installable as a PWA. Deployed on Vercel.
- **Backend** — FastAPI + SQLite, JWT auth, Stripe subscriptions, Resend email. Deployed on Railway (`backend/railway.toml`).

The frontend talks to the backend over absolute URLs built from `VITE_API_URL`. There is no Vite dev proxy, so
`VITE_API_URL` must be set when running locally against a local backend.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node | `>=22.12.0` (see `.nvmrc`) | Vite 8 / rolldown needs this. A fresh `npm install` + `npm run build` on Node 20.18 fails with `MODULE_NOT_FOUND` on the rolldown native binding. (An existing `node_modules` installed under Node 22 will still build under Node 20 — the floor bites on install, so it is the clean-clone case that breaks.) |
| Python | `>=3.11` | Declared in `backend/pyproject.toml`. |
| uv | any recent | Used below to create the backend venv; `python -m venv` + `pip` works too. |

## Running locally

Two processes. Start the backend first so the frontend has something to call.

### Backend (port 8000)

```bash
cd backend
uv venv --python 3.12 .venv
uv pip install -e .

mkdir -p ~/efw-data
DATA_DIR=~/efw-data JWT_SECRET=local-dev-secret ADMIN_SETUP_KEY=local-admin-key \
  .venv/bin/uvicorn app.main:app --reload --port 8000
```

`DATA_DIR` is where the SQLite file lives. It defaults to `/data` (the Railway persistent volume), which is not
writable locally — always override it. `JWT_SECRET` has no default and the app refuses to start without it.
`ADMIN_SETUP_KEY` is optional but you will want it — without it you cannot reach the subscription-gated pages
locally (see below).

Check it came up: `curl localhost:8000/api/health` → `{"status":"healthy", ... "jwt_configured":true}`.
Interactive API docs are at http://localhost:8000/docs.

### Frontend (port 5173)

```bash
nvm use            # picks up .nvmrc
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

Rather than passing `VITE_API_URL` inline every time, copy `.env.example` to `.env.local` and set it there.

### Creating a local account

Signup is a real backend endpoint (`POST /api/auth/register`) writing to your local SQLite — there is no mock or
bypass. Register through the UI, or:

```bash
curl -X POST localhost:8000/api/auth/register -H 'content-type: application/json' \
  -d '{"email":"dev@example.com","password":"devpass123","first_name":"Dev","last_name":"Tester"}'
```

That returns `{"access_token": ...}`.

Registering does **not** get you to `/dashboard`, despite the redirect the UI performs. Every tool route is
wrapped in `ProtectedRoute`, which bounces an account without a subscription to `/access-gate` — so a brand-new
local account lands there. To reach the gated pages without going through Stripe, start the backend with an
`ADMIN_SETUP_KEY` and grant yourself access. Both endpoints take **query parameters, not a JSON body**:

```bash
# 1. promote to admin
curl -X POST "localhost:8000/api/setup/make-admin?email=dev@example.com&setup_key=$ADMIN_SETUP_KEY"

# 2. log in again — the token issued before promotion carries no admin claim
TOKEN=$(curl -s -X POST localhost:8000/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"dev@example.com","password":"devpass123"}' | python3 -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')

# 3. grant access
curl -X POST "localhost:8000/api/admin/grant-access?email=dev@example.com" -H "Authorization: Bearer $TOKEN"
```

Reload the app and the tool routes render. `/account` is reachable without any of this — it is the one route
declared `requireSubscription={false}`.

`/family-plan` and `/growth-tracker` show a one-time "Before you use…" data-notice checkbox (`DataNoticeGate`)
before the tool UI appears; it is remembered in localStorage.

## Checks

```bash
npm run lint     # eslint; currently 2 pre-existing warnings, 0 errors
npm run build    # tsc -b && vite build — run before pushing, lint alone won't catch type errors
```

There is no automated test suite. UI changes are verified by hand; see `.agents/skills/testing-thha/SKILL.md`.

## Environment variables

### Frontend (build-time, must be `VITE_`-prefixed)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend base URL. Empty = same-origin relative URLs (production behaviour behind Vercel rewrites). |

### Backend (runtime, set in Railway)

| Variable | Required | Purpose |
|----------|----------|---------|
| `JWT_SECRET` | yes | Signs session tokens. App will not boot without it. |
| `DATA_DIR` | no (`/data`) | Directory holding `healing_home.db`. |
| `BACKUP_DIR` | no (`$DATA_DIR/backups`) | Destination for DB backups (`backend/backup_cron.py`). |
| `ADMIN_SETUP_KEY` | for admin bootstrap | Shared secret for `POST /api/setup/make-admin`. |
| `STRIPE_SECRET_KEY` | for billing | Stripe API key. |
| `STRIPE_PRICE_ID` | for billing | Subscription price to check out. |
| `STRIPE_WEBHOOK_SECRET` | for billing | Verifies `POST /api/webhooks/stripe`. |
| `RESEND_API_KEY` | for email | Sends welcome / password-reset mail. |
| `APP_PUBLIC_URL` | for email | Base URL used in emailed links. |

Local development needs only `JWT_SECRET` and `DATA_DIR`. Stripe and email paths degrade rather than crash when
their keys are absent, so leave them unset unless you are working on billing or email.

`CORS_ORIGINS` (in `backend/app/config.py`) already allows `localhost:5173-5175` plus the Vercel domains, so a
default local setup needs no CORS changes.

## Layout

```
src/pages/        one component per route; see the route table in src/App.tsx
src/components/   shared UI (SafetyFooter, ProtectedRoute, ...)
src/contexts/     AuthContext — token storage, profile fetch, subscription state
src/lib/          learning-library data access, favorites hook
backend/app/      main.py (routes), auth.py, database.py, stripe_billing.py,
                  content.py (CMS tables), email_service.py, backup.py, seed.py
scripts/          one-off content generation helpers
```

Admin-authored content (scripts, articles, printables, page copy) lives in backend tables and is edited through
`/admin`, not in the repo.
