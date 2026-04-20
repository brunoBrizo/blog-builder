---
title: Share Providers Through Modules
tags: architecture, modules, exports
---

Define a shared provider once, export it from its module, and import that module where needed. Do not register the same long-lived provider in multiple modules.

Incorrect:

```typescript
@Module({ providers: [StorageService] })
export class AppModule {}

@Module({ providers: [StorageService] })
export class VideosModule {}
```

Correct:

```typescript
@Module({ providers: [StorageService], exports: [StorageService] })
export class StorageModule {}

@Module({ imports: [StorageModule], providers: [VideosService] })
export class VideosModule {}
```

Repo note: keep `@Global()` rare.
