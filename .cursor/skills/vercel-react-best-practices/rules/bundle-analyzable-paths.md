---
title: Prefer Statically Analyzable Paths
tags: bundle, nextjs, vite, webpack, rollup, esbuild, path
---

Keep import and file-system paths explicit so the bundler or tracer can see the exact reachable files.

Bad:
```ts
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

const Page = await import(PAGE_MODULES[pageName])
```

Good:
```ts
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const

const Page = await PAGE_MODULES[pageName]()
```

Note: apply the same rule to server-side `fs` paths. Prefer explicit literals or explicit maps over `path.join(process.cwd(), someVar)` when build output depends on the path.
