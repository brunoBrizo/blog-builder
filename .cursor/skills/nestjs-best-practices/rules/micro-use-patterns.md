---
title: Use Message and Event Patterns Correctly
tags: microservices, messaging, events
---

## Rule

Use `MessagePattern` when the caller needs a result. Use `EventPattern` for
notifications and side effects.

**Avoid**

```typescript
await this.notificationsClient.send('user.created', event);
// caller blocks on a side effect
```

**Prefer**

```typescript
const reservation = await firstValueFrom(
  this.inventoryClient.send({ cmd: 'inventory.reserve' }, dto),
);

this.auditClient.emit('order.created', {
  orderId: reservation.orderId,
  userId: dto.userId,
});

@MessagePattern({ cmd: 'inventory.reserve' })
reserve(@Payload() dto: ReserveInventoryDto) {
  return this.inventoryService.reserve(dto);
}

@EventPattern('order.created')
async handleOrderCreated(@Payload() event: OrderCreatedEvent) {
  await this.auditService.record(event);
}
```

- Use `send` and `@MessagePattern` for request-response flows.
- Use `emit` and `@EventPattern` for fan-out, notifications, and retryable work.
- Throw `RpcException` from message handlers. Catch, log, and retry inside event
  handlers.
