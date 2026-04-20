# 14. Content Refresh Job

## Goal

Keep older articles ranking by periodically re-running a lightweight refresh of top-performing content: updated facts, refreshed TL;DR, refreshed metadata, and a bumped `updated_at`. Search engines and AI answer engines reward recency; this job supplies it without regenerating whole articles.

## Dependencies

- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md).
- [06. Scheduled Article Generation](./06-scheduled-article-generation.md).

## Scope

In scope:

- Selection logic for which articles to refresh (recency + traffic signals).
- A "refresh pipeline" subset of the Perplexity pipeline.
- On-publish revalidation hook (reuses feature 06's mechanism).
- Audit trail of refresh runs.

Out of scope:

- Editorial human rewrites.
- Topic ideation (handled by step 1 of the generation pipeline).

## Backend work

- New `pg_cron` job: once per week, Wednesday 09:00 UTC, calls `POST /internal/articles/refresh` with the `CRON_SHARED_SECRET`.
- `ContentRefreshService.run()`:
  - Picks N articles (default 5) using a score = `(90 - daysSincePublish) * pageviewsLast30d` from `article_analytics_snapshots` where published ≥ 90 days ago and `updated_at` ≥ 30 days ago.
  - For each chosen article runs a _refresh sub-pipeline_: (a) a single Perplexity call to check facts + recent developments on the topic, (b) step 5 (humanize) to smooth the merged draft, (c) step 6 (SEO metadata re-derive if the TL;DR or title changed), (d) localized refresh for pt-br and es via steps 7–8.
  - Writes updates to `article_translations` in a transaction; bumps `updated_at`, `lastReviewedAt`.
  - Logs one row per refresh to `generation_jobs` with `kind = 'refresh'` so cost accounting is unified.
  - Calls the Next.js revalidate endpoint for the three locale URLs + the homepage + the sitemap.
- GA4 ingestion (simple, manual-trigger admin endpoint for now) writes monthly snapshots to `article_analytics_snapshots`. Full automation of GA4 pulls is optional follow-up.
- Guardrails: per-day cost ceiling shared with generation; refresh is skipped if the ceiling has been hit.
- If a refresh materially rewrites the article (word-count delta > 30%), the run is flagged `requires_review` and held back from auto-publish (published only by admin in feature 15).

## Frontend work

- Article template (feature 07) already displays "Last reviewed on". This feature ensures the field is populated and surfaces the reviewed date near the byline (not replacing the publish date).
- No other UI changes.

## Acceptance criteria

- The weekly job ran last Wednesday (verifiable via `cron.job_run_details` and `generation_jobs` rows with `kind='refresh'`).
- Each refreshed article's `updated_at` and `lastReviewedAt` increased; metadata and JSON-LD `dateModified` reflect the change on the live page within 5 s of publish.
- Word-count-delta > 30% runs halt in `pending_review` and do not auto-publish.
- Daily cost ceiling blocks further refreshes with a clear log entry.

## Related docs

- [`docs/built-article-steps.md`](../docs/built-article-steps.md)
- [`docs/seo-geo.md`](../docs/seo-geo.md)
