# Environment variables — quick reference

Authoritative templates: **[`.env.example`](../../.env.example)** at the repo root. The API validates **`process.env`** at boot with Zod in [`apps/api/src/core/config/env.schema.ts`](../../apps/api/src/core/config/env.schema.ts).

## How the monorepo loads env

- **`apps/api`** — `dotenv/config` in `main.ts`; reads **repo-root** `.env` when you start the process from the workspace (typical `nx serve api`).
- **`libs/db` scripts** (`db:migrate`, `db:seed`, …) — `dotenv/config`; run **`pnpm …` from repo root** so `.env` resolves.
- **`apps/web`** — Next.js reads `.env`, `.env.local`, etc. at the **repo root** (Next’s default project root for this app).

Keep **one** `.env` at the root unless you intentionally split secrets; avoids drift between API and scripts.

## Supabase & Postgres

| Variable                   | Required                 | Notes                                                                                |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `DATABASE_URL`             | **Yes** (API, seed)      | Pooled (**6543** on Supabase). Runtime queries.                                      |
| `DIRECT_DATABASE_URL`      | **Strongly recommended** | Direct (**5432**). Used by `pnpm db:migrate`, `drizzle-kit`, `pnpm db:studio`.       |
| `SUPABASE_URL`             | **Yes** (API)            | `https://<ref>.supabase.co`                                                          |
| `SUPABASE_SECRET_KEY`      | **Yes** (API)            | Server secret (`sb_secret_…`). Never expose to the browser.                          |
| `SUPABASE_PUBLISHABLE_KEY` | In `.env.example`        | For future client-side Supabase; not required by `env.schema.ts` for API boot today. |

See [Supabase setup](../supabase-setup.md) for where to copy connection strings.

## API (`apps/api`) — required at boot

Validated in `env.schema.ts`:

| Variable                   | Notes                                                         |
| -------------------------- | ------------------------------------------------------------- |
| `NODE_ENV`                 | `development` \| `production` \| `test`                       |
| `DATABASE_URL`             | Non-empty connection string                                   |
| `PERPLEXITY_API_KEY`       | Required even if you only browse the site; generation uses it |
| `SUPABASE_URL`             | Valid URL                                                     |
| `SUPABASE_SECRET_KEY`      | Non-empty                                                     |
| `RESEND_API_KEY`           | Non-empty                                                     |
| `CRON_SHARED_SECRET`       | Protects `internal/*` cron-style routes                       |
| `REVALIDATE_SHARED_SECRET` | Shared with web for revalidation calls                        |

Common optional / defaulted:

| Variable                                   | Default / behavior                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `PORT`                                     | Schema default **3000**; `.env.example` uses **3001** — set explicitly to avoid surprises                |
| `LOG_LEVEL`                                | `info`                                                                                                   |
| `CORS_ORIGIN_WEB`                          | Optional in **development**; **required** (non-empty URL) when `NODE_ENV=production`                     |
| `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` | Empty OK in **development**; **both required** in **production**                                         |
| `INNGEST_SERVE_PATH`                       | Default `/api/inngest`                                                                                   |
| `GENERATION_*`, `PERPLEXITY_*`             | Documented in `.env.example`; defaults in schema — see [Cost and safety knobs](cost-and-safety-knobs.md) |
| `SENTRY_DSN`                               | Optional                                                                                                 |
| `ENABLE_TEST_ENDPOINTS`                    | Optional dev-only probes                                                                                 |

## Web (`apps/web`)

Not all of these are enforced by a single Zod schema at build time; missing values fail at **runtime** when code paths run.

| Variable                   | Purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Browser + server API base, include `/api` (e.g. `http://localhost:3001/api`)        |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site origin for SEO helpers (no trailing slash)                           |
| `REVALIDATE_SHARED_SECRET` | Server-side; must match API’s `REVALIDATE_SHARED_SECRET` for `POST /api/revalidate` |

## Production-only checks (API)

When `NODE_ENV=production`, the schema additionally requires:

- `CORS_ORIGIN_WEB`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

## Generating secrets

For `CRON_SHARED_SECRET` and `REVALIDATE_SHARED_SECRET`, use long random strings (not the `dev-*` placeholders in public examples) in any shared or deployed environment.

## Related docs

- [Local first run](local-first-run.md)
- [Database workflows](database-workflows.md) — which URL each command uses
- [Inngest setup](inngest-setup-and-testing.md) — when Inngest keys matter
