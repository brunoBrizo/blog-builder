---
name: vercel-composition-patterns
description:
  React composition patterns that scale. Use when refactoring components with
  boolean prop sprawl, building compound components, designing provider/context
  APIs, or replacing rigid prop-based component customization with composition.
  Triggers on component architecture, reusable UI APIs, provider boundaries, and
  React 19 composition changes.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React Composition Patterns

Use this skill to make component APIs explicit, composable, and easier to
extend.

## Use It When

- A component has many mode flags like `isThread`, `isEditing`, or `compact`
- Consumers need different layouts around the same shared behavior
- State is trapped inside one component and siblings cannot access it cleanly
- A provider/context API is coupling UI to one state implementation
- Render props or config props are making the API harder to read than children

## Priority Order

1. `architecture-*`: remove boolean-mode APIs and define compound component shape
2. `state-*`: move shared state into providers and keep the UI bound to an interface
3. `patterns-*`: prefer explicit variants and children-based composition
4. `react19-*`: apply only when the project is already on React 19+

## Working Rules

- Prefer explicit variants over one component with many booleans.
- Keep providers responsible for state wiring; keep UI components responsible for rendering.
- Bind composed UI to a stable context interface like `state`, `actions`, and `meta`.
- Read only the rule files relevant to the current refactor.
- Do not apply React 19 guidance to React 18 codebases.

## Rule Map

- `architecture-avoid-boolean-props`
- `architecture-compound-components`
- `state-decouple-implementation`
- `state-context-interface`
- `state-lift-state`
- `patterns-children-over-render-props`
- `patterns-explicit-variants`
- `react19-no-forwardref`

## How To Use

1. Identify the API smell: boolean modes, trapped state, render props, or version-specific React APIs.
2. Read the matching rule files under `rules/`.
3. Apply the highest-impact architectural fix before smaller implementation cleanup.
