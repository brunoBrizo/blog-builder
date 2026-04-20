---
title: Prefer Constructor Injection
tags: dependency-injection, constructors
---

Use constructor injection so required dependencies are explicit and testable. Avoid property injection for normal providers.

Incorrect:

```typescript
@Injectable()
export class UsersService {
  @Inject()
  private readonly repo: UsersRepository;
}
```

Correct:

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}
}
```

Repo note: property injection is a niche escape hatch, not the default.
