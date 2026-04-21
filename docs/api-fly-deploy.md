# Fly.io: API app

Multi-stage build: [`Dockerfile`](../Dockerfile) runs `nx run api:build:production`, then `node dist/apps/api/main.js` on port `3001`.

## Health

Configure HTTP checks on `GET /api/health` (see [`fly.toml`](../fly.toml)). Readiness that hits the database is `GET /api/ready`.

## Secrets

Set at least:

- `DATABASE_URL` — pooled Supabase URL for runtime.
- `DIRECT_DATABASE_URL` — optional locally; Fly `release_command` runs migrations and needs a direct (non-pooler) URL if your pooler cannot run DDL. Match what you use for `pnpm db:migrate`.
- `PERPLEXITY_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`
- `CRON_SHARED_SECRET`, `REVALIDATE_SHARED_SECRET`
- `CORS_ORIGIN_WEB` — production web origin (e.g. `https://your-app.vercel.app`). Required when `NODE_ENV=production`.
- **Inngest (required in production)** — `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`. Optional: `INNGEST_SERVE_PATH` (default `/api/inngest`). The API rejects unsigned `POST` requests to the serve path with **401** when the signing key is set.
- **Article generation** — optional overrides: `GENERATION_PER_RUN_TOKEN_BUDGET`, `GENERATION_DAILY_USD_CEILING`, `GENERATION_KILL_SWITCH`, `GENERATION_DEFAULT_AUTHOR_ID`, `PERPLEXITY_TIMEOUT_MS`, `PERPLEXITY_USD_PER_MTOKENS_PROMPT`, `PERPLEXITY_USD_PER_MTOKENS_COMPLETION` (see `apps/api/src/core/config/env.schema.ts`).
- Optional: `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`
- Optional: `CRON_IP_ALLOWLIST` — comma-separated CIDRs; empty disables IP checks for cron routes.
- Optional: `TRUST_PROXY=true` on Fly so `Fly-Client-IP` / `X-Forwarded-For` work with the cron allowlist.

Operations: replay, memoized steps, kill switch — [Inngest article pipeline runbook](./inngest-article-pipeline.md).

Example:

```bash
fly secrets set \
  DATABASE_URL="postgresql://..." \
  DIRECT_DATABASE_URL="postgresql://..." \
  PERPLEXITY_API_KEY="..." \
  SUPABASE_URL="https://....supabase.co" \
  SUPABASE_SECRET_KEY="sb_secret_..." \
  RESEND_API_KEY="..." \
  CRON_SHARED_SECRET="..." \
  REVALIDATE_SHARED_SECRET="..." \
  CORS_ORIGIN_WEB="https://..." \
  INNGEST_EVENT_KEY="..." \
  INNGEST_SIGNING_KEY="..."
```

## Release command

`release_command` runs `tsx libs/db/scripts/migrate.ts` before new versions go live. The image installs `tsx` globally (`Dockerfile`). Ensure `DATABASE_URL` or migration-specific env matches what Drizzle expects in [`libs/db/scripts/migrate.ts`](../libs/db/scripts/migrate.ts).

## Web → API

Next.js should set `NEXT_PUBLIC_API_BASE_URL` to the public API origin **including** `/api`, e.g. `https://blog-builder-api.fly.dev/api`. Server-only calls use `REVALIDATE_SHARED_SECRET` for `POST /api/revalidate` (see [`apps/web/src/lib/api-client/revalidate.ts`](../apps/web/src/lib/api-client/revalidate.ts)).
