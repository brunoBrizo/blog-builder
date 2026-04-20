---
title: Catch Errors Outside the Awaited Request Path
tags: error-handling, async
---

Nest only catches awaited request-path errors. Catch errors in background jobs, listeners, and fire-and-forget promises yourself.

Incorrect:

```typescript
async createUser(dto: CreateUserDto) {
  const user = await this.repo.save(dto);
  this.emailService.sendWelcome(user.email);
  return user;
}
```

Correct:

```typescript
async createUser(dto: CreateUserDto) {
  const user = await this.repo.save(dto);
  void this.emailService.sendWelcome(user.email).catch((error) => {
    this.logger.error('Failed to send welcome email', error.stack);
  });
  return user;
}
```

Repo note: listeners, schedulers, and queue handlers need their own error path too.
