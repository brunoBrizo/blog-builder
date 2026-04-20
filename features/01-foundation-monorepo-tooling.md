# 01. Foundation — Monorepo & Tooling

## Goal

Stand up the empty Nx monorepo with the exact tooling the rest of the program depends on. Nothing ships to users from this feature; every subsequent feature is blocked until this lands.

## Dependencies

None. This is the first feature.

## Scope

In scope:

- Nx workspace with pnpm and TypeScript strict mode.
- Shared lint, format, test, and commit-hygiene tooling.
- Empty shells for `apps/web`, `apps/api`, and the core `libs/*` directories referenced in [`docs/tech-stack.md`](../docs/tech-stack.md#file-structure).
- Local developer experience: a single `pnpm install` + `pnpm nx run-many` should cover lint/test/build across the workspace.

Out of scope:

- Any feature code (handled by features 02+).
- CI pipeline wiring (handled by feature 19; local hooks only here).

## Backend work

- Generate `apps/api` as an empty NestJS application via the Nx Nest plugin. Confirm it builds and serves `/health` returning `{status: 'ok'}`.
- Create empty `libs/shared-types`, `libs/db`, `libs/prompts` library scaffolds (no business logic yet). Confirm they are resolvable from `apps/api` and, where appropriate, from `apps/web`.
- Configure the API `tsconfig` to honor path aliases defined at the workspace root.

## Frontend work

- Generate `apps/web` as an empty Next.js 16.2 App Router application via the Nx Next plugin, with Turbopack as the dev bundler.
- Create empty `libs/ui` and `libs/seo` library scaffolds. Confirm they are resolvable from `apps/web`.
- Configure Tailwind CSS v4 at the workspace level so `libs/ui` and `apps/web` share the same token pipeline.

## Shared platform work

- pnpm workspaces configured with the same Node LTS version pinned via `.nvmrc` or `packageManager`.
- TypeScript 5.x strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` across the workspace.
- ESLint with the Nx module-boundaries plugin; rules in [`.cursor/rules/nx-boundaries.mdc`](../.cursor/rules/nx-boundaries.mdc) enforced by the ruleset.
- Prettier as the single formatter.
- Vitest configured for unit tests (one sample test per app/lib to prove the wire-up).
- Playwright scaffolded for end-to-end (no tests yet; config only).
- Husky + lint-staged pre-commit hook runs `eslint --fix` and `prettier --write` on staged files.
- Commitlint with Conventional Commits, enforced in a `commit-msg` hook.
- Root `README.md` documents `pnpm install`, `pnpm nx serve web`, `pnpm nx serve api`, and `pnpm nx run-many -t lint test build`.

## Acceptance criteria

- `pnpm install` completes from a clean checkout.
- `pnpm nx run-many --target=lint,test,build --all` passes.
- `pnpm nx serve web` and `pnpm nx serve api` both start on distinct local ports.
- Pre-commit hook blocks a commit that introduces a lint error or a non-conventional commit message.
- Nx module boundaries block `apps/web` from importing server-only code in `libs/db` or `apps/api`.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#monorepo-and-tooling)
- [`.cursor/rules/nx-architecture.mdc`](../.cursor/rules/nx-architecture.mdc), [`nx-boundaries.mdc`](../.cursor/rules/nx-boundaries.mdc), [`nx-core.mdc`](../.cursor/rules/nx-core.mdc)
- [`.cursor/rules/typescript-guidelines.mdc`](../.cursor/rules/typescript-guidelines.mdc)
