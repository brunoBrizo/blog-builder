---
name: postgres-optimization
description: Deep Postgres and Supabase optimization skill. Use for query and index tuning, connection pooling, RLS, locks, diagnostics, and Supabase-specific operational issues once the persistence path is already known.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Postgres Optimization

Use this skill only after the task is already known to belong to Postgres or Supabase/Postgres.

## Use It For

- query-plan analysis with `EXPLAIN`
- missing, partial, composite, or covering index work
- connection pooling and prepared-statement trade-offs
- RLS correctness and performance
- lock contention, deadlocks, and long transactions
- diagnostics with stats views, vacuum/analyze, and Supabase operational checks

## Do Not Use It For

- choosing between databases or ORMs
- high-level schema modeling
- general migration planning unless the problem is specifically Postgres behavior

Use `database-design` for those.

## Read Map

- `references/query-and-indexing.md`: query plans and index selection
- `references/pooling-and-concurrency.md`: pooling, transactions, and locks
- `references/rls-and-supabase.md`: policies, roles, and Supabase security concerns
- `references/diagnostics.md`: measuring, vacuuming, and validating fixes

## Core Rules

- Measure first; do not rewrite queries blindly.
- Tune indexes to real filters, joins, sort order, and predicates.
- Default to pooled connections unless a session-bound feature requires otherwise.
- Enforce multi-tenant boundaries in the database with RLS, not only in application code.
- Keep transactions short and avoid lock amplification.

## Working Style

- State the exact query, table, policy, or runtime symptom being optimized.
- Prefer the smallest fix that explains the symptom.
- Hand schema-design questions back to `database-design` instead of duplicating design guidance here.
- For Supabase tasks, consider auth, RLS, functions, and pooled connection behavior together.

## Output Expectations

Return:

- measured problem or likely bottleneck
- concrete change
- trade-offs and risk
- how to validate the improvement
