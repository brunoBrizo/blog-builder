---
title: Version Only Breaking API Changes
tags: api, versioning
---

Use Nest versioning only for breaking public API changes. Do not hardcode version prefixes into controller paths.

Incorrect:

```typescript
@Controller('v1/users')
export class UsersV1Controller {}

@Controller('v2/users')
export class UsersV2Controller {}
```

Correct:

```typescript
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

@Controller('users')
@Version('1')
export class UsersV1Controller {}

@Controller('users')
@Version('2')
export class UsersV2Controller {}
```

Repo note: share unchanged handlers instead of forking whole controllers by habit.
