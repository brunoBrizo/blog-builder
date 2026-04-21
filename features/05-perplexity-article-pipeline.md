# 05. Perplexity Article Pipeline

## Goal

Implement the 8-call Perplexity orchestration defined in [`docs/built-article-steps.md`](../docs/built-article-steps.md) as an **Inngest-driven**, reliable, resumable, observable backend workflow that takes a topic and produces a publish-ready article in `en`, `pt-br`, and `es` persisted to Supabase.

The pipeline runs as a single Inngest multi-step function. Orchestration, retries, per-step checkpointing, and concurrency control are delegated to Inngest; the NestJS API only hosts the function handler and owns domain persistence (articles, translations, citations, cost accounting).

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md).
- [03. API Foundation](./03-api-foundation.md) — already shipped. This feature extends the existing config module and mounts a new HTTP handler; no breaking changes to feature 03.

## Scope

In scope:

- Extend the typed `ConfigModule` with `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`, and `INNGEST_SERVE_PATH` (default `/api/inngest`). Update `.env.example` and Fly secrets documentation.
- Mount the Inngest HTTP handler at `POST /api/inngest` using the NestJS/Express adapter; the handler verifies Inngest request signatures and is explicitly excluded from `CronAuthGuard` / `RevalidateAuthGuard`.
- Typed Perplexity HTTP client with timeout, token/cost accounting, and citation capture (retries and backoff are handled by Inngest at the step level).
- Prompt builders for all 8 steps in `libs/prompts`, typed end-to-end with Zod response schemas.
- Inngest function `generate-article` that runs the 8 steps in order via `step.run(...)`, persists each step's input/output to `generation_jobs` / `generation_steps`, and writes the final article + translations atomically.
- A manual trigger endpoint (`POST /internal/articles/generate`) that emits the `article/generation.requested` event and returns `202 { jobId }` immediately.
- Cost + token logging per run; monthly Perplexity spend reported in `/admin` (UI in feature 15, data persisted here).

Out of scope:

- Scheduling (feature 06).
- Public rendering of generated articles (feature 07).
- Editor UI for pre-publish review (feature 15).

## 8-step contract (authoritative summary)

Full details live in [`docs/built-article-steps.md`](../docs/built-article-steps.md). At a glance:

1. Topic research — returns 10 scored topic candidates.
2. Competitor analysis — returns structural insights and a gap map for the chosen topic.
3. Outline — returns the H2/H3 skeleton with target keywords per section.
4. Write — returns the long-form English body with citations.
5. Humanize — returns a de-AI'd, E-E-A-T-strong English draft.
6. SEO metadata — returns title, meta description, OG, slug, FAQ JSON-LD seeds.
7. Translate to `pt-br` — returns localized body + metadata with locale-correct slugs.
8. Translate to `es` — same as step 7 for Spanish.

Each step maps 1:1 to an Inngest `step.run("N-step-name", …)` call so each checkpoint is memoized and independently retriable.

## Backend work

### Config + Inngest handler (extends feature 03)

- Add to the Zod-validated config schema in `ConfigModule`:
  - `INNGEST_EVENT_KEY` (required in prod, optional in dev where Inngest dev server accepts anything).
  - `INNGEST_SIGNING_KEY` (required in prod, optional in dev).
  - `INNGEST_SERVE_PATH` (optional, default `/api/inngest`).
- Boot must fail loud in `NODE_ENV=production` if either key is missing; in development, fall back to the Inngest dev server (`http://127.0.0.1:8288`) with a warning log.
- Create `InngestModule` that:
  - Instantiates a single `Inngest` client (`new Inngest({ id: 'blog-builder-api', eventKey: config.INNGEST_EVENT_KEY })`) and exports it as an injectable provider.
  - Registers the list of functions (initially just `generate-article`) via the serve handler.
- Mount the serve handler as a plain Express route before the NestJS global prefix, or via a controller using `@All('/api/inngest')`. Either way:
  - Exclude the route from `CronAuthGuard`, `RevalidateAuthGuard`, Helmet CSP restrictions that would block Inngest's payloads, and the global `ValidationPipe` (Inngest sends its own schema).
  - Keep it inside the global `HttpExceptionFilter` and Pino logger so errors/logs are still captured.
  - Do **not** apply CORS to `/api/inngest`; requests come server-to-server from Inngest Cloud.
- Update `fly.toml` / deployment notes to document `fly secrets set INNGEST_EVENT_KEY=… INNGEST_SIGNING_KEY=…`. Append the same keys to `.env.example` with placeholder values.

### Perplexity client

- Implement `PerplexityClient` (thin wrapper over `fetch`) with: `sonar-pro` as the default model, per-call timeout, and strict Zod validation of responses. Capture `usage.*` for token accounting and `search_results` for citations.
- Client is **stateless and non-retrying**. Retries, backoff, and 429/5xx handling live on the Inngest step (`retries`, `NonRetriableError`). This keeps the client simple and makes every retry observable in the Inngest dashboard.

