---
title: Centralize Error Shaping with Filters
tags: error-handling, filters
---

Use exception filters for shared error mapping or logging. Do not hand-build error responses in controllers.

Incorrect:

```typescript
@Get(':id')
async findOne(@Param('id') id: string, @Res() res: Response) {
  try {
    return res.json(await this.usersService.findById(id));
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

Correct:

```typescript
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>().status(400).json({
      message: error.message,
    });
  }
}

{ provide: APP_FILTER, useClass: DomainErrorFilter }
```
