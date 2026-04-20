---
title: Mock External Services in Tests
tags: testing, mocks, integrations
---

## Rule

Mock outbound boundaries in tests: HTTP clients, SDKs, queues, storage, email,
and webhooks. Keep tests deterministic and local.

**Avoid**

```typescript
const payments = new StripeClient(process.env.STRIPE_SECRET_KEY!);
await payments.charge({ amount: 1_000 });
```

**Prefer**

```typescript
const paymentsClient = { charge: jest.fn() };

paymentsClient.charge.mockResolvedValue({ id: 'ch_1', status: 'succeeded' });
await expect(service.charge(input)).resolves.toMatchObject({
  status: 'succeeded',
});

paymentsClient.charge.mockRejectedValue(new Error('timeout'));
await expect(service.charge(input)).rejects.toThrow(
  ServiceUnavailableException,
);
```

- Mock the provider your service owns, not SDK internals.
- Cover success, retryable failure, and permanent failure.
- Keep the mock shape minimal and specific to the code path under test.
