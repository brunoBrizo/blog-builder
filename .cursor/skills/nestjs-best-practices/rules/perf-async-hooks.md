---
title: Use Async Lifecycle Hooks Correctly
tags: performance, lifecycle, async
---

## Rule

Await required startup work in Nest lifecycle hooks. Keep constructors
synchronous and move optional warmups out of the critical boot path.

**Avoid**

```typescript
onModuleInit() {
  this.connect(); // fire and forget
}

constructor() {
  this.config = fs.readFileSync('config.json');
}
```

**Prefer**

```typescript
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
}
```

- Nest waits for returned promises from `onModuleInit` and
  `onApplicationBootstrap`.
- Only block startup on work required before serving traffic.
- Move cache warmups, scans, and backfills to background jobs or delayed tasks.
