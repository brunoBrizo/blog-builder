---
name: typescript-advanced-types
description: Advanced TypeScript type-system guidance. Use when implementing non-trivial generics, conditional types, mapped types, template literal types, reusable type utilities, or complex inference that would be hard to model safely with basic interfaces alone.
---

# TypeScript Advanced Types

Use this skill only when the type design is genuinely complex. Do not load it
for routine interfaces, DTOs, or simple aliases.

## Use It For

- Reusable generic helpers and type utilities
- Conditional and mapped types that transform existing shapes
- Template literal types for key or string-shape derivation
- `infer`-based extraction and non-obvious inference control
- Compile-time contracts for libraries, config objects, API clients, and typed builders

## Do Not Use It For

- Simple interfaces or type aliases
- Straightforward `Pick`, `Omit`, `Partial`, or `Record` usage
- Cases where a runtime validator or a simpler explicit type is clearer
- Fancy type tricks that make the code harder to maintain than the bug they prevent

## Core Rules

- Prefer the simplest type that preserves safety.
- Model real invariants, not cleverness.
- Start with explicit types before building helpers.
- Keep type utilities small, named, and testable.
- If a type takes longer to understand than the runtime code, simplify it.

## Concept Map

- Generics: reusable parameterized types
- Conditional types: branch on type relationships
- Mapped types: transform keys or property modifiers
- Template literal types: derive string unions and keyed APIs
- `infer`: extract nested types from functions, tuples, and promises
- Utility patterns: compose a few simple helpers instead of one giant meta-type

## Read Map

- Read `references/core-concepts.md` for generics, conditional types, mapped
  types, template literals, and when to use each.
- Read `references/patterns-and-pitfalls.md` for reusable patterns, type tests,
  inference tricks, and common ways advanced typing becomes unreadable.

## Working Style

- Build the smallest helper that solves the current problem.
- Prefer built-in utility types when they already express the intent.
- Keep runtime behavior and type behavior aligned.
- When reviewing code, call out both safety gains and readability cost.

## Output Expectations

When implementing or reviewing, report:
- type problem
- simplest safe approach
- any helper type introduced or removed
- readability or maintenance risk
- example of the final intended type shape
