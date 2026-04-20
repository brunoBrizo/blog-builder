---
title: Throw Exceptions Instead of Returning Error Shapes
tags: error-handling, exceptions
---

In HTTP-facing code, throw Nest exceptions for failure paths instead of returning `null`, status flags, or `{ error }`.

Incorrect:

```typescript
async findById(id: string): Promise<{ user?: User; error?: string }> {
  const user = await this.repo.findOne({ where: { id } });
  if (!user) return { error: 'User not found' };
  return { user };
}
```

Correct:

```typescript
async findById(id: string): Promise<User> {
  const user = await this.repo.findOne({ where: { id } });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

Repo note: if the service must stay transport-agnostic, throw a domain error and map it in a filter.
