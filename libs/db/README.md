# `libs/db`

Drizzle ORM schema, SQL migrations, Postgres client factory, and NestJS `DrizzleModule` for the blog-builder API.

## Prerequisites

- Postgres 15+ (Supabase dev, Docker, or Testcontainers).
- Extensions used by migrations: `citext`, `pgcrypto`, `pg_trgm`, `uuid-ossp` (see `drizzle/20260420220006_post_schema_infrastructure.sql`). `pg_net` is optional and only installed when present (Supabase).

**Important:** Run database commands via `pnpm db:migrate`, not raw `drizzle-kit migrate` on an empty database. The wrapper in `scripts/migrate.ts`:

1. Enables `citext` / `pgcrypto` _before_ the first Drizzle-generated file runs (that file creates tables that reference `citext`).
2. Creates stub `anon` and `authenticated` roles when missing (vanilla Postgres), because RLS policies reference those role names (same as Supabase).

If you must use `drizzle-kit migrate` directly, run the SQL in `scripts/prerequisites.ts` (`ensureMigrationPrerequisites` + `ensurePolicyRoles`) first, or apply an equivalent bootstrap.

## Environment

See repo root `.env.example`. Typical variables:

- `DATABASE_URL` — pooled URL (app runtime, `pnpm db:seed`).
- `DIRECT_DATABASE_URL` — direct port 5432 URL for `drizzle-kit generate` / `pnpm db:migrate`.

## Scripts (workspace root)

| Command            | Purpose                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `pnpm db:generate` | `drizzle-kit generate` — emit SQL from `src/schema`.                                                     |
| `pnpm db:migrate`  | Apply migrations (`scripts/migrate.ts` + `libs/db/drizzle/*.sql`).                                       |
| `pnpm db:seed`     | Idempotent dev seed (`scripts/seed.ts`).                                                                 |
| `pnpm db:reset`    | **Local only:** `DROP SCHEMA public` + recreate. Refuses hosted Supabase URLs unless `FORCE_DB_RESET=1`. |
| `pnpm db:studio`   | Drizzle Studio.                                                                                          |

Nx wrappers (caching-friendly): `nx run db:generate`, `nx run db:migrate`.

## Tests

- Unit / fast: `nx test db` (excludes `tests/integration`).
- Integration (Docker required): `nx run db:test:integration` — Postgres 17 via Testcontainers, full migrations, aggregate CRUD + RLS checks.

## Row Level Security (gotchas)

- Migrations enable RLS on all public tables. Only **published** articles (and related translations, citations, tags) are readable by `anon` / `authenticated` roles, per policies in `20260420220006_post_schema_infrastructure.sql`.
- Tables such as `generation_jobs`, `contact_messages`, `admin_users`, `newsletter_subscribers`, etc. have **no** public `SELECT` policies: clients using the anon role see **zero rows**, not errors.
- The NestJS API should use a **service role** (or other role that bypasses RLS) for trusted server-side writes and reads.

## Adding a table

1. Add or extend a file under `src/schema/` and export from `src/schema/index.ts`.
2. `pnpm db:generate` then review the new SQL under `drizzle/`.
3. If you need triggers, generated columns, or RLS, add or extend a hand-written migration in `drizzle/` and register it with `drizzle-kit` (journal in `drizzle/meta/`).
4. Mirror contracts in `libs/shared-types` and extend `src/__drift__.ts` if you keep compile-time drift checks.
