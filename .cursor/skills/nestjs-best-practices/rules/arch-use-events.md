---
title: Use Events for Fan-Out Side Effects
tags: architecture, events
---

Use events when one action fans out to independent side effects and the initiating service should not depend on each handler.

Incorrect:

```typescript
@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto) {
    const order = await this.repo.save(dto);
    await this.inventory.reserve(order.items);
    await this.email.sendConfirmation(order.id);
    await this.analytics.trackOrder(order.id);
    return order;
  }
}
```

Correct:

```typescript
@Injectable()
export class OrdersService {
  constructor(private readonly events: EventEmitter2) {}

  async create(dto: CreateOrderDto) {
    const order = await this.repo.save(dto);
    this.events.emit('order.created', { orderId: order.id, items: order.items });
    return order;
  }
}

@Injectable()
export class InventoryListener {
  @OnEvent('order.created')
  async handle(event: { orderId: string; items: OrderItem[] }) {
    await this.inventory.reserve(event.items);
  }
}
```

Repo note: use in-process events inside one service boundary; use a queue or broker for cross-service delivery.
