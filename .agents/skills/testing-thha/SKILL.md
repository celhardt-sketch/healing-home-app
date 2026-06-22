---
name: testing-thha
description: Test The Healing Home Approach React app end-to-end. Use when verifying UI, brand standards, page routing, or interactive features.
---

# Testing The Healing Home Approach App

## Quick Start

```bash
cd /home/ubuntu/healing-home-app
npm run dev -- --host
```

Dev server runs on localhost (port 5173 by default, increments if occupied).

## Auth Flow

Auth is client-side mock. Any email/password combination works. The flow is:

1. Navigate to `/disclaimer`
2. Check the consent checkbox
3. Click "I Understand and Accept"
4. Enter any email + password on the login form
5. Click "Sign In" → lands on `/dashboard`

**Note:** Disclaimer acceptance is stored in localStorage. If you need to re-test the disclaimer flow, clear localStorage first or use incognito.

## Key Routes to Test

| Route | What to Verify |
|-------|----------------|
| `/` | Landing page: logo, hero heading, 8 feature cards, SafetyFooter with 911/988 |
| `/disclaimer` | Checkbox gate → login form → redirect to /dashboard |
| `/dashboard` | 3 quick action cards (Crisis Mode, Regulate Me Now, Try Again Tool) + 9 tool cards |
| `/crisis` | 7-step de-escalation guide with Next/Previous navigation |
| `/scripts` | 8 scripts with category filter + age group filter + search box |
| `/family-plan` | CRUD: add child profile with name/age/trigger/strategy/strength chips, edit, delete |
| `/growth-tracker` | Add/delete growth moments with title/description/category |
| `/privacy` | Privacy Policy with 8 sections |
| `/terms` | Terms of Service with 9 sections |
| `/*` | 404 "Page Not Found" with "Go Home" link |

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

- The app is fully client-side (no backend). All state is in React component state or localStorage.
- Family Plan and Growth Tracker data resets on page refresh (not persisted to a backend).
- Scripts Library has 8 scripts total. Filtering by "De-escalation" yields 1 result ("When a Child Says 'I Hate You'").
- Crisis Mode has exactly 7 steps. Step 1: "Pause and Breathe", Step 7: "Repair and Reconnect".
- The SafetyFooter appears on every authenticated page with 911 and 988 crisis numbers.
- Vite dev server port may increment (5173 → 5174 → 5175) if previous instances are still running. Check the terminal output for the actual port.

## Devin Secrets Needed

None — auth is client-side mock, no API keys or credentials required.
