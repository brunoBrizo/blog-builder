---
title: Sanitize Rich Output and Neutralize Reflected Values
tags: security, sanitization, xss
---

Sanitize any user HTML before storing or rendering it, and never reflect raw user strings into HTML or exception messages.

Incorrect:

```typescript
@Get(':slug')
@Header('Content-Type', 'text/html')
async show(@Param('slug') slug: string) {
  const page = await this.pagesService.findBySlug(slug);
  return `<html><body>${page.content}</body></html>`;
}
```

Correct:

```typescript
@Injectable()
export class PagesService {
  async create(dto: CreatePageDto) {
    return this.repo.save({
      ...dto,
      content: sanitizeHtml(dto.content, { allowedTags: ['p', 'a', 'strong', 'em'] }),
    });
  }
}
```

Repo note: do not echo raw params or query values into HTML or exception messages.
