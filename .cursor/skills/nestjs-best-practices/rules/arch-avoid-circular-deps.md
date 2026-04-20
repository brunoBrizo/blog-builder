---
title: Avoid Circular Dependencies
tags: architecture, modules
---

Keep module dependencies one-way. If two features need each other, move the shared contract or helper into a third module instead of relying on `forwardRef()`.

Incorrect:

```typescript
@Module({ imports: [OrdersModule], providers: [UsersService] })
export class UsersModule {}

@Module({ imports: [UsersModule], providers: [OrdersService] })
export class OrdersModule {}
```

Correct:

```typescript
@Module({ providers: [UserLookupService], exports: [UserLookupService] })
export class AccountsSharedModule {}

@Module({ imports: [AccountsSharedModule], providers: [UsersService] })
export class UsersModule {}

@Module({ imports: [AccountsSharedModule], providers: [OrdersService] })
export class OrdersModule {}
```

Repo note: in Nx, move shared contracts down to a lower-level shared lib.
