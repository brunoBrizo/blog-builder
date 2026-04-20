# 18. Observability & Monitoring

## Goal

See what the site and the pipeline are doing in production so we can detect regressions, diagnose incidents, and keep Perplexity and Fly.io spend under control — with free or near-free tools.

## Dependencies

- [03. API Foundation](./03-api-foundation.md).
- [04. Web Foundation](./04-web-foundation.md).
- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md).

## Scope

In scope:

- Error tracking (Sentry free tier) on both `apps/web` and `apps/api`.
- Structured logs shipped to a free log sink (Logtail / BetterStack or Axiom free tier).
- Uptime monitoring (UptimeRobot free) for homepage + `/api/health`.
- Web Vitals real-user monitoring (Vercel Analytics free, or the lightweight endpoint from feature 16).
- Cost dashboards for Perplexity and Fly.io surfaced in the admin.
- Alert routing: Sentry → email / Discord webhook; uptime → email.

Out of scope:

- APM / distributed tracing beyond Sentry's built-in tracing.
- Custom Grafana stack.

## Backend work

- Integrate `@sentry/nestjs`: instrument bootstrap, capture unhandled exceptions, enable performance tracing at `tracesSampleRate = 0.1`, scrub PII (emails, IPs).
- Pino logger configured to write JSON to stdout; Fly.io forwards stdout to Logtail/Axiom via their free log-drain ingestion tokens (configured as Fly secret).
- Health endpoints (from feature 03) pinged by UptimeRobot every 5 min.
- Emit domain events as log lines with a stable `event` field (`article.published`, `article.refresh.completed`, `newsletter.digest.sent`, `generation.job.failed`) so dashboards can filter.
- Per-request log contains: request id, method, path, status, duration, user agent category.
- Sentry release tag set from the git sha at build time.
- Alert rules:
  - Sentry: notify on any new issue in `apps/api` or any spike in event rate.
  - Pipeline: a Cloud Function-style scheduled check queries `generation_jobs` for failed-in-last-24h and emits a Sentry event if count > 2.
  - Cost: a daily job sums Perplexity spend and fires a Sentry alert at 80 % of the monthly ceiling.

## Frontend work

- Integrate `@sentry/nextjs` with `tracesSampleRate = 0.1`, `replaysSessionSampleRate = 0`, `replaysOnErrorSampleRate = 1.0`.
- Scrub PII in `beforeSend`.
- Release tag from git sha at build time.
- Web Vitals sink: either `@vercel/analytics` or `POST /vitals` to the API (feature 16 already wires this).
- Add a small banner component (admin-only) that shows Sentry's latest issue severity if > 0 in the last 24 h, to keep the publisher aware.

## Acceptance criteria

- A deliberate error in staging surfaces in Sentry within 60 s, with the correct release tag.
- Logs for a staging run of the generation pipeline are searchable in the log sink within 60 s.
- UptimeRobot reports 99.9 %+ uptime over a two-week observation window.
- Admin costs dashboard (feature 15) shows accurate daily Perplexity and Fly.io spend for the last 30 days.
- Monthly cost stays under the budgeted ~$5 ceiling while scheduled generation runs four times per week.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md)
- [`.cursor/rules/nestjs-guidelines.mdc`](../.cursor/rules/nestjs-guidelines.mdc)
