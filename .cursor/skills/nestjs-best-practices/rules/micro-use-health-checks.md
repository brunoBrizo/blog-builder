---
title: Implement Health Checks for Microservices
tags: microservices, health-checks, readiness
---

## Rule

Expose separate liveness and readiness checks. Liveness answers "should this
process restart?" Readiness answers "can this instance serve traffic now?"

**Avoid**

```typescript
@Get('health')
async check() {
  await this.externalApi.ping();
  return 'OK';
}
```

**Prefer**

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly db: DatabaseHealthService,
    private readonly shutdown: ShutdownStateService,
  ) {}

  @Get('live')
  live() {
    return { ok: true };
  }

  @Get('ready')
  async ready() {
    if (this.shutdown.isDraining()) {
      throw new ServiceUnavailableException('draining');
    }

    await this.db.ping();
    return { ok: true };
  }
}
```

- Keep liveness cheap and local to the process.
- Check only serving-critical dependencies in readiness.
- Do not block probes on optional or slow downstream systems.
