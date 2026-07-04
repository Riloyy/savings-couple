# Tabungan Bersama

A private PWA for couples to track shared savings goals together.

## Features

- **Shared savings tracking** — Log deposits and withdrawals, see combined totals in real-time
- **Goal setting** — Set a savings target name and amount, track progress with visual indicators
- **Per-person breakdown** — See each person's contribution toward the shared goal
- **Real-time sync** — Changes appear instantly on both devices via Supabase Realtime
- **PIN authentication** — Secure login with PIN, auto-lock on background or app kill
- **Brute-force protection** — Account locks temporarily after repeated failed attempts
- **PWA** — Installable on手机 (Add to Home Screen), works offline for viewing cached data

## Tech Stack

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **State & Data:** @tanstack/react-query + Supabase Realtime
- **Auth:** Supabase Auth (PIN-based login mapped to internal email accounts)
- **Hosting:** Vercel (static hosting + PWA service worker)
- **PWA:** vite-plugin-pwa (auto-update, NetworkFirst for API calls)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USER1_NAME=
VITE_USER1_SHORT_ID=
VITE_USER1_EMAIL=
VITE_USER2_NAME=
VITE_USER2_SHORT_ID=
VITE_USER2_EMAIL=
```

## Deployment

Deploy to Vercel with the following steps:

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Database

Supabase schema (4 tables):

- `users` — user profiles, avatar colors, brute-force counters
- `transactions` — deposits (in) and withdrawals (out) with notes
- `settings` — shared savings goal (name + target amount)
- `user_devices` — registered device tracking

Row-Level Security (RLS) policies restrict access to authenticated users only.
