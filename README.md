# Arenate Campus Events Dashboard

React + Vite frontend that integrates with Supabase for authentication, events, teams, and community posts.

## Prerequisites
- Node.js `>= 20.19.0`
- npm `>= 10.8.2`
- Supabase CLI `>= 2.45`

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Sign in to Supabase CLI (once per machine):
   ```bash
   supabase login
   ```
4. Apply the migrations to your linked project:
   ```bash
   npm run supabase:db-push
   ```
   > If you prefer a clean slate, run `npm run supabase:db-reset` instead. This wipes the remote schema, so use with caution.
5. Start the dev server:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

## Supabase notes
- Team registrations now require the captain to have a completed profile and will automatically respect team member limits enforced in SQL triggers.
- `SUPABASE_SERVICE_ROLE_KEY` is only needed for local scripts (e.g. `scripts/seedEvents.mjs`). Keep it private and never expose it in client code.

## Troubleshooting
- Vite will refuse to start on Node < 20.19.0. Upgrade Node if you see `TypeError: crypto.hash is not a function`.
- Run `npm run lint` to ensure the project passes ESLint checks.
