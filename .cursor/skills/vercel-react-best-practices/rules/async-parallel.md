---
title: Promise.all() for Independent Operations
tags: async, parallelization, promises, waterfalls
---

When async operations have no interdependencies, execute them concurrently using `Promise.all()`.

Bad:
```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

Good:
```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```
