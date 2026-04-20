---
title: Cache Property Access in Loops
tags: javascript, loops, optimization, caching
---

Cache object property lookups in hot paths.

Bad:
```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

Good:
```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```
