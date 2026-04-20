# Diagnostics

Use this file when the task is to prove where the bottleneck is and verify that a fix worked.

## Start With Evidence

- Capture the exact query, route, job, or migration that is slow.
- Use `EXPLAIN` or `EXPLAIN ANALYZE` for query-level issues.
- Check stats views or platform metrics before guessing.

## What To Inspect

- query frequency and total cost
- sequential scans on large tables
- bloated or unused indexes
- stale statistics and autovacuum lag
- blocked sessions, long transactions, and lock waits
- connection count and pool saturation

## Supabase-Focused Checks

- whether the issue is query shape, policy cost, function behavior, or connection pressure
- whether row counts, function latency, or policy predicates changed after a migration
- whether the problem exists in direct SQL and through the application path

## Validate

- compare before/after plans or metrics
- confirm the fix changes the dominant bottleneck
- report how to monitor for regression
