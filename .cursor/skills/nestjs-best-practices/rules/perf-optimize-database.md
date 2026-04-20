---
title: Optimize Database Queries
tags: performance, database, queries
---

## Rule

Read only the data you need, paginate large result sets, and add indexes for
real filter and sort patterns.

**Avoid**

```typescript
return this.usersRepo.findMany();
```

**Prefer**

```typescript
return this.usersRepo.findMany({
  where: { status: 'active' },
  select: ['id', 'email', 'createdAt'],
  orderBy: { createdAt: 'desc' },
  take: 50,
});
```

- Add indexes through migrations for common filters, sorts, and join keys.
- Use database aggregates instead of loading rows to compute in JS.
- Inspect slow queries with logs or `EXPLAIN` before changing code.
- N+1 belongs in `db-avoid-n-plus-one.md`.
