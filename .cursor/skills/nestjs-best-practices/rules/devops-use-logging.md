---
title: Use Structured Logging
tags: devops, logging, observability
---

## Rule

Use structured logs with stable fields and redaction. Avoid `console.log` in
app code.

**Avoid**

```typescript
console.log('Login attempt', { email, password });
```

**Prefer**

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly logger: AppLogger) {}

  async create(dto: CreateUserDto) {
    this.logger.info({ event: 'user.create.started', email: dto.email });

    try {
      return await this.usersRepo.create(dto);
    } catch (error) {
      this.logger.error({
        event: 'user.create.failed',
        email: dto.email,
        err: error,
      });
      throw error;
    }
  }
}
```

- Log structured fields, not concatenated strings.
- Redact secrets, tokens, cookies, and passwords.
- Carry request or correlation ids across async work when possible.
