---
title: Use Database Migrations
tags: database, migrations, schema
---

## Rule

Commit a migration for every schema change. Do not rely on runtime schema sync,
manual production SQL, or `db push`-style shortcuts as the deploy contract.

**Avoid**

```typescript
// Schema changed in code, but no migration was committed.
```

**Prefer**

```text
1. Add the schema change in a migration.
2. Backfill existing data safely if needed.
3. Add constraints and indexes once data is valid.
4. Remove old shape in a later migration if the change is destructive.
```

- Review lock time, backfill size, and index strategy before production runs.
- Commit generated Prisma migrations when Prisma is used.
- The migration file is the source of truth, not ORM auto-sync behavior.
