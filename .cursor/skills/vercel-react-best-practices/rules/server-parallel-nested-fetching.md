---
title: Parallel Nested Data Fetching
tags: server, rsc, parallel-fetching, promise-chaining
---

Chain dependent work inside each item promise so one slow item does not block the rest.

Bad:
```tsx
const chats = await Promise.all(chatIds.map(id => getChat(id)))
const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)
```

Good:
```tsx
const chatAuthors = await Promise.all(
  chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
)
```

Note: each chat starts its author fetch as soon as that chat resolves.
