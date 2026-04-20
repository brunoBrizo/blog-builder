# 05. Perplexity Article Pipeline

## Goal

Implement the 8-call Perplexity orchestration defined in [`docs/built-article-steps.md`](../docs/built-article-steps.md) as a reliable, resumable, observable backend workflow that takes a topic and produces a publish-ready article in `en`, `pt-br`, and `es` persisted to Supabase.

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md).
- [03. API Foundation](./03-api-foundation.md).

## Scope

In scope:

- Typed Perplexity HTTP client with retry, timeout, circuit-breaker, token/cost accounting, and citation capture.
- Prompt builders for all 8 steps in `libs/prompts`, typed end-to-end.
- `GenerationService` that runs the steps in order, persists each step's input/output to `generation_jobs`, supports resume on partial failure, and writes the final article + translations atomically.
- A manual trigger endpoint so a human can kick off the pipeline with a seed topic (used for QA and AdSense pre-seeding).
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

## Backend work

- Implement `PerplexityClient` (thin wrapper over `fetch`) with: `sonar-pro` as the default model, per-call timeout, `p-retry` for 429/5xx, exponential backoff, and strict JSON-schema validation of responses via Zod. Capture `usage.*` for token accounting and `search_results` for citations.
- Persist every call to `generation_jobs` and a child `generation_steps` table (or JSONB column of steps — single-table with a typed discriminated union is acceptable) with: step name, status, input prompt digest, raw output, parsed output, tokens, cost in USD, duration, error (if any).
- Build typed prompt builders in `libs/prompts`, one per step, each returning `{ system, user }` strings and a Zod schema for the expected response.
- `GenerationService.runPipeline(topicSeed, options)` orchestrates the 8 steps, short-circuits on unrecoverable errors, and supports `resume(jobId)` that restarts from the first incomplete step.
- After step 6, create a draft `articles` row (status `draft`); after steps 7 and 8, upsert the two additional `article_translations` rows; citations from steps 4–5 persist to `article_citations`.
- Publish transition is explicit: the pipeline finishes in `status = 'pending_review'`. Publishing (setting `published_at`, flipping status to `published`) happens via the admin dashboard in feature 15 or via an auto-publish flag set on the job (used by the scheduled runner in feature 06 when human review is disabled).
- Guardrails: enforce per-run token budget, per-day Perplexity spend ceiling, and a global kill-switch flag readable from config.
- Expose `POST /internal/articles/generate` guarded by `CronAuthGuard` (for the scheduler) and an additional admin-guarded variant used from the admin dashboard in feature 15.
- Structured logging for every step (job id, step, tokens, cost, duration). Errors ping Sentry with the job id tag.

## Frontend work

None in this feature. The generation pipeline is invisible to end users; the admin dashboard (feature 15) surfaces it.

## Acceptance criteria

- End-to-end integration test (against a mocked Perplexity server) takes a seed topic and produces an `articles` row plus three `article_translations` rows with valid slugs, metadata, and citations.
- Killing the process mid-run and rerunning `resume(jobId)` completes without re-running completed steps.
- Per-step cost and token counts are persisted and aggregate correctly for a single job.
- Hitting the per-day spend ceiling causes new generations to fail fast with a clear error (logged, surfaced to admin).
- No secret leaks into logs.

## Related docs

- [`docs/built-article-steps.md`](../docs/built-article-steps.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#content-generation)
- [`docs/seo-geo.md`](../docs/seo-geo.md#generative-engine-optimization-geo)
