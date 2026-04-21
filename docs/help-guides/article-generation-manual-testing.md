# Article generation — manual testing

The pipeline creates a **job** in Postgres, emits an Inngest event, and runs the **`generate-article`** function in the API. This guide covers **HTTP triggers** and what to watch.

## Prerequisites

1. **API running** — e.g. `pnpm nx serve api` (`http://localhost:3001` if `PORT=3001`).
2. **Database migrated and seeded** — see [Database workflows](database-workflows.md). Seed provides the default author used for generation.
3. **Env** — valid `PERPLEXITY_API_KEY`, `DATABASE_URL`, etc. ([Environment variables](environment-variables.md)).
4. **Inngest** — for the function to execute, Inngest must reach your app’s serve handler. Locally, use the Inngest dev server: [Inngest setup and testing](inngest-setup-and-testing.md).

If Inngest is not connected, the **`POST`** below can still return **`202`** with a **`jobId`** (job row + `inngest.send`), but **no steps will run** until the dev server (or Cloud) can deliver the event.

## Trigger: create job + send event

**Endpoint:** `POST /api/internal/articles/generate`  
**Guard:** [`CronAuthGuard`](../../apps/api/src/core/auth/cron-auth.guard.ts) — send header **`x-cron-secret`** with the same value as **`CRON_SHARED_SECRET`** in `.env`.

**Body (JSON):**

| Field         | Required | Notes                                                                                   |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| `topicSeed`   | **Yes**  | 1–500 characters; drives research/generation.                                           |
| `locales`     | No       | Array of locale codes; **default** if omitted: `en`, `pt-BR`, `es` (max 3 if provided). |
| `autoPublish` | No       | Boolean; default `false`.                                                               |

### Example: curl

```bash
curl -sS -X POST "http://localhost:3001/api/internal/articles/generate" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: YOUR_CRON_SHARED_SECRET" \
  -d '{"topicSeed":"Smoke test: Inngest article pipeline"}'
```

Replace port and secret. A successful response includes **`{ "jobId": "<uuid>" }`** (`202 Accepted`).

### Example: optional locales and auto-publish

```bash
curl -sS -X POST "http://localhost:3001/api/internal/articles/generate" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: YOUR_CRON_SHARED_SECRET" \
  -d '{"topicSeed":"Short topic","locales":["en"],"autoPublish":false}'
```

## Observe the run

1. **Inngest Dev UI** — run shows steps, retries, and errors (local dev server).
2. **API logs** — Perplexity and generation steps log through the Nest logger.
3. **Database** — job row and related tables update as the pipeline progresses.

Operational detail (replay, kill switch, signing): [Inngest article pipeline](../inngest-article-pipeline.md).

## Related internal route (same auth)

**`GET /api/internal/articles/generation/monthly-spend`** — also protected by **`CronAuthGuard`**; useful for checking spend and kill-switch state:

```bash
curl -sS "http://localhost:3001/api/internal/articles/generation/monthly-spend" \
  -H "x-cron-secret: YOUR_CRON_SHARED_SECRET"
```

## Common failures

| HTTP / behavior          | Check                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `401`                    | `x-cron-secret` missing or wrong; must match `CRON_SHARED_SECRET`.                                                    |
| `400` on body            | `topicSeed` empty or too long; invalid `locales`.                                                                     |
| `202` but nothing runs   | Inngest dev server not running or sync URL not `http://localhost:<PORT>/api/inngest`.                                 |
| Step failures / timeouts | `PERPLEXITY_API_KEY`, network, or DB; see API logs and [inngest-article-pipeline.md](../inngest-article-pipeline.md). |

## Related docs

- [Inngest setup and testing](inngest-setup-and-testing.md)
- [Local first run](local-first-run.md)
- [Built article steps](../built-article-steps.md) — pipeline stages (product reference)
