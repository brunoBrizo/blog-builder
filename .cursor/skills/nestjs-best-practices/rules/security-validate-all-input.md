---
title: Validate Every Request Boundary
tags: security, validation, dto
---

Validate body, param, and query DTOs with a strict global `ValidationPipe`. Reject unknown fields before they reach business logic.

Incorrect:

```typescript
@Post()
create(@Body() body: any) {
  return this.usersService.create(body);
}
```

Correct:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

Repo note: this is the main validation rule; keep `api-use-pipes` for parsing and normalization only.
