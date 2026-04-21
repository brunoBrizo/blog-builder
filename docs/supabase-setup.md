# Supabase setup

Hybrid provisioning strategy:

- **Dev** — provisioned now on the free tier. Used for local development and CI.
- **Prod** — deferred. Not created until feature 15 (launch readiness). Fly.io and Vercel secret wiring is deferred to the same milestone.

## Dev project

- Project URL: `https://sdkpdwdnlxonhrocbtro.supabase.co`
- API keys (new-format):
  - `SUPABASE_SECRET_KEY=sb_secret_...` — server-side only. Belongs in `apps/api` runtime secrets.
  - `SUPABASE_PUBLISHABLE_KEY=sb_publishable_...` — safe to expose to the browser if/when the admin dashboard uses it.
- Region: NA or EU (matches Fly.io + Vercel region chosen in feature 15).

## Connection strings

Supabase exposes two connection modes. The data layer uses both:

| Variable              | Port | Use                                                                               |
| --------------------- | ---- | --------------------------------------------------------------------------------- |
| `DATABASE_URL`        | 6543 | Runtime (API, seed, app code). Pooled.                                            |
| `DIRECT_DATABASE_URL` | 5432 | `drizzle-kit generate` / `migrate` / `studio`. DDL over the pooler is unreliable. |

Copy these from **Project Settings → Database → Connection string** in the Supabase dashboard. The pooled string ends in `.pooler.supabase.com:6543`; the direct string ends in `.pooler.supabase.com:5432`.

Local setup:

1. Copy `.env.example` to `.env` at the repo root.
2. Fill in `DATABASE_URL`, `DIRECT_DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_PUBLISHABLE_KEY`.
3. `.env` is git-ignored. Never commit real values.

## Extensions

Enabled via SQL migration (`libs/db/drizzle/0000_extensions.sql`), not dashboard clicks:

- `pgcrypto` — UUID generation, HMAC for unsubscribe tokens.
- `uuid-ossp` — legacy UUID helpers.
- `pg_trgm` — trigram similarity for search fallback (GIN index tuning deferred to feature 09).
- `citext` — case-insensitive email column on `newsletter_subscribers`.
- `pg_cron` — scheduler for the 8-step generation pipeline trigger (job definitions land in feature 06).
- `pg_net` — `net.http_post(...)` used by `pg_cron` to call the API.

Already installed: `plpgsql`, `pgcrypto`, `uuid-ossp`. Enabled in this feature: `pg_trgm`, `citext`, `pg_cron`, `pg_net`.

## Migrations and RLS

- All migrations live under `libs/db/drizzle/` and are committed.
- Apply with `pnpm db:migrate` (uses `DIRECT_DATABASE_URL`).
- RLS is enforced on every table. `apps/api` connects with the service role and is the trust boundary. Public reads on `articles` / `article_translations` go through the API — direct anon access is only for the future admin dashboard bound to RLS policies.

## Deferred until feature 15

- Prod Supabase project creation.
- Fly.io secret wiring (`fly secrets set DATABASE_URL=... SUPABASE_SECRET_KEY=...`).
- Vercel env vars (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`).
- Backup/restore policy and custom retention.
- PITR upgrade (requires Pro plan).
