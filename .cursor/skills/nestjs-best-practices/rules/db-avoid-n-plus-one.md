---
title: Avoid N+1 Queries
tags: database, performance, queries
---

## Rule

Do not fetch child records inside a parent loop. Load relations in one query or
in one batched follow-up query.

**Avoid**

```typescript
const orders = await this.ordersRepo.findManyByUser(userId);

for (const order of orders) {
  order.items = await this.orderItemsRepo.findManyByOrder(order.id);
}
```

**Prefer**

```typescript
const orders = await this.ordersRepo.findMany({
  where: { userId },
  include: { items: true },
});
```

- If relation loading would overfetch, fetch parents first, then children once
  with an `IN (...)` query and map in memory.
- In GraphQL, batch resolver lookups with a request-scoped loader.
- Check query count in logs or tests before and after the change.
