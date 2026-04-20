---
title: Store Event Handlers in Refs
tags: advanced, hooks, refs, event-handlers, optimization
---

Store callbacks in a ref when an effect should keep one subscription but always call the latest handler.

Bad:
```tsx
function useWindowEvent(event: string, handler: (e: Event) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

Good:
```tsx
function useWindowEvent(event: string, handler: (e: Event) => void) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e: Event) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

Note: if the codebase already uses `useEffectEvent`, that is the cleaner equivalent.
