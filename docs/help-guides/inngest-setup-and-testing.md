# Inngest setup: step-by-step (local testing)

This guide is for developers who want to **run and test** the article generation pipeline that uses [Inngest durable functions](https://www.inngest.com/docs/learn/inngest-functions). Having only an [Inngest Cloud](https://app.inngest.com) account is enough for later; **you do not need Cloud configured on your laptop** to test locally.

## What you are wiring up

1. The **blog-builder API** (`apps/api`) serves Inngest at **`http://localhost:3001/api/inngest`** by default (port from `PORT` in `.env`).
2. Inngest needs to **discover** that URL and **send work** to it. On your machine, the usual way is the **Inngest Dev Server** (a small process you run with `npx`—no global install required).
3. Starting a run: you call **`POST /api/internal/articles/generate`**, which creates a DB job and sends the event **`article/generation.requested`**. Inngest then executes the **`generate-article`** function inside your API process.

You **do not** install Inngest into this repo separately—the **`inngest`** npm package is already a project dependency. You only need the **CLI** when using local dev mode, via **`npx`** (downloads on first run).

---

## Prerequisites (before Inngest)

1. **Node / pnpm** — same as the rest of the monorepo.
2. **`.env` or `.env.local`** at the repo root — copy from [`.env.example`](../../.env.example) and fill at least:
   - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`
   - `PERPLEXITY_API_KEY`, `RESEND_API_KEY`
   - `CRON_SHARED_SECRET`, `REVALIDATE_SHARED_SECRET`
   - `NODE_ENV=development`, `PORT=3001` (or your port)
3. **Database** — migrate and seed so generation has a valid author (see root `package.json`: `db:migrate`, `db:seed`).
4. **Optional for UI/CORS** — `CORS_ORIGIN_WEB=http://localhost:3000` if you use the web app against the API.

---

## Path A — Local testing with the Inngest Dev Server (recommended)

Use this when the API runs on **localhost**. Your Inngest Cloud account can stay unused for this path.

### Step 1: Start the API

From the repo root:

```bash
pnpm nx serve api
```

Wait until the API is listening (default **http://localhost:3001**).

### Step 2: Start the Inngest Dev Server

In a **second terminal**, from any directory:

```bash
npx inngest-cli@latest dev
```

This does **not** modify the repo; it runs the official CLI.

### Step 3: Point the dev server at your API

In the **Inngest Dev Server** UI (opened in the browser, often **http://127.0.0.1:8288**), set the app **sync / serve URL** to your handler:

```text
http://localhost:3001/api/inngest
```

(If you changed `PORT` or `INNGEST_SERVE_PATH` in `.env`, use that host/port/path instead.)

### Step 4: Env vars for local dev

With **`NODE_ENV=development`**, you may leave **`INNGEST_EVENT_KEY`** and **`INNGEST_SIGNING_KEY` empty**. The API logs a reminder if keys are missing; that is expected when using the dev server.

### Step 5: Confirm the function is registered

In the dev UI you should see the app and a function like **`generate-article`** (id from code), subscribed to event **`article/generation.requested`**.

### Step 6: Trigger a real run

The pipeline expects a **job row** in Postgres, then an event with that **`jobId`**. The supported way is the internal endpoint (full options: [Article generation — manual testing](article-generation-manual-testing.md)):

```bash
curl -sS -X POST "http://localhost:3001/api/internal/articles/generate" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: YOUR_CRON_SHARED_SECRET" \
  -d '{"topicSeed":"Test topic for Inngest pipeline"}'
```

Replace `YOUR_CRON_SHARED_SECRET` with the same value as **`CRON_SHARED_SECRET`** in your `.env`.

The response includes **`jobId`**. Inngest should show a new run; the API logs will show Perplexity steps if keys and DB are valid.

---

## Path B — Inngest Cloud + your account

Cloud is for **deployed** APIs or when you use a **public URL** (or a tunnel) that Inngest can reach. **Inngest Cloud cannot call `http://localhost:3001` on your laptop** unless you expose it (e.g. ngrok) or you still use the **dev server** as a bridge.

### If you want Cloud to drive a local API

Typical approach: keep using **Path A (dev server)** while developing; the dev server talks to your local API. Alternatively, run a tunnel and register that URL in the Inngest dashboard—advanced and optional.

### If you deploy the API (e.g. Fly)

1. In [Inngest Cloud](https://app.inngest.com), create or select an **app** that matches this service.
2. Set the **sync URL** to your public API’s Inngest path, e.g. `https://your-api.example.com/api/inngest`.
3. In the dashboard, copy **`INNGEST_EVENT_KEY`** and **`INNGEST_SIGNING_KEY`** (names may appear as “Event key” / “Signing key” in app settings).
4. On the server, set **`NODE_ENV=production`** (or follow your env rules) and set both keys in secrets/env. Production **requires** both keys in this project’s schema.
5. Redeploy so the API registers with Cloud.

More detail: [docs/inngest-article-pipeline.md](../inngest-article-pipeline.md) and [docs/api-fly-deploy.md](../api-fly-deploy.md).

---

## Troubleshooting (quick)

| Symptom                                    | What to check                                                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dev UI never shows the function            | Sync URL must be exactly `http://localhost:<PORT>/api/inngest`; API must be running first.                                                       |
| `401` on `/api/inngest`                    | In development with **empty** keys, signing is relaxed; if you set **`INNGEST_SIGNING_KEY`**, requests must be signed (dev server handles this). |
| Run starts then fails in steps             | DB migrated/seeded? **`PERPLEXITY_API_KEY`** valid? Check API logs and [operations runbook](../inngest-article-pipeline.md).                     |
| `401` on `/api/internal/articles/generate` | Header **`x-cron-secret`** must match **`CRON_SHARED_SECRET`**.                                                                                  |

---

## Further reading

- [Article generation — manual testing](article-generation-manual-testing.md) — `curl`, body fields, monthly-spend route
- [Inngest — local development](https://www.inngest.com/docs/local-development)
- [Inngest — serve functions](https://www.inngest.com/docs/learn/serving-inngest-functions)
- [Operations: replay, budgets, kill switch](../inngest-article-pipeline.md)
