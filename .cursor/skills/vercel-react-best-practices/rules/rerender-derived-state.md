---
title: Subscribe to Derived State
tags: rerender, derived-state, media-query, optimization
---

Subscribe to the boolean or derived state you render from instead of a continuously changing source value.

Bad:
```tsx
function Sidebar() {
  const width = useWindowWidth()
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

Good:
```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```
