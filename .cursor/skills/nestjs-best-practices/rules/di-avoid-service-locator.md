---
title: Avoid Service Locator Lookups
tags: dependency-injection, anti-patterns
---

Do not resolve normal business dependencies with `ModuleRef.get()` inside methods. Inject collaborators in the constructor so dependencies stay explicit and testable.

Incorrect:

```typescript
@Injectable()
export class OrdersService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async create(dto: CreateOrderDto) {
    const users = this.moduleRef.get(UsersService);
    const inventory = this.moduleRef.get(InventoryService);
  }
}
```

Correct:

```typescript
@Injectable()
export class OrdersService {
  constructor(
    private readonly users: UsersService,
    private readonly inventory: InventoryService,
  ) {}
}
```

Repo note: keep `ModuleRef` for narrow framework-driven factory cases, not ordinary service collaboration.
