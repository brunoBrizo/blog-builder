# 06. Scheduled Article Generation

## Goal

Automate the article pipeline so new, unique articles publish at least four times per week without human action, using Supabase `pg_cron` as the only scheduler.

## Dependencies

- [03. API Foundation](./03-api-foundation.md).
- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md).

## Scope

In scope:

- `pg_cron` job that calls the API's internal generation endpoint on a defined cadence.
- Topic queue / deduplication so the scheduler never regenerates a covered topic.
- Auto-publish flag + behavior for fully autonomous runs.
- On-demand ISR revalidation of the affected routes once an article publishes.
- Failure handling: retry policy, dead-lettering, and alerting.

Out of scope:

- The 8-step orchestration itself (feature 05).
- Admin UI to pause/resume the scheduler (feature 15).

## Backend work

- Create a `pg_cron` job (committed as a SQL migration in `libs/db/drizzle/`) that runs four to seven times per week at chosen UTC times. The job body uses `net.http_post` to call `POST https://<api>/internal/articles/generate` with the `CRON_SHARED_SECRET` header and a body that does not seed a topic — the API picks the next topic itself.
- Implement topic selection in `GenerationService`:
  - Maintain a `topic_queue` table (or reuse `generation_jobs` with a `queued` status) seeded by step 1 of the pipeline in prior runs and by admin manual entries.
  - Select the highest-scored topic whose normalized form does not match any `articles.slug` across locales, nor any recently failed topic.
  - If the queue is empty, run step 1 standalone to refill it, then select.
- Auto-publish path: when `pg_cron` triggers generation, the final job runs with `autoPublish = true`. On success the pipeline sets `status = 'published'`, `published_at = now()`, and emits a domain event.
- On publish, `apps/api` calls the Next.js on-demand revalidation endpoint (`POST /api/revalidate` in `apps/web`) with the `REVALIDATE_SHARED_SECRET` header, revalidating: the English article URL, both translated URLs, the homepage per locale, the category page per locale, and the sitemap.
- Failure handling: each step is retried by the Perplexity client (feature 05); a pipeline run that still fails is marked `failed`, logged, and Sentry-alerted. A separate `pg_cron` job once a day re-examines recent `failed` jobs and re-enqueues them if the failure reason is transient (network, 429).
- Concurrency control: a Postgres advisory lock held for the duration of a run so two overlapping `pg_cron` triggers cannot double-generate.
- Observability: structured logs per scheduled run with duration, token cost, published slug(s), and failure classification.

## Frontend work

- Add `POST /api/revalidate` to `apps/web` that accepts `{ paths: string[], tags?: string[] }`, verifies the shared secret header, and calls `revalidatePath`/`revalidateTag` accordingly. Return `{ revalidated: true, now: <ts> }`.
- No end-user UI.

## Acceptance criteria

- `pg_cron` triggers the endpoint on schedule; runs visible in `cron.job_run_details`.
- Four or more distinct articles publish per week over a two-week observation window, each with three locale translations.
- No duplicate slug across locales and no duplicate topic across runs within 90 days.
- On publish, the affected Next.js routes are revalidated and reflect the new article within 5 seconds.
- A simulated Perplexity outage (mocked 5xx) causes retries, then a `failed` job marked for automated retry next day.

## Related docs

- [`docs/built-article-steps.md`](../docs/built-article-steps.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#scheduling)
