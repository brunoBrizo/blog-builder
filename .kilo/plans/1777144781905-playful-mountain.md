# Testing Setup Guide: Features 01–07

**Plan file:** `.kilo/plans/1777144781905-playful-mountain.md`  
**Scope:** Everything required to locally test features 1 through 7 end-to-end.  
**Created:** 2026-04-25  
**Planner:** project-planner (repo-discovery + feature-spec survey)

---

## TL;DR — What You Need

| Layer            | What                                              | Why                                       |
| ---------------- | ------------------------------------------------- | ----------------------------------------- |
| **Tools**        | Node.js (`.nvmrc`), pnpm ≥ 10                     | Build the monorepo                        |
| **Database**     | Supabase Postgres project (dev)                   | All data lives here                       |
| **Env**          | `.env` at repo root (copy from `.env.example`)    | API refuses to boot without required vars |
| **Integrations** | Perplexity API key, Resend API key                | Article generation pipeline               |
| **Scheduler**    | Inngest dev server (`npx inngest-cli@latest dev`) | Runs the 8-step generation pipeline       |
| **Data**         | `pnpm db:migrate` + `pnpm db:seed`                | Schema + seed article for smoke tests     |
| **Runtime**      | API (`:3001`) + Web (`:3000`) running together    | Feature 07 needs API to serve articles    |

---

## Feature-by-Feature Testing Prerequisites

### Feature 01 — Foundation (Monorepo & Tooling)

**Already verified at build time.** No external services needed.

- `pnpm install` completes.
- `pnpm nx run-many -t lint,test,build -p api,web,seo,shared-types,db` passes.
- Pre-commit hook blocks bad commits.

**Test command:**

```bash
pnpm nx run-many -t lint,test,build --all
```

---

### Feature 02 — Database & Data Layer

**Requires:** Supabase Postgres (dev project).

**Setup steps:**

1. Create a Supabase project (free tier is fine for dev).
2. Copy `DATABASE_URL` (pooled, port **6543**) and `DIRECT_DATABASE_URL` (direct, port **5432**) from Supabase → Settings → Database → Connection String.
3. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (service role key, `sb_secret_…`).
4. Run migrations and seed:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

**Verify:**

- `pnpm db:studio` opens Drizzle Studio; tables visible.
- Seed creates 1 author (`Site Owner`), 3 categories (`Engineering`, `Design`, `Growth`), 1 published article (`welcome-smoke-test`) with 3 translations (`en`, `pt-BR`, `es`) and 3 citations.

**Test command:**

```bash
pnpm db:studio
# Or query directly:
psql $DATABASE_URL -c "SELECT count(*) FROM articles;"  # should return 1
```

---

### Feature 03 — API Foundation

**Requires:** Feature 02 DB + env vars for API boot.

**Minimal env for API boot:**

```
NODE_ENV=development
PORT=3001
DATABASE_URL=<pooled Supabase URL>
PERPLEXITY_API_KEY=pplx-xxx        (any non-empty string; not used until feature 05)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxx
RESEND_API_KEY=re_xxx              (any non-empty string; not used until feature 12)
CRON_SHARED_SECRET=dev-cron-secret
REVALIDATE_SHARED_SECRET=dev-revalidate-secret
```

**Setup steps:**

1. Copy `.env.example` → `.env` and fill the above.
2. Start API:
   ```bash
   pnpm nx serve api
   ```

**Verify:**

- `GET http://localhost:3001/api/health` → `{ "status": "ok" }`
- `GET http://localhost:3001/api/ready` → `{ "ready": true }` (requires DB reachable)
- `GET http://localhost:3001/api/test/cron` without `x-cron-secret` → `401`
- `POST http://localhost:3001/api/test/rate-limit` 3× → third returns `429`
- `POST http://localhost:3001/api/revalidate` without secret → `401`

**Test command:**

