---
title: Keep Services Focused
tags: architecture, services
---

A service should own one kind of decision. Split orchestration from policy or side effects when one class starts doing all three.

Incorrect:

```typescript
@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto) {}
  async charge(orderId: string) {}
  async sendConfirmation(orderId: string) {}
  async calculateStats(userId: string) {}
}
```

Correct:

```typescript
@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto) {}
}

@Injectable()
export class PaymentsService {
  async charge(orderId: string) {}
}

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orders: OrdersService,
    private readonly payments: PaymentsService,
  ) {}
}
```
