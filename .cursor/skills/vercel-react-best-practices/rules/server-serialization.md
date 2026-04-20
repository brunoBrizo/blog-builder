---
title: Minimize Serialization at RSC Boundaries
tags: server, rsc, serialization, props
---

Only pass the client component fields you actually need across a server-client boundary.

Bad:
```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

Good:
```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```