```bash
# Health
curl http://localhost:3001/api/health
# Ready (needs DB)
curl http://localhost:3001/api/ready
# Auth guard
curl http://localhost:3001/api/test/cron
```

---

### Feature 04 — Web Foundation

**Requires:** Feature 01 (builds) + `NEXT_PUBLIC_API_BASE_URL` env var.

**Minimal env for web:**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_SHARED_SECRET=dev-revalidate-secret
```

**Setup steps:**

1. Ensure `.env` has the above.
2. Start web:
   ```bash
   pnpm nx serve web
   ```

**Verify:**

- `http://localhost:3000/` renders with header, footer, correct `lang="en"`.
- `http://localhost:3000/pt-br/` renders with `lang="pt-BR"`.
- Language switcher preserves path.
- Theme toggle persists across reload.
- Lighthouse on home placeholder: Performance ≥ 90, SEO = 100.

**Test command:**

```bash
pnpm nx serve web
# In another terminal:
curl -s http://localhost:3000/ | grep -o 'lang="[^"]*"'
```

---

### Feature 05 — Perplexity Article Pipeline

**Requires:** Feature 03 (API running) + **Perplexity API key** + **Inngest dev server**.

**Additional env:**

```
INNGEST_EVENT_KEY=            (empty in dev — OK)
INNGEST_SIGNING_KEY=          (empty in dev — OK)
INNGEST_SERVE_PATH=/api/inngest
```

**Setup steps:**

1. Confirm `PERPLEXITY_API_KEY` is a **real, valid** Perplexity key (`pplx-…`).
2. Start API (`pnpm nx serve api`).
3. In a **second terminal**, start Inngest dev server:
   ```bash
   npx inngest-cli@latest dev
   ```
