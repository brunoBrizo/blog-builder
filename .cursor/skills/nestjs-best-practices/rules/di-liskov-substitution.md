---
title: Keep Implementations Substitutable
tags: dependency-injection, contracts, solid
---

Any alternative implementation or fake must preserve the same input, return type, and failure behavior as the real one.

Incorrect:

```typescript
abstract class PaymentGateway {
  abstract charge(amount: number): Promise<{ transactionId: string }>;
}

class MockPaymentGateway extends PaymentGateway {
  async charge(amount: number) {
    if (amount > 1000) return null as any;
    return { ok: true } as any;
  }
}
```

Correct:

```typescript
class MockPaymentGateway extends PaymentGateway {
  async charge(amount: number) {
    if (amount > 1000) throw new PaymentFailedException();
    return { transactionId: 'mock-tx-1' };
  }
}
```

Repo note: test doubles should fail like production code, not invent a new contract.
