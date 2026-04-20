---
name: lint-and-validate
description: Mandatory validation loop for code changes. Use after edits to run the relevant lint, typecheck, and test commands before calling work done.
allowed-tools: ReadFile, Glob, rg, Shell
---

# Lint and Validate

Run validation after every code change. Do not report success while the relevant checks are failing.

## Repo Rules
- Prefer Nx targets first when the project is part of the workspace.
- For TypeScript, keep the local rule in mind: explicit types, no `any`, clear naming, small functions, early returns, and stable abstractions.
- Run only the checks that match the files you changed, but always include the strongest relevant test or type signal before finishing.

## Default Loop
1. Identify the affected project.
2. Run its lint target or equivalent.
3. Run its typecheck signal if applicable.
4. Run the nearest relevant tests.
5. Fix failures and repeat until clean.

## TypeScript And Nx
- Prefer commands like `yarn nx run <project>:lint`, `yarn nx run <project>:test`, and the appropriate e2e target when available.
- If a dedicated typecheck target does not exist, use the workspace TypeScript check that matches the project.
- Do not stop at formatting; enforce real lint, type, and test signals.

## Fallbacks
- If no Nx target exists, use the project's local lint or type commands.
- If no configured tool exists, inspect the project config and report the missing validation gap clearly.
