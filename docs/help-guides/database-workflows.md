# Database workflows (Drizzle + Postgres)

Schema and migrations live under **`libs/db/`**; migration files are committed in **`libs/db/drizzle/`**. Config for Drizzle Kit is **[`drizzle.config.ts`](../../drizzle.config.ts)** at the repo root.

## Two connection strings (Supabase)

| Variable              | Typical port      | Use                                                                                      |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | **6543** (pooler) | Runtime: API, **`pnpm db:seed`**, app code.                                              |
| `DIRECT_DATABASE_URL` | **5432** (direct) | **`pnpm db:migrate`**, **`pnpm db:generate`**, **`pnpm db:studio`**, **`pnpm db:push`**. |

DDL over the pooler is unreliable; migrations prefer **`DIRECT_DATABASE_URL`**. The migrate script uses `DIRECT_DATABASE_URL ?? DATABASE_URL` — if you only set `DATABASE_URL`, migrate may still run but Supabase recommends the direct URL for schema changes.

Details: [Supabase setup](../supabase-setup.md).

## Commands (run from repo root)

All load `.env` via `dotenv`; run **`pnpm …` from the repository root**.

| Command            | What it does                                                                       |
| ------------------ | ---------------------------------------------------------------------------------- |
| `pnpm db:migrate`  | Apply pending SQL migrations (`libs/db/scripts/migrate.ts`).                       |
| `pnpm db:seed`     | Idempotent seed data (authors, sample article, etc.). Safe to re-run.              |
| `pnpm db:generate` | Generate new migration files from Drizzle schema changes (`drizzle-kit generate`). |
| `pnpm db:push`     | Push schema to DB without migration files (use with care; dev-only shortcuts).     |
| `pnpm db:studio`   | Open Drizzle Studio against the DB from `drizzle.config.ts`.                       |
| `pnpm db:reset`    | Destructive reset script — only use when you intend to wipe dev data.              |

## Typical flows

### New clone / empty database

```bash
pnpm db:migrate
pnpm db:seed
```

### After pulling new migrations

```bash
pnpm db:migrate
```

Re-run **`db:seed`** only if docs or scripts tell you to (seed is designed to be re-runnable but not always required).

### After editing `libs/db/src/schema`

1. `pnpm db:generate` — creates new files under `libs/db/drizzle/`.
2. Review generated SQL.
3. `pnpm db:migrate` — apply locally.
4. Commit migration artifacts with your code.

## Troubleshooting

| Symptom                       | Likely cause                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| Migrate fails mid-transaction | Use **`DIRECT_DATABASE_URL`** (5432).                                                                |
| “Set DATABASE_URL…” from seed | Missing both `DATABASE_URL` and `DIRECT_DATABASE_URL` in `.env`, or wrong cwd.                       |
| SSL / connection refused      | Local Postgres vs Supabase: Supabase non-local URLs need SSL (scripts handle this for remote hosts). |
| RLS / permission errors       | API uses service role; ensure connection string matches Supabase expectations.                       |

## Related docs

- [Local first run](local-first-run.md)
- [Environment variables](environment-variables.md)
- [Supabase setup](../supabase-setup.md)
