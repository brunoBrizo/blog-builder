---
name: repo-discovery
description: Survey an unfamiliar repo before planning. Use when the codebase is unclear, the task spans multiple subsystems, the work is a large refactor or integration, or a planner needs just enough codebase understanding to choose the right agents, skills, files, and risks before writing a plan.
allowed-tools: ReadFile, Glob, rg
---

# Repo Discovery

Use this skill to gather only the context needed to plan safely.

## Use It For

- unfamiliar repositories
- large refactors or cross-cutting changes
- integrations where touched areas are unclear
- requests to understand the repo before planning
- cases where the planner cannot name likely files, boundaries, or risks yet

## Core Rules

- Be selective, not exhaustive.
- Start from the request, then inspect only the relevant parts of the repo.
- Prefer exact files and directories over broad scanning.
- Stop once you can explain the likely impact area and planning risks.
- Do not implement or prototype. This skill is for understanding only.

## Discovery Flow

1. Identify the workspace shape and likely entry points.
2. Find the projects, apps, libs, or directories relevant to the request.
3. Trace the main dependencies, boundaries, and coupling around the affected area.
4. Note existing conventions for structure, tests, config, and environment.
5. Surface the smallest set of risks or open questions that could change the plan.

## Inspect First

- root manifests and workspace config
- app or library folders closest to the request
- entry points, routes, controllers, modules, or feature boundaries
- integration points, external services, queues, and env/config usage
- test locations and validation targets

## Output Expectations

Return concise findings that answer:

- what parts of the repo matter
- what files or directories are likely affected
- what architectural boundaries or dependencies matter
- what local conventions the plan should follow
- what risks, blockers, or open questions remain
- which specialist agents or skills are likely needed

## Handoff

If the goal is planning, hand the findings back to `project-planner`.
If requirements are still unclear after the survey, ask focused questions before
planning.
