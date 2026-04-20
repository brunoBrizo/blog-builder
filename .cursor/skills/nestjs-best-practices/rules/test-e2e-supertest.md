---
title: Use Supertest for E2E Testing
tags: testing, e2e, supertest
---

## Rule

Use Supertest against a real `INestApplication`. E2E tests should cover
routing, validation, guards, interceptors, and serialization while overriding
only outbound dependencies.

**Avoid**

```typescript
const controller = new UsersController(service as any);
await controller.create(dto);
```

**Prefer**

```typescript
describe('Users API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailClient)
      .useValue({ sendWelcome: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterAll(() => app.close());

  it('POST /users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'ada@example.com', name: 'Ada' })
      .expect(201);
  });
});
```

- Reset state with test helpers or explicit cleanup, not schema sync or drop
  APIs.
- Share a bootstrap helper if production globals matter to the test.
- Override email, queues, webhooks, and third-party APIs unless the test is
  intentionally full-stack.
