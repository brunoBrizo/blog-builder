---
title: Default to Singleton Scope
tags: dependency-injection, scopes
---

Default providers to singleton scope. Use request scope only when you need request-local state or the raw request.

Incorrect:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  async findAll() {
    return this.repo.find();
  }
}
```

Correct:

```typescript
@Injectable()
export class UsersService {
  async findAll() {
    return this.repo.find();
  }
}

@Injectable({ scope: Scope.REQUEST })
export class AuditContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
}
```

Repo note: request scope can bubble through the dependency graph, so use it sparingly.