### Prompt builders

- Typed prompt builders in `libs/prompts`, one per step, each returning `{ system, user }` strings plus the Zod schema for the expected response. Builders are pure functions consumed by the Inngest function.

### Inngest orchestration

- Install `inngest` in `apps/api`. The HTTP handler is already covered by the config + handler work above.
- Define a single function `generate-article` subscribed to the event `article/generation.requested` with:
  - `concurrency: { limit: <configurable, default 3> }` to cap parallel Perplexity runs and respect the global kill-switch budget.
  - `retries: 3` default at the function level; individual `step.run` calls override where appropriate.
  - `rateLimit` / `throttle` configured to stay under the Perplexity account rate ceiling.
- Function body runs the 8 steps as sequential `step.run` blocks (`1-research`, `2-competitor`, `3-outline`, `4-write`, `5-humanize`, `6-seo`, `7-translate-pt-br`, `8-translate-es`). Each block:
  - Reads the job row, calls the Perplexity client, validates with Zod, returns the parsed output.
  - Wraps deterministic DB writes for that step in the same `step.run` so the checkpoint includes persistence.
  - Throws `NonRetriableError` on budget/kill-switch/validation failures so Inngest stops retrying immediately.
- Translation steps 7 and 8 may run inside `Promise.all([...step.run(...)])` if concurrency budget allows; otherwise keep them sequential.

### Persistence

- Persist every step call to `generation_jobs` and a child `generation_steps` table (or a JSONB column of steps — single-table with a typed discriminated union is acceptable) with: step name, status, input prompt digest, raw output, parsed output, tokens, cost in USD, duration, Inngest `runId` + `stepId`, error (if any).
- After step 6, create a draft `articles` row (status `draft`); after steps 7 and 8, upsert the two additional `article_translations` rows; citations from steps 4–5 persist to `article_citations`.
- Pipeline finishes with `status = 'pending_review'`. Publishing (setting `published_at`, flipping status to `published`) happens via the admin dashboard in feature 15 or via an `autoPublish` flag on the event payload (used by the scheduled runner in feature 06 when human review is disabled).

### Trigger surface

- `POST /internal/articles/generate` (guarded by `CronAuthGuard` for the scheduler + an admin-guarded variant for feature 15):
  1. Inserts a `generation_jobs` row with status `queued`.
  2. Calls `inngest.send({ name: 'article/generation.requested', data: { jobId, topicSeed, autoPublish, locales } })`.
  3. Returns `202 { jobId }` immediately. No blocking HTTP.
- No custom `resume(jobId)` method. Resuming a failed run is handled by Inngest's built-in replay from the dashboard (or programmatically via the Inngest REST API). Completed `step.run` calls are memoized and skipped automatically.

### Guardrails and observability

- Enforce per-run token budget and per-day Perplexity spend ceiling inside the first `step.run`; exceeding either throws `NonRetriableError`.
- Global kill-switch flag read from config; when set, the function exits at step 1 with `NonRetriableError`.
- Structured Pino logs at every step (`jobId`, `runId`, `stepId`, step name, tokens, cost, duration). Errors ping Sentry with the `jobId` and Inngest `runId` tags.
- Inngest dashboard is the primary operational view for live runs; `generation_jobs` is the domain-level audit trail surfaced in `/admin`.

## Frontend work

None in this feature. The generation pipeline is invisible to end users; the admin dashboard (feature 15) surfaces it.

## Acceptance criteria

- End-to-end integration test (against a mocked Perplexity server and the Inngest dev server) takes a seed topic, emits the event, and produces an `articles` row plus three `article_translations` rows with valid slugs, metadata, and citations.
- Killing the Fly machine mid-run and letting Inngest re-drive the function completes the job without re-running already-completed steps (verified by step count in `generation_steps` and Inngest run timeline).
- Per-step cost and token counts are persisted and aggregate correctly for a single job.
- Hitting the per-day spend ceiling causes new generations to fail fast with a clear, non-retriable error (logged, surfaced to admin).
- `POST /internal/articles/generate` returns `202 { jobId }` in under 500 ms regardless of Perplexity latency.
- Inngest request signatures are verified; unsigned requests to `/api/inngest` are rejected with 401.
- Booting the API in `NODE_ENV=production` without `INNGEST_EVENT_KEY` or `INNGEST_SIGNING_KEY` fails fast with a clear config error; in development it falls back to the Inngest dev server with a warning.
- No secret leaks into logs.

## Related docs

- [`docs/built-article-steps.md`](../docs/built-article-steps.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#content-generation)
- [`docs/seo-geo.md`](../docs/seo-geo.md#generative-engine-optimization-geo)
- [Inngest Functions — Multi-step functions](https://www.inngest.com/docs/functions/multi-step)
