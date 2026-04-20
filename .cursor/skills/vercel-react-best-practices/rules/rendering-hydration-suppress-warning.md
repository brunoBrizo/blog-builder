---
title: Suppress Expected Hydration Mismatches
tags: rendering, hydration, ssr, nextjs
---

In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide real bugs. Don’t overuse it.

Bad:
```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

Good:
```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```
