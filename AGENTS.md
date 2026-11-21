# AGENTS.md — The Healing Home Approach (THHA) app

Guide for AI assistants (Grok, Devin, others) that answer questions about this app or propose edits to it.
Read this first. The owner, Courtney Elhardt (Elhardt Family Wellness), is not a developer: give her
click-by-click steps, and exact edits she can paste on GitHub.

## What the app is

A trauma-informed psychoeducational support tool for foster and adoptive caregivers. It is a paid
subscription PWA (installable on iPhone/iPad home screens). It is **not** therapy or medical care; the
disclaimer, terms, crisis numbers (911 / 988) and mandated-reporter guidance are deliberate and must stay.

- **Frontend:** React 19 + TypeScript + Vite 8 + Tailwind 4 + `vite-plugin-pwa`. Hosted on Vercel at
  `https://healing-home-app.vercel.app`.
- **Backend:** FastAPI + SQLite (`healing_home.db` in `DATA_DIR`, `/data` on the Railway volume), JWT auth,
  Stripe subscriptions, Resend email. Hosted on Railway from `backend/` (`backend/Dockerfile`,
  `backend/railway.toml`, health check `/api/health`).
- **Default branch:** `devin/1782097040-rebuild-react-app` (not `main`). PRs target it. Merging to it is
  what ships a change; confirm in Vercel/Railway that the deploy finished.

The frontend calls the backend at `import.meta.env.VITE_API_URL || ''`. There is no Vite dev proxy.

## Where things live

```
src/App.tsx               route table (source of truth for every page URL)
src/pages/*.tsx           one component per route
src/components/           shared UI: Navbar, SafetyFooter, CrisisBanner, ProtectedRoute,
                          DataNoticeGate, InstallAppModal/InstallInstructions, RichText, ArticleBody
src/contexts/AuthContext.tsx  token storage, login/register, profile, subscription state
src/lib/learning.ts       fetches articles from the backend, groups them into categories
src/data/learningArticles.ts  AUTO-GENERATED article source (do not hand-edit; see below)
src/index.css             Tailwind theme: brand colors + fonts
index.html                PWA shell + SW_VERSION cache-bust script
vite.config.ts            PWA manifest + Workbox caching
public/                   logo, PWA icons, public/printables/*.pdf
backend/app/main.py       all API routes + startup + journal/plan/growth/password-reset tables
backend/app/database.py   users, pre_authorized_emails, webhook_events tables + migrations
backend/app/content.py    CMS tables (printables, videos, articles, scripts, first_aid_cards, page_content)
backend/app/seed.py       seeds CMS tables on startup (only when empty, plus versioned re-seeds)
backend/app/auth.py       PBKDF2-HMAC-SHA256 (600k iterations) + JWT (HS256, 7-day expiry)
backend/app/stripe_billing.py  Checkout, billing portal, webhooks, cancel/resume
backend/app/email_service.py   Resend welcome / reset emails
backend/app/backup.py, backend/backup_cron.py  SQLite backups to BACKUP_DIR
```

## Pages (from `src/App.tsx`)

Public: `/` Landing, `/disclaimer` (login + 2-step register with terms), `/access-gate` (paywall),
`/forgot-password`, `/reset-password`, `/crisis` (Crisis Mode / first-aid cards), `/safety-resources`,
`/mandated-reporter-guide`, `/privacy`, `/terms`.

Subscriber-only (wrapped in `ProtectedRoute`): `/dashboard`, `/kids-regulation`, `/try-again`,
`/regulate-me`, `/caregiver-support` (incl. gratitude journal), `/scripts`, `/learning`,
`/learning/:categorySlug`, `/learning/:categorySlug/:articleSlug`, `/growth-tracker`, `/family-plan`,
`/printables`. `/account` needs login but not a subscription. `/admin` checks admin status itself.

`ProtectedRoute` sends logged-out users to `/disclaimer` and logged-in users without
`subscription.has_access` to `/access-gate`. `/family-plan` and `/growth-tracker` show a one-time data notice
(`DataNoticeGate`, remembered in localStorage).

## Content: admin screen or code? (important)

The `/admin` dashboard has tabs: First Aid Cards, Scripts, Learning, Printables, Videos, Pages, Users,
Webhooks, Pre-Auth, Notifications. **Not every tab changes what users see.** Verified against the code:

| What Courtney wants to change | Where it actually comes from | How to change it |
|---|---|---|
| Crisis Mode first-aid cards (`/crisis`) | DB `first_aid_cards` | Admin → First Aid Cards |
| Scripts library (`/scripts`) | DB `scripts` | Admin → Scripts |
| Learning Library articles (`/learning/...`) | DB `articles` | Admin → Learning |
| Try Again tool steps (`/try-again`) | DB `page_content` page `try_again_steps` | Admin → Pages → Try Again Tool Steps |
| User access, admins, password resets, deleting users | DB `users` | Admin → Users / Pre-Auth |
| Printables Vault list (`/printables`) | hardcoded `printables` array in `src/pages/PrintablesVault.tsx` + PDFs in `public/printables/` | **Code change** |
| Kids regulation videos (`/kids-regulation`) | hardcoded array in `src/pages/KidsRegulationTools.tsx` | **Code change** |
| Caregiver Support videos, articles, self-care lists | hardcoded arrays in `src/pages/CaregiverSupport.tsx` | **Code change** |
| Landing, Dashboard, Regulate Me, Safety, Privacy, Terms, Mandated Reporter text | hardcoded JSX in the matching `src/pages/*.tsx` | **Code change** |
| Script category / age filter lists | `defaultCategories` / `ageGroups` in `src/pages/ScriptsLibrary.tsx` | **Code change** |
| Learning category names/descriptions | `CATEGORY_META` in `src/lib/learning.ts` (new category names still appear automatically) | Code change only to reorder/describe |
| Colors, fonts | `src/index.css` `@theme` | **Code change** |

