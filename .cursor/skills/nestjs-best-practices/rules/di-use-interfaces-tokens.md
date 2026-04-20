---
title: Use Runtime Tokens for Interface-Based DI
tags: dependency-injection, tokens, interfaces
---

TypeScript interfaces disappear at runtime. Use a symbol, string token, or abstract class when you want interface-style DI.

Incorrect:

```typescript
export interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

@Injectable()
export class OrdersService {
  constructor(private readonly payment: PaymentGateway) {}
}
```

Correct:

```typescript
export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

@Module({
  providers: [{ provide: PAYMENT_GATEWAY, useClass: StripePaymentGateway }],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentsModule {}

@Injectable()
export class OrdersService {
  constructor(@Inject(PAYMENT_GATEWAY) private readonly payment: PaymentGateway) {}
}
```
