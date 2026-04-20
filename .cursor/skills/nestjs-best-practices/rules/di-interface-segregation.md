---
title: Depend on Small Capability Interfaces
tags: dependency-injection, interfaces, solid
---

Depend on the smallest contract a class actually needs. Do not inject a wide port when the consumer uses one method.

Incorrect:

```typescript
abstract class NotificationPort {
  abstract sendEmail(to: string, body: string): Promise<void>;
  abstract sendSms(to: string, body: string): Promise<void>;
  abstract sendPush(userId: string, body: string): Promise<void>;
}

class OrdersService {
  constructor(private readonly notifications: NotificationPort) {}
}
```

Correct:

```typescript
abstract class EmailSender {
  abstract sendEmail(to: string, body: string): Promise<void>;
}

class OrdersService {
  constructor(private readonly emailSender: EmailSender) {}
}
```
