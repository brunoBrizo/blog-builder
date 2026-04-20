---
name: database-design
description: Repo-biased database design skill for Prisma/PostgreSQL and Supabase/Postgres. Use for schema design, ORM choice, indexing plans, migration strategy, and persistence-path decisions. Mention Mongo only as an existing repo exception.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Database Design

Use this skill for design and selection work, not deep Postgres tuning.

## Repo Bias

- Default SQL paths in this repo are Prisma + PostgreSQL and Supabase/Postgres.
- Prefer the existing stack of the touched app instead of inventing a new database.
- Mongo exists in one service; treat it as a local exception, not the default model.

## Use It For

- choosing between Prisma/Postgres and Supabase/Postgres for repo work
- reviewing schema shape, keys, relationships, and constraints
- planning indexes from known query patterns
- deciding migration sequencing and rollout order
- checking whether Mongo is actually justified for the affected service

## Do Not Use It For

- EXPLAIN plan tuning
- connection pooling and saturation
- RLS policy debugging
- lock contention or transaction hotspots
- vacuum, `pg_stat_statements`, or other diagnostics work

Use `postgres-optimization` for those.

## Read Map

- `database-selection.md`: repo-biased persistence choice
- `orm-selection.md`: Prisma-first ORM guidance
- `schema-design.md`: tables, keys, relationships, constraints
- `indexing.md`: index planning from access patterns
- `migrations.md`: safe schema rollout
- `optimization.md`: generic query hygiene only

## Core Rules

- Design from access patterns, not abstract purity.
- Add constraints early; do not outsource integrity to application code.
- Bias toward Prisma/Postgres and Supabase/Postgres unless the service already uses Mongo.
- Keep migrations incremental and reversible.
- Treat indexing as part of schema design, not as a cleanup step.

## Working Style

- Ask which app or service owns the data when unclear.
- Name the persistence path you are assuming.
- If you recommend a different store or ORM, explain why the repo default is insufficient.
- Keep advice design-level; pull in `postgres-optimization` only for deep Postgres or Supabase issues.

## Output Expectations

Return:

- chosen persistence path
- schema, relationship, and index plan
- migration plan or rollout notes
- risks and open questions
