# 19. CI / CD & Deployments

## Goal

Automate lint, test, build, migrate, and deploy for both apps so every merge to `main` reaches production safely, and every PR is verified without human babysitting.

## Dependencies

- [01. Foundation — Monorepo & Tooling](./01-foundation-monorepo-tooling.md).
- [02. Database & Data Layer](./02-database-and-data-layer.md).
- [03. API Foundation](./03-api-foundation.md).
- [04. Web Foundation](./04-web-foundation.md).

## Scope

In scope:

- GitHub Actions pipelines for PRs and for `main`.
- Nx affected commands to keep CI fast.
- Database migration step run before API deploy.
- Preview deploys for web (Vercel) and optional preview apps for API (Fly.io staging).
- Release tagging + changelog.
- Branch protection and required checks.

Out of scope:

- Canary / blue-green deploys.
- Multi-region HA.

## Backend / platform work

- GitHub Actions workflow `pr.yml`:
  - Trigger: `pull_request`.
  - Steps: checkout (with fetch-depth for Nx affected), pnpm + Node setup, `pnpm install --frozen-lockfile`, `pnpm nx format:check`, `pnpm nx affected -t lint test build --parallel=3`, Playwright + axe run against a preview build, Lighthouse CI against the preview URL with assertions from feature 17.
  - Required checks on `main`: format, lint, test, build, e2e, lighthouse.
- Workflow `main.yml`:
  - Trigger: `push` to `main`.
  - Builds `apps/api` container, logs in to Fly.io with `FLY_API_TOKEN` secret, runs `fly deploy` with `--build-arg GIT_SHA=...`. `fly.toml` `release_command` runs `drizzle-kit migrate`.
  - Deploys `apps/web` via Vercel Git integration (no GitHub Action step needed beyond tagging).
  - After both deploys succeed: create a GitHub release with auto-generated notes (Conventional Commits → categorized changelog).
- Secrets management:
  - GitHub Actions secrets: `FLY_API_TOKEN`, `VERCEL_TOKEN` (only if needed), `SUPABASE_DB_URL_STAGING`, Lighthouse CI token.
  - Fly.io secrets: `DATABASE_URL`, `PERPLEXITY_API_KEY`, `RESEND_API_KEY`, `CRON_SHARED_SECRET`, `REVALIDATE_SHARED_SECRET`, `SENTRY_DSN`, `SUPABASE_SERVICE_ROLE_KEY`, log-drain token.
  - Vercel env vars: public + server `NEXT_PUBLIC_*` and server-only API URL + shared secrets.
- Staging environment:
  - Vercel preview builds for `apps/web` on every PR.
  - Fly.io staging app (`blog-builder-api-staging`) deployed from `main` prior to production, or optionally from each PR on demand (skip on docs-only PRs).
- Dependabot config for npm + GitHub Actions weekly updates; PRs auto-run the full test suite.
- Nx Cloud (free hobby tier) enabled for distributed task caching in CI to keep runs < 10 min.
- Branch protection on `main`: require PR, require all status checks, require linear history, require signed commits.
- CODEOWNERS file maps top-level folders to review owners.

## Frontend / app work

- `apps/web` Vercel project configured with build command `pnpm nx build web` and output `.next/`.
- Image remote pattern and Supabase Storage domain added to Vercel env.
- Preview URLs include a staging indicator banner (read from `NEXT_PUBLIC_ENV`).
- `apps/api` Dockerfile (multi-stage, distroless runtime) with a cache-friendly layer layout to keep Fly.io deploys fast.

## Acceptance criteria

- A no-op PR completes CI in ≤ 5 min (with Nx Cloud cache) and never hits flake > 1 %.
- A PR that introduces a failing unit test or a lint error cannot merge.
- A merge to `main` deploys `apps/api` to Fly.io, runs migrations successfully, and redeploys `apps/web` on Vercel, with both releases tagged with the same git sha.
- A botched migration on staging is catchable via the staging Fly app before hitting production.
- Releases on GitHub show categorized notes (feat / fix / chore) derived from Conventional Commits.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#hosting-and-deployment)
- [`.cursor/rules/nx-core.mdc`](../.cursor/rules/nx-core.mdc)
