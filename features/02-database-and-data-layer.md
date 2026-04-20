# 02. Database & Data Layer

## Goal

Provision the Supabase Postgres database and define the schema, migrations, Row Level Security, and typed access layer that every other feature depends on.

## Dependencies

- [01. Foundation — Monorepo & Tooling](./01-foundation-monorepo-tooling.md).

## Scope

In scope:

- Supabase project provisioning (dev + prod).
- Full Drizzle schema for every table the program will use, grouped by aggregate root.
- Initial migration plus hand-written SQL migrations for Postgres-native features (extensions, generated columns, indexes, RLS, `pg_cron`, `net.http_post`).
- Typed client wrapper exposed from `libs/db` and a `DrizzleModule` for NestJS dependency injection.
- Zod contracts in `libs/shared-types` that mirror every write DTO and public read shape.

Out of scope:

- `pg_cron` job _definitions_ that POST to the API (done in feature 06).
- Full-text search `tsvector`/GIN index tuning (done in feature 09, but the column is scaffolded here).

## Data model touchpoints (authoritative list)

- `articles` — canonical article record (locale-independent): id, slug-per-locale pointer, author, category, published_at, status, cover_image_url, word_count_target, token_cost_total.
- `article_translations` — per-locale body, TL;DR, key_takeaways, faq, meta_title, meta_description, og_title, og_description, slug, reading_time, `tsvector` column (column declared here, index added in feature 09).
- `article_citations` — inline sources captured from Perplexity `search_results` for each translation.
- `article_analytics_snapshots` — monthly GA4 pull used to rank top-N articles for refresh.
- `authors` — real name, bio, photo, expertise, `sameAs` links for E-E-A-T + Person JSON-LD.
- `categories` and `tags` — with translation tables for localized names and slugs.
- `generation_jobs` — one row per pipeline run; one sub-row per of the 8 steps with input, output, tokens, cost, status, error.
- `newsletter_subscribers` — email, locale, confirmation_token, confirmed_at, unsubscribed_at, one-click unsubscribe token.
- `newsletter_digests` — one row per weekly send, per locale, listing article ids included.
- `contact_messages` — submissions from the contact page.
- `admin_users` — mirror of Supabase Auth users allowed into `/admin`.

Every table carries `id uuid`, `created_at timestamptz`, `updated_at timestamptz`, and where applicable `deleted_at timestamptz`, per [`drizzle-guidelines.mdc`](../.cursor/rules/drizzle-guidelines.mdc).

## Backend work

- Provision Supabase dev and prod projects. Capture `DATABASE_URL`, service role key, anon key as Fly.io / Vercel secrets.
- Enable extensions: `pgcrypto`, `pg_trgm`, `pg_cron`, `pg_net`, `uuid-ossp` (as raw SQL migration committed to `libs/db/drizzle/`).
- Author schema files in `libs/db/src/schema/*.ts`, one file per aggregate root, re-exported from `libs/db/src/schema/index.ts`.
- Generate the initial migration via `drizzle-kit generate`. Review the SQL, commit it alongside the schema.
- Write hand-crafted SQL migrations for: generated `tsvector` columns, `pg_trgm` indexes, updated_at triggers, and RLS policies for every table.
- Implement `libs/db/src/client.ts` with a single `postgres.js` pool per process and a typed Drizzle instance.
- Expose a NestJS `DrizzleModule` providing a `DRIZZLE` DI token consumed by repositories.
- Seed script in `libs/db/scripts/seed.ts` that inserts the owner author, three categories, and a smoke-test article for local development.
- Define every write DTO and every public read shape as Zod schemas in `libs/shared-types`. Infer TS types from Zod.

## Frontend work

None. The web app never imports `libs/db` directly — data reaches `apps/web` via `apps/api` HTTP endpoints defined in later features.

## Acceptance criteria

- `pnpm drizzle-kit migrate` applies every migration against a clean Postgres and completes green.
- Integration test (Testcontainers Postgres) inserts and reads back every aggregate root.
- RLS policies deny anon access to `generation_jobs`, `contact_messages`, `admin_users`, and `newsletter_subscribers` email column (verified via anon-role tests).
- `libs/db` and `libs/shared-types` build cleanly and expose inferred types (no `any`).
- Connection pool initializes in under 100 ms on a `shared-cpu-1x` Fly.io machine.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#data-layer)
- [`.cursor/rules/drizzle-guidelines.mdc`](../.cursor/rules/drizzle-guidelines.mdc)
