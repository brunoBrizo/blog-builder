---
title: Return Response DTOs
tags: api, dto, serialization
---

Return response DTOs or explicit serialized shapes, not entities.

Incorrect:

```typescript
@Get(':id')
async findOne(@Param('id') id: string): Promise<User> {
  return this.usersService.findById(id);
}
```

Correct:

```typescript
export class UserResponseDto {
  @Expose() id: string;
  @Expose() email: string;
}

@Get(':id')
async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  const user = await this.usersService.findById(id);
  return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
}
```

Repo note: never leak hashes, internal flags, or ORM-only fields by returning raw entities.
