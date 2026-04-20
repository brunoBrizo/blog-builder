---
title: Use Transactions for Multi-Step Operations
tags: database, transactions, consistency
---

## Rule

Use a transaction when multiple writes must succeed or fail together. Do not
hold it open while calling HTTP APIs, email providers, or queues.

**Avoid**

```typescript
const order = await this.ordersRepo.create(input);
await this.inventoryRepo.reserve(input.items);
await this.paymentClient.charge(order.id);
```

**Prefer**

```typescript
async createOrder(input: CreateOrderDto) {
  const order = await this.db.transaction(async (tx) => {
    const created = await tx.orders.create(input);
    await tx.inventory.reserve(input.items);
    return created;
  });

  await this.jobs.add('order.created', { orderId: order.id });
  return order;
}
```

- Use transactions for business invariants, not for every query.
- Throw on invariant failure so the whole unit rolls back.
- For post-commit side effects, use an outbox or queue handoff.
