---
title: Rate Limit Abuse-Prone Endpoints
tags: security, rate-limiting
---

Rate limit endpoints that are easy to abuse, especially auth, password reset, and expensive mutations.

Incorrect:

```typescript
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

Correct:

```typescript
@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

@Post('login')
@Throttle({ default: { ttl: 60_000, limit: 5 } })
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

Repo note: use a shared store when the app runs on multiple instances.
