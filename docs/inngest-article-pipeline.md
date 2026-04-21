# Inngest article generation: operations runbook

This runbook covers replay, observability hooks, and failure modes for the `generate-article` pipeline served at `INNGEST_SERVE_PATH` (default `/api/inngest`).

## Dashboard

1. Open the [Inngest Cloud dashboard](https://app.inngest.com) for the environment that matches your `INNGEST_EVENT_KEY` / app deployment.
2. Find runs by **function name** (`generate-article` / the id from `createGenerateArticleFunction`) or by **event name** used when enqueueing work.

## Correlating with our data model

- **`jobId`**: generation job UUID in Postgres (`generation_jobs.id`). Logged and passed through orchestrator steps.
- **`runId`**: optional Inngest run id (`inngestRunId`) attached to Sentry scope and failure metadata when present.

When debugging a failed run, copy the Inngest run id from the dashboard and search API logs for the same window; match `jobId` from the trigger payload or DB.

## Replay behavior

- **Successful `step.run` completions** are memoized by Inngest. Replaying a run after a transient failure skips completed steps and continues from the failing step.
- **Non-retriable errors** (`NonRetriableError` from the handler): kill switch closed, per-run token budget exceeded, Perplexity validation failures, etc. These are **not** retried automatically; fix the cause (config, upstream, content) and trigger a **new** job if appropriate.
- **Retriable errors**: generic failures (e.g. network) may retry per Inngest function retry policy.

## Manual replay (dashboard)

1. Open the failed run in Inngest.
2. Use **Replay** only when the failure was **transient** and you accept idempotent re-execution of the **non-memoized** tail of the function.
3. After changing prompts, API keys, or schema, prefer enqueueing a **new** generation job so you do not mix old step outputs with new code.

## Kill switch and budget

- **`GENERATION_KILL_SWITCH=true`**: new runs fail fast at research with a non-retriable error. Use during incidents without redeploying.
- **`GENERATION_PER_RUN_TOKEN_BUDGET`**: hard cap on prompt + completion tokens for a single run; exceeding it fails the job (non-retriable).
- **`GENERATION_DAILY_USD_CEILING`**: blocks new spend for the UTC day when estimated cost exceeds the ceiling.

## Local development

- Run the [Inngest dev server](https://www.inngest.com/docs/local-development) (`npx inngest-cli@latest dev`) so the API can register functions without Cloud keys, or set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to match a dev app in Inngest Cloud.

## HTTP handler and signing

- Production requires **`INNGEST_SIGNING_KEY`** (and **`INNGEST_EVENT_KEY`**) per `env.schema.ts`. Unsigned or invalid requests to `POST /api/inngest` should receive **401**.
- The API mounts **`express.json()` on the Inngest path only** before the Inngest handler so `req.body` is set **and** the route is registered before Nest’s router (see `apps/api/src/main.ts`).
