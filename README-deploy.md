# Deploying the backend (Vercel + Neon + Blob)

This project now ships its own API as Vercel serverless functions (`api/`), backed by a Postgres database (Neon) and object storage (Vercel Blob) — no separate backend hosting needed. Frontend and API deploy together as one Vercel project.

These steps happen in the **Vercel dashboard, under the account that actually owns `book.hotelmetropolishubli.in`** (the "HubliMetropolis" account) — they can't be run from this checkout, since it isn't linked to that project/account.

## 1. Add a Neon database

Project → Storage tab → **Connect Database** → Neon → create a new Postgres database. This auto-injects a `DATABASE_URL` environment variable into the project — no manual copy/paste needed.

## 2. Add a Blob store

Same Storage tab → **Connect Store** → Blob → create a new store. This auto-injects `BLOB_READ_WRITE_TOKEN`, used by the admin Settings page to upload venue photos.

## 3. Set the remaining environment variable

Project → Settings → Environment Variables → add:
- `JWT_SECRET` — any long random string (used to sign admin login tokens)

(`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are already set by steps 1–2. `VITE_API_BASE_URL` does not need to be set — frontend and API share an origin in production.)

## 4. Build command

Vercel should auto-detect the `vercel-build` script in `package.json` (`prisma generate && prisma migrate deploy && vite build`) and use it automatically for this project. If it doesn't, set the Build Command explicitly in Project Settings → Build & Development Settings.

## 5. Deploy

Push to the branch connected to this Vercel project. The build step will:
1. Generate the Prisma client
2. Apply any pending migrations to the Neon database (`prisma migrate deploy`)
3. Build the Vite frontend

## 6. Seed the database (once)

After the first successful deploy, seed venues/pricing/payment-settings/admin user. Easiest from your machine, pointed at the same Neon `DATABASE_URL` (copy it from Vercel's Storage tab, or run `vercel env pull` if this checkout is linked to the real project):

```bash
DATABASE_URL="<neon connection string>" npm run seed
```

Default seeded admin login: `hublimetropolis@gmail.com` / `admin123`, forced to change on first login. Override with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` env vars before seeding if you want different seed credentials.

## Local development

`vercel dev` (once this checkout is linked to the real project via `vercel link`) serves the static frontend and `/api/*` functions together on one port, matching production routing exactly.

Without linking to the real project, you can still run the two pieces separately for local testing:
```bash
cp .env.example .env   # fill in a real DATABASE_URL (Neon dev branch or any Postgres)
npm run migrate:dev     # creates tables
npm run seed
npm run api:dev          # Express on http://localhost:3001
# in another terminal:
VITE_API_BASE_URL=http://localhost:3001/api npm run dev   # Vite on http://localhost:5173
```
