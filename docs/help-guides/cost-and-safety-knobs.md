# Cost and safety knobs (article generation)

Article generation uses **Perplexity** and **Inngest**. Spending and blast radius are controlled with environment variables validated in [`apps/api/src/core/config/env.schema.ts`](../../apps/api/src/core/config/env.schema.ts) and read via **`AppConfigService`**.

Defaults and comments also appear in **[`.env.example`](../../.env.example)**.

## Kill switch

| Variable                     | Effect                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **`GENERATION_KILL_SWITCH`** | When `true` / `1`, **new** generation runs fail fast (non-retriable) with a kill-switch error—useful during incidents without redeploying. |

Unset or `false` / `0` means normal operation.

## Per-run token budget

| Variable                              | Default  | Effect                                                                                                                                         |
| ------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **`GENERATION_PER_RUN_TOKEN_BUDGET`** | `500000` | Hard cap on **prompt + completion** tokens for a **single** run. Exceeding it fails the job with a **non-retriable** error (not auto-retried). |

Tune down in dev/staging to limit runaway prompts; tune in production to match acceptable cost per article.

## Daily USD ceiling

| Variable                           | Default | Effect                                                                                                                                                  |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`GENERATION_DAILY_USD_CEILING`** | `500`   | When **estimated** spend for the current **UTC calendar day** (across completed jobs) would exceed this ceiling, **new** spend is blocked for that day. |

The estimate uses rough token pricing env vars below—not an invoice from Perplexity.

## Perplexity pricing inputs (estimates only)

Used for **internal cost estimates** and daily ceiling logic, not for billing Perplexity:

| Variable                                    | Default |
| ------------------------------------------- | ------- |
| **`PERPLEXITY_USD_PER_MTOKENS_PROMPT`**     | `3`     |
| **`PERPLEXITY_USD_PER_MTOKENS_COMPLETION`** | `15`    |

| Variable                    | Default  | Effect                                  |
| --------------------------- | -------- | --------------------------------------- |
| **`PERPLEXITY_TIMEOUT_MS`** | `120000` | HTTP timeout for Perplexity calls (ms). |

## Author binding

| Variable                           | Default                           |
| ---------------------------------- | --------------------------------- |
| **`GENERATION_DEFAULT_AUTHOR_ID`** | Seed author UUID (`pnpm db:seed`) |

Generated content is associated with this author unless your pipeline overrides it elsewhere.

## Inspect spend and kill switch (HTTP)

With **`x-cron-secret`** equal to **`CRON_SHARED_SECRET`**:

```http
GET /api/internal/articles/generation/monthly-spend
```

Returns UTC **month** aggregates and whether the kill switch is enabled in config. See [Article generation — manual testing](article-generation-manual-testing.md) for `curl`.

## Operational behavior (retries, replay)

- **Non-retriable** failures include kill switch, **token budget exceeded**, and certain Perplexity validation errors—Inngest will not keep retrying those blindly.
- **Replay** in the Inngest UI is for **transient** failures; after changing prompts or keys, prefer **new** jobs.

Full runbook: [Inngest article pipeline](../inngest-article-pipeline.md) (replay, signing, local dev).

## Related docs

- [Environment variables](environment-variables.md)
- [Article generation — manual testing](article-generation-manual-testing.md)
- [Inngest setup and testing](inngest-setup-and-testing.md)