4. In the Inngest Dev UI (http://127.0.0.1:8288), set sync URL to `http://localhost:3001/api/inngest`.
5. Confirm `generate-article` function is registered in the UI.

**Trigger a test run:**

```bash
curl -sS -X POST "http://localhost:3001/api/internal/articles/generate" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: dev-cron-secret" \
  -d '{"topicSeed":"Smoke test: testing the blog builder pipeline","locales":["en"],"autoPublish":true}'
```

**Expected:** `202 { "jobId": "<uuid>" }`. Inngest UI shows a run; API logs show Perplexity steps. After completion, a new `articles` row exists with `status = 'published'`.

**Cost warning:** Each run costs real Perplexity tokens. Use short topics, limit locales, and set `GENERATION_PER_RUN_TOKEN_BUDGET` low (e.g., `50000`) in `.env`.

**Verify:**

- Job row created in `generation_jobs`.
- Steps persisted in `generation_steps`.
- Article + translation rows created.
- Citations persisted in `article_citations`.

**Test command:**

```bash
# Check monthly spend / kill switch
curl -sS "http://localhost:3001/api/internal/articles/generation/monthly-spend" \
  -H "x-cron-secret: dev-cron-secret"
```

---

### Feature 06 — Scheduled Article Generation

**Requires:** Feature 05 working + `pg_cron` enabled in Supabase + `WEB_PUBLIC_ORIGIN` set.

**Additional env:**

```
WEB_PUBLIC_ORIGIN=http://localhost:3000
GENERATION_DEFAULT_AUTHOR_ID=b1111111-1111-4111-8111-111111111111
```

**Setup steps:**

1. Enable `pg_cron` extension in Supabase (Database → Extensions).
2. The `pg_cron` job SQL migration should already be in `libs/db/drizzle/`. Apply it:
   ```bash
   pnpm db:migrate
   ```
3. Verify cron job exists:
   ```sql
   SELECT * FROM cron.job;
   ```
4. Ensure `WEB_PUBLIC_ORIGIN` matches the web app URL.

**To test without waiting for cron schedule:** Manually trigger the internal endpoint (same as feature 05) but omit `topicSeed` — the API picks from the topic queue.

```bash
curl -sS -X POST "http://localhost:3001/api/internal/articles/generate" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: dev-cron-secret" \
  -d '{"autoPublish":true}'
```

**Verify:**

- On publish, ISR revalidation is triggered.
- Web page at `http://localhost:3000/en/articles/<new-slug>` reflects the article within seconds.
- `cron.job_run_details` shows successful executions.

**Test command:**

```bash
# Query cron run history
psql $DATABASE_URL -c "SELECT jobid, status, start_time, end_time FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;"
```

---

### Feature 07 — Article Reading Experience

**Requires:** Feature 02 (seed data) OR Feature 05/06 (real generated articles) + Feature 03 (API) + Feature 04 (Web).

**Setup steps:**

1. Ensure API is running (`pnpm nx serve api`).
2. Ensure web is running (`pnpm nx serve web`).
3. Ensure `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api` in `.env`.

**Smoke test with seed data:**

```bash
curl -sS "http://localhost:3001/api/articles/en/welcome-smoke-test"
```

**Expected:** `200` with a `PublicArticleDetail` JSON payload including `translations`, `neighbors`, `citations`, `faq`.

**View in browser:**

```
http://localhost:3000/en/articles/welcome-smoke-test
```

**Verify:**

- Page renders without errors.
- Title, subhead, author box, body HTML, FAQ, citations all visible.
- `<title>` uses `metaTitle`.
- `<meta name="description">` uses `metaDescription`.
- Canonical link present.
- Hreflang alternates present (check `<head>`).
- JSON-LD scripts in page source (`view-source:`).
- Table of Contents scroll-spies to H2 headings.
- `notFound()` triggers for bad slugs (e.g., `/en/articles/nonexistent`).

**API list endpoint test:**

```bash
curl -sS "http://localhost:3001/api/articles?locale=en&limit=5"
```

**Expected:** `200` with `{ items: [...], nextCursor: null }` containing only published articles.

**Lighthouse / Accessibility (requires production build):**

```bash
pnpm nx run web:build:production
npx serve dist/apps/web
# Then run Lighthouse in Chrome DevTools on /en/articles/welcome-smoke-test
```

**Target scores:** Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.

---

## Complete Environment Variable Checklist

Copy `.env.example` to `.env` and fill every row marked **Required**:

| Variable                       | Required For            | Notes                             |
| ------------------------------ | ----------------------- | --------------------------------- |
| `DATABASE_URL`                 | F02, F03, F05, F06, F07 | Pooled (6543)                     |
| `DIRECT_DATABASE_URL`          | F02                     | Direct (5432) for migrations      |
| `SUPABASE_URL`                 | F03, F05                | `https://<ref>.supabase.co`       |
| `SUPABASE_SECRET_KEY`          | F03, F05                | Service role key (`sb_secret_…`)  |
| `PORT`                         | F03                     | API port; default 3001            |
| `NODE_ENV`                     | F03                     | `development` or `production`     |
| `PERPLEXITY_API_KEY`           | F05                     | Real key required for generation  |
| `RESEND_API_KEY`               | F03                     | Any non-empty string OK until F12 |
| `CRON_SHARED_SECRET`           | F03, F05, F06           | Shared secret for internal routes |
| `REVALIDATE_SHARED_SECRET`     | F03, F04, F06, F07      | Must match between API and web    |
| `CORS_ORIGIN_WEB`              | F03                     | `http://localhost:3000`           |
| `NEXT_PUBLIC_API_BASE_URL`     | F04, F07                | `http://localhost:3001/api`       |
| `NEXT_PUBLIC_SITE_URL`         | F04, F07                | `http://localhost:3000`           |
| `WEB_PUBLIC_ORIGIN`            | F06                     | `http://localhost:3000`           |
| `GENERATION_DEFAULT_AUTHOR_ID` | F05, F06                | Matches seed author UUID          |
| `INNGEST_EVENT_KEY`            | F05                     | Empty OK in dev                   |
| `INNGEST_SIGNING_KEY`          | F05                     | Empty OK in dev                   |

---

## Step-by-Step First-Time Setup

Run these commands **in order** from the repo root:

```bash
# 1. Node & pnpm
nvm use                          # or install Node version from .nvmrc

# 2. Install dependencies
pnpm install

# 3. Environment
#    - Copy .env.example → .env
#    - Fill all required variables (see checklist above)

# 4. Database
pnpm db:migrate                  # apply schema
pnpm db:seed                     # seed author, categories, smoke article

# 5. Verify monorepo builds
pnpm nx run-many -t lint,build -p api,web,seo,shared-types

# 6. Start API (terminal 1)
pnpm nx serve api

# 7. Start web (terminal 2)
pnpm nx serve web

# 8. (Optional) Start Inngest dev server (terminal 3)
npx inngest-cli@latest dev
```

At this point:

- Feature 01: ✅ Verified by build
- Feature 02: ✅ Verified by `db:studio` + seed data
- Feature 03: ✅ Verified by `/api/health`, `/api/ready`
- Feature 04: ✅ Verified by `http://localhost:3000/`
- Feature 07: ✅ Verified by `http://localhost:3000/en/articles/welcome-smoke-test`

For features 05 and 06, trigger the pipeline via curl (see feature 05 section).

---

## Testing Without Real Perplexity / Inngest

If you only want to test **Feature 07** (article reading) without running the full generation pipeline:

1. Complete steps 1–5 above.
2. Manually insert a published article into the DB (or rely on seed data).
3. Start API + web.
4. Visit `http://localhost:3000/en/articles/welcome-smoke-test`.

You do **not** need Perplexity, Inngest, or Resend for this path.

---

## What's Missing for Full E2E Testing

| Gap                                                    | Impact                                   | Workaround                                          |
| ------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------- |
| No Playwright E2E tests written yet                    | No automated browser testing             | Manual browser verification + Lighthouse            |
| No `pg_cron` in local Postgres (if not using Supabase) | Feature 06 scheduling untestable locally | Use Supabase dev project (free)                     |
| No mock Perplexity server                              | Every pipeline test costs real tokens    | Use seed data for F07; test F05 sparingly           |
| No `article_tags` seed data                            | Tags section on article page empty       | Seed script does not insert tags; F05 pipeline does |
| `bodyHtml` from seed lacks `id` on H2s                 | TOC extraction yields empty array        | Real pipeline output has IDs; seed HTML is minimal  |

---

## Quick Verification Matrix

Run these curls after API is up:

```bash
# F03 — API health
curl -s http://localhost:3001/api/health | jq .

# F03 — Auth guard
curl -s http://localhost:3001/api/test/cron | jq .

# F07 — Public article detail
curl -s http://localhost:3001/api/articles/en/welcome-smoke-test | jq .

# F07 — Article list
curl -s "http://localhost:3001/api/articles?locale=en&limit=5" | jq .

# F07 — 404 for missing
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/articles/en/does-not-exist
# Expected: 404

# F05/F06 — Monthly spend (needs cron secret)
curl -s -H "x-cron-secret: dev-cron-secret" http://localhost:3001/api/internal/articles/generation/monthly-spend | jq .

# F05/F06 — Trigger generation (needs real Perplexity key + Inngest)
curl -s -X POST http://localhost:3001/api/internal/articles/generate \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: dev-cron-secret" \
  -d '{"topicSeed":"Test topic","locales":["en"],"autoPublish":true}' | jq .
```

---

## Open Questions

1. **Do you have a Supabase dev project ready?** If not, that's the first blocker.
2. **Do you have a valid Perplexity API key?** Required only for testing features 05 and 06. Feature 07 works with seed data alone.
3. **Do you want to test ISR revalidation end-to-end?** This requires the full F05→F06 pipeline to produce a published article, then verifying the web cache invalidates within 5 seconds.
4. **Do you want Lighthouse/axe-core scores documented?** This requires a production build (`nx run web:build:production`) and a real browser or headless Chrome.
