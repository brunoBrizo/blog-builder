---
title: Use Pipes for Parsing and Normalization
tags: api, pipes
---

Use pipes to parse and normalize raw params or query values before handler logic. Keep structural validation in `security-validate-all-input`.

Incorrect:

```typescript
@Get(':id')
async findOne(@Param('id') id: string, @Query('page') page: string) {
  const userId = id.trim();
  const pageNumber = Number(page || 1);
  return this.usersService.findOne(userId, pageNumber);
}
```

Correct:

```typescript
@Get(':id')
async findOne(
  @Param('id', ParseUUIDPipe) id: string,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
) {
  return this.usersService.findOne(id, page);
}
```

Repo note: use built-in pipes first; custom pipes should do reusable parsing or normalization.
