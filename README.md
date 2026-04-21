# Blog Builder

Nx monorepo for an AI & tech blog. Next.js frontend, NestJS backend, Supabase Postgres, and a Perplexity-driven content pipeline.

## Prerequisites

- Node.js `24.12.0` (pinned in `.nvmrc`)
- pnpm `>= 10.0.0` (managed via Corepack: `corepack enable pnpm && corepack prepare pnpm@latest --activate`)

## Workspace layout

```
apps/
  web/          # Next.js 16 (App Router, React 19, Tailwind v4, React Compiler)
  web-e2e/      # Playwright e2e for web
  api/          # NestJS 11 API (Perplexity orchestration, cron endpoints)
libs/
  ui/           # React component library (type:ui, scope:frontend)
  shared-types/ # Shared TS types (type:util, scope:shared)
  seo/          # SEO helpers (type:util, scope:shared)
  db/           # Drizzle schema + client (type:data-access, scope:backend)
  prompts/      # Typed Perplexity prompt builders (type:util, scope:backend)
```

Nx tags drive module-boundary rules. See `eslint.config.mjs`.

## Install

```bash
pnpm install
```

## Common scripts

```bash
pnpm nx serve web           # Next.js dev server (Turbopack)
pnpm nx serve api           # NestJS dev server
pnpm nx run-many -t lint    # Lint all projects
pnpm nx run-many -t test    # Run all unit tests
pnpm nx run-many -t build   # Build all projects
pnpm format                 # Prettier write
pnpm format:check           # Prettier check
pnpm nx graph               # Open the project graph
```

Target a single project with `pnpm nx <target> <project>` (e.g. `pnpm nx test ui`).

## Tooling

- **TypeScript** strict everywhere (`tsconfig.base.json`), with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- **ESLint** flat config + `@nx/enforce-module-boundaries` with tag-based `depConstraints`.
- **Prettier** formats `.ts/.tsx/.js/.json/.md/.css/.yml`.
- **Vitest** for libs and the Next.js app. Jest remains in `apps/api` until the Vitest swap ships.
- **Playwright** scaffolded in `apps/web-e2e`.
- **Husky + lint-staged + commitlint** enforce Conventional Commits and pre-commit formatting/linting.

## Commit conventions

Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, …). Enforced by `commit-msg` hook.

## More context

- `docs/help-guides/` — local setup, env, database, Inngest, manual generation testing
- `docs/tech-stack.md` — full tech stack
- `docs/seo-geo.md` — SEO + GEO policy
- `docs/accessibility.md` — WCAG 2.2 AA plan
- `features/` — enumerated feature specs (build order)
