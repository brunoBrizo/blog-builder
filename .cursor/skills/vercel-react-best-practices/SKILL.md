---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidance from Vercel. Use when writing, reviewing, or refactoring React or Next.js code for waterfalls, bundle size, server performance, client fetching, rerenders, rendering cost, or hot-path JavaScript behavior. Triggers on React components, App Router code, data fetching, hydration, caching, and performance work.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Use this skill to prioritize the highest-impact performance fixes first instead
of jumping straight to micro-optimizations.

## Use It When

- React or Next.js code feels slow, heavy, or over-rendered
- You are reviewing data fetching, caching, hydration, or bundle behavior
- You are refactoring App Router, RSC, SSR, or client component boundaries
- You want performance-safe patterns for event handling, rendering, or hot loops

## Priority Order

1. `async-*`: remove waterfalls and stream where possible
2. `bundle-*`: reduce shipped code and avoid broad traces
3. `server-*`: improve RSC, SSR, caching, serialization, and request safety
4. `client-*`: deduplicate client fetching and browser listeners
5. `rerender-*`: stop unnecessary subscriptions, effects, and expensive rerenders
6. `rendering-*`: reduce browser rendering and hydration work
7. `js-*`: apply hot-path JavaScript optimizations only when they matter
8. `advanced-*`: use only when the simpler rules are already in place

## Working Rules

- Start with waterfalls and bundle size before micro-optimizations.
- Read only the rule files relevant to the current bottleneck.
- Keep version-sensitive guidance gated to the stack in front of you.
- Treat optional libraries and advanced APIs as tools, not defaults.

## Good Starting Points

- Waterfalls: `async-parallel`, `async-defer-await`, `async-suspense-boundaries`
- Bundles: `bundle-barrel-imports`, `bundle-dynamic-imports`, `bundle-analyzable-paths`
- Server/RSC: `server-cache-react`, `server-dedup-props`, `server-serialization`
- Rerenders: `rerender-no-inline-components`, `rerender-derived-state-no-effect`, `rerender-use-deferred-value`
- Rendering: `rendering-content-visibility`, `rendering-script-defer-async`, `rendering-resource-hints`

## How To Use

1. Identify the dominant bottleneck category.
2. Read the matching rule files under `rules/`.
3. Apply the highest-impact fix first.
4. Re-measure before moving on to lower-impact rules.
