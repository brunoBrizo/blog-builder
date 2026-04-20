---
title: Keep JWT Auth Minimal and Verifiable
tags: security, auth, jwt
---

Load JWT config from env, keep claims minimal, and re-check current user state during validation.

Incorrect:

```typescript
JwtModule.register({ secret: 'hard-coded', signOptions: { expiresIn: '7d' } });

const payload = {
  sub: user.id,
  email: user.email,
  passwordHash: user.passwordHash,
};
```

Correct:

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: { expiresIn: '15m' },
  }),
});

const payload = { sub: user.id, roles: user.roles };

async validate(payload: JwtPayload) {
  const user = await this.usersService.findById(payload.sub);
  if (!user || !user.isActive) throw new UnauthorizedException();
  return user;
}
```