The admin **Printables**, **Videos** and **Notifications** tabs, and the **Pages** entries for Landing, Dashboard, Crisis,
Caregiver, Learning, Kids Tools and Crisis De-escalation Steps, save to the database but **no page reads
them** (Notifications are stored and counted, but nothing shows or sends them to users). Editing them changes nothing visible. Say so instead of sending Courtney there. Wiring a page to read
them is a code change.

Editing `backend/app/seed.py` does **not** change production content: seeds only fill empty tables (or run a
named, versioned re-seed once). Live content is whatever is in the production DB, edited through `/admin`.

## Brand

- Deep Slate Blue `#2A4B84` (`slate-blue`): headings, nav, primary buttons
- Growth Green `#6ED043` (`growth-green`): accents, success
- Healing Purple `#9C70C8` (`healing-purple`): emotional-content highlights
- Sky Blue `#90B1F9` (`sky-blue`, `sky-blue-bg`): light backgrounds, callouts
- Charcoal `#0A0A0A` (`charcoal`, `charcoal-80`, `charcoal-70`): text
- Headings Playfair Display (`font-heading`), body Inter. Logo `public/logo.png`.
- Use the Tailwind theme names (`text-slate-blue`, `bg-sky-blue-bg`), not raw hex, in new JSX.
- Voice: warm, trauma-informed, non-shaming ("nervous system", "regulation before reason", "repair",
  "try again"). Article copy avoids em dashes (a re-seed removed them).

## API conventions

- Auth header: `Authorization: Bearer <token>`. Dependencies: `get_current_user`, `require_admin` (403
  `"Admin access required"`).
- Generic CMS: `GET /api/content/{table}`, admin `POST/PUT/DELETE /api/admin/content/{table}[/{id}]`, where
  `table` must be in `CONTENT_TABLES` in `main.py`.
- Page copy: `GET /api/page-content/{page}`, admin `POST /api/admin/page-content`.
- Per-user data: `/api/journal/*`, `/api/regulation-plan/*` (Family Plan, Crisis plan), `/api/growth/*`.
- Billing: `/api/subscription/{status,checkout,confirm,cancel,resume,billing-portal}`,
  `POST /api/webhooks/stripe`.
- Admin helpers take **query parameters**, not JSON: `POST /api/setup/make-admin?email=..&setup_key=..`,
  `POST /api/admin/grant-access?email=..`, also `revoke-access`, `pre-authorize`, `reset-password`.
- New tables: `CREATE TABLE IF NOT EXISTS` in the matching init function. New columns: add to the
  `CREATE TABLE` **and** to the migration list (`database.py` / `_migrate_content_tables` in `content.py`).
  Never drop or rename columns: production data lives in them.

## Environment variables (names only; never put values in code or chat)

Backend (Railway): `JWT_SECRET` (required, app will not boot without it), `DATA_DIR`, `BACKUP_DIR`,
`ADMIN_SETUP_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`,
`APP_PUBLIC_URL`, optional `CORS_ORIGINS`. Frontend (Vercel, build-time): `VITE_API_URL`.

## Safe-editing rules

1. Never commit secrets, API keys or default passwords. A missing required secret must stop the app, not
   fall back silently.
2. Never weaken the safety content: SafetyFooter (911/988), CrisisBanner, disclaimer/terms gate,
   mandated-reporter guide, "not therapy" language.
3. Do not remove `ProtectedRoute` from subscriber pages or loosen `require_admin`.
4. Payments (`stripe_billing.py`, subscription routes), login/passwords (`auth.py`, auth routes) and DB
   schema are high-risk: hand those to Devin to build and test.
5. The DB holds caregiver and child information (journal entries, family plans) and payment status. Never
   paste production data into a chat.
6. File inputs must use MIME types (`accept="image/*,application/pdf"`); iOS ignores extension-only filters.
7. Users see a cached PWA. After a visible frontend change that users report not seeing, bump
   `SW_VERSION` in `index.html` by 1 to force a refresh.
8. `src/data/learningArticles.ts` is generated; change live articles in Admin → Learning instead.
9. Keep changes small; one PR per change.

## Checks before a PR

```bash
npm run lint    # 0 errors expected (2 pre-existing warnings in AuthContext.tsx)
npm run build   # tsc -b && vite build; catches type errors lint misses. Needs Node >= 22.12
```

No automated test suite. Backend local run: `cd backend && DATA_DIR=~/thha-data JWT_SECRET=local-dev-secret
ADMIN_SETUP_KEY=local-admin-key .venv/bin/uvicorn app.main:app --port 8000`; frontend:
`VITE_API_URL=http://localhost:8000 npm run dev`. Manual test steps: `.agents/skills/testing-thha/SKILL.md`.
