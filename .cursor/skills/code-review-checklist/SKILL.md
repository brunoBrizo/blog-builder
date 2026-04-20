---
name: code-review-checklist
description: Review checklist for correctness, security, tests, and TypeScript quality. Use when reviewing changes or checking whether code is ready to merge.
allowed-tools: ReadFile, Glob, rg
---

# Code Review Checklist

Use this as a compact gate, not a long template.

## Correctness
- Does the change actually match the requirement?
- Are failure paths, null or empty states, and edge cases covered?
- Does error handling add context instead of hiding problems?

## Security
- Is untrusted input validated and sanitized where needed?
- Are auth, authorization, and sensitive data handled safely?
- Are secrets, unsafe sinks, and injection risks avoided?

## TypeScript And Code Quality
- Does the code follow the local TypeScript rule: explicit types, no `any`, clear naming, small functions, early returns, no magic numbers, and one level of abstraction?
- Are public classes or methods documented when the rule requires JSDoc?
- Are constants, types, and interfaces used where they improve clarity?
- Is the abstraction level appropriate, without duplication or unnecessary indirection?

## Testing
- Are the right tests updated for the change: unit, integration, or e2e?
- Do tests cover the changed behavior rather than the implementation details?
- Are test names and setup clear enough to act as documentation?

## Performance And Operations
- Does the change introduce obvious hot-path waste, N+1 queries, or unnecessary loops?
- Does it change API behavior, config, or docs in a way that also needs follow-up updates?

## Review Output
- Mark issues as blocking only when they would cause incorrect behavior, security risk, broken tests, or rule violations that matter to maintainability.
- Prefer concrete comments that explain what is wrong, why it matters, and what safer direction to take.
