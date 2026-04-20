---
title: Use Set/Map for O(1) Lookups
tags: javascript, set, map, data-structures, performance
---

Convert arrays to Set/Map for repeated membership checks.

Bad:
```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

Good:
```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```
