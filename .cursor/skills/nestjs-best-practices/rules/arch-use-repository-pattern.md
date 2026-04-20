---
title: Keep Persistence in Repositories
tags: architecture, repository, data-access
---

Keep queries and persistence details in a repository or data-access provider so services stay focused on business rules and orchestration.

Incorrect:

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseClient) {}

  async findActiveWithMinOrders(minOrders: number) {
    return this.db.users.findActiveWithMinOrders(minOrders);
  }
}
```

Correct:

```typescript
export abstract class UsersRepository {
  abstract findActiveWithMinOrders(minOrders: number): Promise<UserSummary[]>;
}

@Injectable()
export class SqlUsersRepository extends UsersRepository {
  constructor(private readonly db: DatabaseClient) {
    super();
  }

  findActiveWithMinOrders(minOrders: number) {
    return this.db.users.findActiveWithMinOrders(minOrders);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async listActive(minOrders: number) {
    return this.usersRepo.findActiveWithMinOrders(minOrders);
  }
}
```

Repo note: the repository can be backed by Prisma, SQL, Supabase, an SDK, or another store. Keep the service unaware of the persistence technology.
