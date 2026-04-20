---
name: brainstorming
 description: "Use before creative or behavior-changing work. Clarifies intent, explores options, produces an approved design spec in `.cursor/plans/`, then hands off to `plan-writing` for the execution plan."
---

# Brainstorming

Turn an idea into an approved design before implementation.

## Hard Gate
Do not write code, scaffold, invoke implementation skills, or otherwise start implementation until the design has been presented and approved. This applies even to small tasks; the design can be brief, but it must exist.

## Workflow
1. Read project context first: relevant files, docs, and existing patterns.
2. If the request is too broad for one spec, decompose it into sub-projects and brainstorm them.
3. Ask clarifying questions one at a time. Prefer multiple choice when practical. Focus on purpose, constraints, and success criteria.
4. Propose 2-3 approaches with trade-offs. Lead with your recommendation.
5. Present the design in small sections and confirm each section with the user. Cover architecture, components, data flow, error handling, and testing.
6. Write the approved design to `.cursor/plans/{topic-slug}.design.md` unless the user prefers another location.
7. Self-review the spec: remove placeholders, fix contradictions, tighten scope, and resolve ambiguity.
8. Ask the user to review the written spec. If they request changes, update it and review again.
9. After approval, invoke `plan-writing` to turn the approved spec into an execution plan. Keep the design spec as `.cursor/plans/{topic-slug}.design.md` and write the task plan as a separate `.cursor/plans/{task-slug}.plan.md` file.

## Design Rules
- Keep the design focused and remove unnecessary features early.
- Break the system into small, clear units with explicit interfaces and dependencies.
- Follow existing codebase patterns when working in an established project.
- Include targeted cleanup only when it directly supports the current work.
