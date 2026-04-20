---
name: architecture
description: Architectural decision-making framework. Use when making architecture decisions, comparing patterns, documenting trade-offs, or analyzing system design before implementation.
allowed-tools: Read, Glob, Grep
---

# Architecture Decision Framework

Read only the supporting file that matches the current question.

## Read Map

- `context-discovery.md` for requirements, constraints, and project shape
- `pattern-selection.md` for decision trees and anti-pattern checks
- `patterns-reference.md` for quick pattern comparison tables
- `trade-off-analysis.md` for ADRs and decision writeups
- `examples.md` only when a concrete example would help

## Core Rules

- Requirements drive architecture.
- Start simple and add complexity only when justified.
- Tie every pattern choice to a real problem, not preference.
- Document meaningful decisions and accepted trade-offs.

## Related Skills

- `@[skills/database-design]` for schema and indexing decisions

## Completion Check

Before finalizing architecture:

- requirements and constraints are clear
- simpler alternatives were considered
- chosen patterns match team and scale
- trade-offs are explicit
- ADRs exist for major decisions
