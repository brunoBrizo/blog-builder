---
title: Dynamic Imports for Heavy Components
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

Use `next/dynamic` to lazy-load large components not needed on initial render.

Bad:
```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

Good:
```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```
