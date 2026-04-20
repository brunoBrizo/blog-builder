---
title: Implement Graceful Shutdown
tags: devops, graceful-shutdown, lifecycle
---

## Rule

Enable Nest shutdown hooks and close long-lived resources cleanly. Mark the
instance unready before draining work.

**Avoid**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

**Prefer**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    private readonly readiness: ShutdownStateService,
    private readonly db: DatabaseClient,
    private readonly workers: QueueWorkersService,
  ) {}

  async onApplicationShutdown() {
    this.readiness.startDraining();
    await this.workers.close();
    await this.db.close();
  }
}
```

- Stop accepting new work before closing database, queue, or socket clients.
- Keep constructors synchronous. Cleanup belongs in lifecycle hooks.
- Set platform timeouts long enough for in-flight requests and jobs to finish.
