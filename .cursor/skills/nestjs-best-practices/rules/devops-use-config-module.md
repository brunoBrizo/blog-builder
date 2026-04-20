---
title: Use ConfigModule for Environment Configuration
tags: devops, configuration, environment
---

## Rule

Read environment variables once through `@nestjs/config`, validate them at
startup, and inject typed config elsewhere.

**Avoid**

```typescript
const databaseUrl = process.env.DATABASE_URL;
```

**Prefer**

```typescript
export const appConfig = registerAs('app', () => ({
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL!,
}));

ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig],
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
  }),
});

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}
}
```

- Do not scatter `process.env` access across services.
- Fail fast on missing or malformed values.
- Keep config namespaced so overrides stay obvious.
