# Query And Indexing

Start here for slow reads, missing indexes, or unstable query plans.

## Measure First

- Run `EXPLAIN` or `EXPLAIN ANALYZE` on the actual query shape.
- Look for sequential scans on large tables, bad row estimates, large sort steps, and repeated nested-loop work.
- Confirm the real filters, join columns, and sort order before adding indexes.

## Index Rules

- Index foreign-key and join columns that are used in live queries.
- For composite indexes, put equality predicates before range predicates.
- Use partial indexes when the query repeatedly filters on a stable predicate such as `deleted_at is null` or tenant status.
- Use covering indexes only when they reduce real heap lookups on hot paths.
- Avoid indexing every column; extra indexes hurt writes and bloat storage.

## Query Rules

- Do not use `select *` on hot paths.
- Fix N+1 access patterns before micro-optimizing single queries.
- Push pagination, filtering, and sorting into the database.
- If Prisma generates a poor shape for a critical query, use targeted raw SQL instead of replacing Prisma wholesale.

## Validate

- Compare the new plan with the old one.
- Check whether the index is actually used.
- Re-test with realistic row counts, not only local toy data.
