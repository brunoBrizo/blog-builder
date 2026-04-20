# 03. API Foundation

## Goal

Turn the empty NestJS app into a production-ready HTTP service: authenticated edges, shared validation, error handling, logging, config, and a baseline deployment on Fly.io. Every backend feature after this plugs into the foundation defined here.

## Dependencies

- [01. Foundation — Monorepo & Tooling](./01-foundation-monorepo-tooling.md).
- [02. Database & Data Layer](./02-database-and-data-layer.md).

## Scope

In scope:

- Typed config module, global validation, error handling, logging, and security middleware.
- Authentication edges for the two classes of caller the API serves: the Supabase `pg_cron` caller (shared secret) and the `apps/web` ISR/revalidation caller (shared secret).
- Per-route rate limiting via `@nestjs/throttler`.
- First deployable version on Fly.io with scale-to-zero enabled.
- Health, readiness, and version endpoints.

Out of scope:

- Business endpoints (articles, newsletter, contact) — each has its own feature.
- Admin dashboard auth (feature 15).

## Backend work

- `ConfigModule` loads a Zod-validated config from environment: `DATABASE_URL`, `PERPLEXITY_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SHARED_SECRET`, `REVALIDATE_SHARED_SECRET`, `SENTRY_DSN`, `LOG_LEVEL`, `NODE_ENV`, `PORT`. Boot fails loud if any required value is missing.
- Global `ValidationPipe` wired to Zod (via `zod-validation-pipe` or equivalent) so every controller input is validated against `libs/shared-types`.
- Global `HttpExceptionFilter` produces a consistent JSON error contract (`{ error: { code, message, details? } }`) and never leaks stack traces.
- Pino logger with request id, duration, status, and Sentry breadcrumb correlation.
- Helmet with a sensible CSP baseline, strict CORS (only `apps/web` production origin + `https://<ref>.supabase.co`), and compression.
- `CronAuthGuard` — validates the shared-secret header used by Supabase `pg_cron` callers and (optionally) an IP allowlist.
- `RevalidateAuthGuard` — validates the shared-secret header used by `apps/web` when requesting on-demand ISR revalidation.
- `ThrottlerModule` configured with tiered limits: public reads relaxed, public writes tight, admin routes their own bucket.
- Sentry initialized via `@sentry/nestjs` with PII scrubbing on.
- `/health` (liveness), `/ready` (DB reachable), `/version` (git sha + release tag) endpoints.
- Dockerfile (multi-stage) and `fly.toml` configured for `shared-cpu-1x`, `auto_stop_machines = "stop"`, 1 min machine, primary region close to Supabase. Release command runs `drizzle-kit migrate`.
- Secrets set via `fly secrets set` — never committed.

## Frontend work

- Add a typed API client module in `apps/web` that reads the API base URL from an environment variable and attaches the revalidation shared-secret header when calling revalidate endpoints.
- No user-visible UI changes.

## Acceptance criteria

- API boots locally against Supabase dev and serves `/health`, `/ready`, `/version`.
- An integration test proves that a request without the shared-secret header to a guarded route returns 401.
- Deploy to Fly.io succeeds via `fly deploy`; first request after idle warms the machine in under 3 s.
- Sentry receives a test exception in staging.
- Rate limits are enforced (integration test: 429 after N requests per window).

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#hosting-and-deployment)
- [`.cursor/rules/nestjs-guidelines.mdc`](../.cursor/rules/nestjs-guidelines.mdc)
- [`.cursor/rules/general-guidelines.mdc`](../.cursor/rules/general-guidelines.mdc)
