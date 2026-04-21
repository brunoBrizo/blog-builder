# E2E testing (Playwright)

End-to-end tests for the Next.js app live in **`apps/web-e2e`**. Configuration is **[`apps/web-e2e/playwright.config.ts`](../../apps/web-e2e/playwright.config.ts)**; Nx wires the **`e2e`** target in **[`apps/web-e2e/project.json`](../../apps/web-e2e/project.json)**.

## Prerequisites

- **Node / pnpm** — same as the rest of the repo ([README](../../README.md)).
- **Browsers** — first run may download Chromium, Firefox, and WebKit via Playwright’s install step (see below).

## Run tests

From the repository root:

```bash
pnpm exec playwright install
pnpm nx e2e web-e2e
```

`playwright install` is only needed once per machine (or after Playwright upgrades) so browser binaries exist.

### What starts automatically

The config sets **`webServer`** to:

```text
pnpm exec nx run web:serve
```

and waits until **`http://localhost:4200`** responds (`reuseExistingServer: true`, so an already-running dev server is reused).

**`baseURL`** defaults to **`http://localhost:4200`** (override with env **`BASE_URL`** if you change the dev port).

### Projects (browsers)

By default, the same tests run on **chromium**, **firefox**, and **webkit**. To iterate faster locally, you can temporarily narrow projects in `playwright.config.ts` or use Playwright’s `--project=chromium` if you add a CLI passthrough (Nx forwards extra args depending on version—check `nx e2e web-e2e --help`).

## API and data

- **Static / client-only UI** — web dev server alone may be enough.
- **Pages that call the API** — ensure **`NEXT_PUBLIC_API_BASE_URL`** in `.env` points at a running API (e.g. `http://localhost:3001/api`), and start **`pnpm nx serve api`** in another terminal **before** e2e if tests need live data.
- **Database-backed flows** — migrate/seed as in [Database workflows](database-workflows.md) when tests assume content exists.

The Playwright **`webServer`** block only starts **`web`**, not **`api`**.

## Adding tests

1. Add spec files under **`apps/web-e2e/src/`** (for example `example.spec.ts`).
2. Use Playwright’s **`test`** / **`expect`** from `@playwright/test`; paths are relative to `baseURL`.
3. Keep tests independent: prefer explicit navigation and stable selectors (`getByRole`, etc.).

There are **no spec files** in the repo yet—the folder is scaffolded for you to grow.

## CI vs local

- **Local** — default `BASE_URL` + `webServer` as above.
- **CI / deployed preview** — set **`BASE_URL`** to the deployed web URL and usually **disable or replace `webServer`** so CI does not start `nx serve` (not configured out of the box; adjust `playwright.config.ts` when you wire CI).

## Related docs

- [Local first run](local-first-run.md)
- [Environment variables](environment-variables.md)
- [Playwright docs](https://playwright.dev/docs/intro)
