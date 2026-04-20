---
title: Use TestingModule for Unit Tests
tags: testing, unit-tests, dependency-injection
---

## Rule

Use `Test.createTestingModule()` for Nest unit tests. Provide the subject under
test and only its immediate dependencies.

**Avoid**

```typescript
const service = new UsersService(new RealUsersRepository());
```

**Prefer**

```typescript
describe('UsersService', () => {
  let service: UsersService;
  const usersRepo = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: USERS_REPOSITORY, useValue: usersRepo },
      ],
    }).compile();

    jest.clearAllMocks();
    service = moduleRef.get(UsersService);
  });

  it('creates a user', async () => {
    usersRepo.create.mockResolvedValue({ id: 'u1', email: 'ada@example.com' });

    await expect(
      service.create({ email: 'ada@example.com' }),
    ).resolves.toMatchObject({ id: 'u1' });
  });
});
```

- Use provider tokens or adapter classes so dependencies are easy to replace.
- Use `overrideProvider()` only when the test imports a real module.
- Do not bootstrap `AppModule` for a unit test.
