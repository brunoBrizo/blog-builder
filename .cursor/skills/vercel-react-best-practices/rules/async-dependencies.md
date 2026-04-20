---
title: Dependency-Based Parallelization
tags: async, parallelization, dependencies, better-all
---

Start independent work immediately, then chain only the part that depends on earlier results.

Bad:
```ts
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig(),
])
const profile = await fetchProfile(user.id)
```

Good:
```ts
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise,
])
```

Note: reach for a helper library only when the dependency graph is complex enough to justify it.
