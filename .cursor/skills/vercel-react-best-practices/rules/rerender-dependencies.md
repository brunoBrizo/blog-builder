---
title: Narrow Effect Dependencies
tags: rerender, useEffect, dependencies, optimization
---

Depend on the smallest stable value an effect actually reads.

Bad:
```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

Good:
```tsx
const isMobile = width < 768

useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

Note: prefer primitives like `user.id` or derived booleans over whole objects or rapidly changing source values.
