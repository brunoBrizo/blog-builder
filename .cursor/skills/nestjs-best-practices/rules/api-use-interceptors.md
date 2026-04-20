---
title: Use Interceptors for Cross-Cutting Concerns
tags: api, interceptors
---

Use interceptors for request/response behavior that wraps many handlers, such as logging, timing, or response shaping. Do not put auth or DTO validation in them.

Incorrect:

```typescript
@Get()
async findAll() {
  const startedAt = Date.now();
  const data = await this.usersService.findAll();
  this.logger.log(`findAll ${Date.now() - startedAt}ms`);
  return { data };
}
```

Correct:

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const startedAt = Date.now();
    return next.handle().pipe(tap(() => this.logger.log(Date.now() - startedAt)));
  }
}

@UseInterceptors(LoggingInterceptor)
@Get()
async findAll() {
  return this.usersService.findAll();
}
```
