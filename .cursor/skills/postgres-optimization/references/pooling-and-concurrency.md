# Pooling And Concurrency

Use this file for connection pressure, long transactions, deadlocks, or lock-heavy workloads.

## Pooling Rules

- Default to connection pooling for application traffic.
- Prefer transaction pooling unless the workload requires session-bound features.
- Be explicit about prepared statements, temp tables, and session variables because they can conflict with transaction pooling.
- Do not create a new client or connection per request.

## Transaction Rules

- Keep transactions short.
- Avoid holding locks across network calls or application-side loops.
- Batch writes when possible, but do not turn one request into a huge transaction by default.
- Choose isolation level intentionally; do not increase it casually to hide race conditions.

## Locking Rules

- Update rows in a consistent order when multiple transactions touch the same entities.
- Use `FOR UPDATE` or `SKIP LOCKED` only when the workload truly needs it.
- Investigate deadlocks and blocked queries before adding retries everywhere.
- Treat long-running migrations and index creation as lock risks; sequence them carefully.

## Validate

- Check active connections, blocked sessions, and transaction age.
- Confirm that the fix lowers connection count, wait time, or deadlock frequency.
