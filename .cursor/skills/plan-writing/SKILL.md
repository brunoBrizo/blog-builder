---
name: plan-writing
description: Write short, executable plans for features, refactors, and other multi-step work. Use when the work needs ordered tasks, dependencies, and clear verification.
allowed-tools: ReadFile, Glob, rg
---

# Plan Writing

Write a short plan that an implementation agent can execute without guessing.

## Rules
- Save the plan as `.cursor/plans/{task-slug}.plan.md`.
- If brainstorming already produced a design spec, use `.cursor/plans/{topic-slug}.design.md` as input. Do not overwrite the spec; write a separate execution plan outside the repo.
- Keep it short: usually 5-10 tasks, one line each.
- Each task must describe one concrete action and one way to verify it.
- Order tasks by dependency. Put final verification last.
- Adapt the plan to the task. Do not force a fixed template or irrelevant scripts.

## What To Capture
- Goal: one sentence describing what is being built or fixed.
- Tasks: specific actions with verification criteria.
- Done when: the minimum success conditions.

## Task Quality
Good tasks are specific, independently verifiable, small enough for one focused step, and relevant to the current project type.

Adjust the content to the work:
- new project: stack, MVP scope, initial structure, first verification
- feature: affected files, dependencies, integration points, verification
- bug fix: root cause, target change, regression check

## Minimal Format
```md
# [Task Name]

## Goal
[One sentence]

## Tasks
- [ ] [Concrete action] -> Verify: [check]
- [ ] [Concrete action] -> Verify: [check]

## Done When
- [ ] [Success criteria]
```

## Final Check
Before finishing, confirm the plan is brief, specific, ordered, and easy to verify.
