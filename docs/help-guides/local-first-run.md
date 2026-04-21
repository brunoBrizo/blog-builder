# Local first run

End-to-end happy path: clone the repo, configure env, apply schema, seed data, and run the **API** and **web** apps.

## 1. Prerequisites

- **Node.js** — version pinned in [`.nvmrc`](../../.nvmrc) (see root [README](../../README.md) for `nvm use` / install).
- **pnpm** — `corepack enable pnpm` and a recent `pnpm` (workspace expects `>= 10` per `package.json` `engines`).

## 2. Install dependencies

From the repository root:

```bash
pnpm install
```

## 3. Environment file

1. Copy [`.env.example`](../../.env.example) to **`.env`** at the repo root (same directory as `package.json`).
2. Fill **Supabase** and integration values. Step-by-step for the database project: [Supabase setup](../supabase-setup.md).
3. At minimum for the API to **boot**, you need everything the schema treats as required — see [Environment variables](environment-variables.md).

Scripts such as `pnpm db:migrate` load `.env` via `dotenv` from the current working directory; **always run them from the repo root**.

## 4. Database: migrate, then seed

Still from the repo root:

```bash
pnpm db:migrate
pnpm db:seed
```

- **Migrate** uses `DIRECT_DATABASE_URL` when set (preferred for DDL); see [Database workflows](database-workflows.md).
- **Seed** creates a deterministic default author (`GENERATION_DEFAULT_AUTHOR_ID` in `.env` / `env.schema.ts` matches this author).

## 5. Start the API

In one terminal:

```bash
pnpm nx serve api
```

Default listen URL is **`http://localhost:3001`** if `PORT=3001` in `.env`.

Quick checks (replace port if yours differs):

- Liveness: `GET http://localhost:3001/api/health` → `{ "status": "ok", ... }`
- DB connectivity: `GET http://localhost:3001/api/ready` → `{ "ready": true }`

## 6. Start the web app

In a second terminal:

```bash
pnpm nx serve web
```

Typical URL: **`http://localhost:3000`**.

Ensure **`NEXT_PUBLIC_API_BASE_URL`** in `.env` matches the API (e.g. `http://localhost:3001/api`) and **`CORS_ORIGIN_WEB`** includes the web origin (e.g. `http://localhost:3000`) so browser calls from the Next app are allowed.

## 7. Optional: article generation + Inngest

The generation pipeline is driven by Inngest. For local testing, run the Inngest dev server and point it at your API — see [Inngest setup and testing](inngest-setup-and-testing.md).

To trigger a run manually (after Inngest is connected): [Article generation — manual testing](article-generation-manual-testing.md).

## Troubleshooting

| Issue                                           | What to try                                                                                                                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API exits on startup with “Invalid environment” | Compare `.env` to [Environment variables](environment-variables.md) and [`apps/api/src/core/config/env.schema.ts`](../../apps/api/src/core/config/env.schema.ts). |
| `db:migrate` fails                              | Confirm `DIRECT_DATABASE_URL` (port **5432**) and SSL; see [Database workflows](database-workflows.md).                                                           |
| `ready` returns 503                             | `DATABASE_URL` wrong or DB unreachable from your machine.                                                                                                         |
| Web cannot call API                             | `NEXT_PUBLIC_API_BASE_URL`, `CORS_ORIGIN_WEB`, and that both processes are running.                                                                               |
