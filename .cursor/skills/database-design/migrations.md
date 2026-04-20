# Migration Principles

> Safe migration strategy for zero-downtime changes.

## Repo Context

- Prisma-backed services should keep schema and migration history aligned through Prisma.
- Supabase-backed areas should treat SQL migrations, policies, and functions as part of the same rollout.
- Mongo is out of scope here except when you are explicitly changing the repo's existing Mongo service.

## Safe Migration Strategy

```
For zero-downtime changes:
│
├── Adding column
│   └── Add as nullable → backfill → add NOT NULL
│
├── Removing column
│   └── Stop using → deploy → remove column
│
├── Adding index
│   └── CREATE INDEX CONCURRENTLY (non-blocking)
│
└── Renaming column
    └── Add new → migrate data → deploy → drop old
```

## Migration Philosophy

- Never make breaking changes in one step
- Test migrations on data copy first
- Have rollback plan
- Run in transaction when possible

## Serverless Databases

### Neon (Serverless PostgreSQL)

| Feature           | Benefit          |
| ----------------- | ---------------- |
| Scale to zero     | Cost savings     |
| Instant branching | Dev/preview      |
| Full PostgreSQL   | Compatibility    |
| Autoscaling       | Traffic handling |

### Turso (Edge SQLite)

| Feature             | Benefit           |
| ------------------- | ----------------- |
| Edge locations      | Ultra-low latency |
| SQLite compatible   | Simple            |
| Generous free tier  | Cost              |
| Global distribution | Performance       |
