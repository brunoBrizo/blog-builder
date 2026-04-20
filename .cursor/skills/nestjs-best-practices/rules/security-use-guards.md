---
title: Enforce Access with Guards
tags: security, guards
---

Put authentication and authorization in guards plus metadata decorators, not in controller `if` statements.

Incorrect:

```typescript
@Get('admin')
async getAdminData(@Req() req: Request) {
  if (!req.user) throw new UnauthorizedException();
  if (!req.user.roles.includes('admin')) throw new ForbiddenException();
  return this.adminService.getData();
}
```

Correct:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin')
async getAdminData() {
  return this.adminService.getData();
}
```

Repo note: keep guard logic reusable and keep controllers unaware of how access is checked.
