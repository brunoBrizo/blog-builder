# 15. Admin Dashboard

## Goal

Give the publisher a private control surface to review pending articles, trigger manual generation, edit content, manage categories/tags/authors, inspect Perplexity costs, and manage newsletter + contact inboxes.

## Dependencies

- [03. API Foundation](./03-api-foundation.md).
- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md).
- [12. Newsletter Subscription & Weekly Digest](./12-newsletter-subscription-and-digest.md).
- [13. Contact Form](./13-contact-form.md).

## Scope

In scope:

- Supabase Auth login with email magic link, restricted to a hardcoded allowlist of admin emails mirrored in `admin_users`.
- Protected route group `/[locale]/admin/*` (English-only UI acceptable to avoid localizing admin copy).
- Admin endpoints in the API, guarded by a `SupabaseAdminGuard` that verifies the bearer JWT + allowlist.
- Dashboards: content queue, published articles, categories/tags/authors, generation jobs, newsletter, contact inbox, Perplexity cost report.

Out of scope:

- Multi-tenant or multi-user role hierarchy — single-owner use case.
- Full CMS WYSIWYG — a simple Markdown editor is sufficient.

## Backend work

- `SupabaseAdminGuard` validates the `Authorization: Bearer <jwt>` via Supabase's JWKS and checks the decoded `sub` against `admin_users`.
- Admin endpoints (all under `/admin/*`, rate-limited in a dedicated throttler bucket):
  - `GET /admin/articles?status=...&cursor=...` — list with filters.
  - `GET /admin/articles/:id` — full article with translations, citations, job history.
  - `PATCH /admin/articles/:id/translations/:locale` — edit body, TL;DR, title, metadata.
  - `POST /admin/articles/:id/publish` and `POST /admin/articles/:id/unpublish`.
  - `POST /admin/articles/generate` — manual trigger for the generation pipeline (optionally seeding a topic).
  - `POST /admin/articles/:id/refresh` — manual trigger of the refresh pipeline.
  - `GET /admin/generation-jobs?cursor=...` — paginated pipeline log with step details.
  - CRUD for `/admin/categories`, `/admin/tags`, `/admin/authors`.
  - `GET /admin/newsletter/subscribers` (paginated) and `POST /admin/newsletter/send-test`.
  - `GET /admin/contact-messages` (paginated) and `POST /admin/contact-messages/:id/archive`.
  - `GET /admin/costs?range=30d` — aggregated Perplexity cost + token usage from `generation_jobs`.
- Every admin write is logged to an `audit_log` table with actor, action, entity, before/after diff.
- Edits to a published translation bump `updated_at`, trigger revalidation for the affected routes, and record an audit entry.

## Frontend work

- `/[locale]/admin` (default `/en/admin`) with Supabase Auth magic-link login page. Already-authed users land on the dashboard.
- `apps/web` client wraps admin routes in a layout that:
  - Requires a valid Supabase session (via server component + `cookies()`), else redirects to login.
  - Emits `X-Robots-Tag: noindex, nofollow` and `<meta name="robots" content="noindex, nofollow">`.
  - Shows a top-nav with: Articles · Generation · Content · Newsletter · Contact · Costs · Sign out.
- Articles section:
  - List view with status filters (`pending_review`, `published`, `draft`, `failed`).
  - Row action: Open editor.
  - Editor: three-locale tabs, Markdown editor (CodeMirror 6 with Markdown mode), live preview pane, fields for title/TL;DR/meta, image picker (uploads to Supabase Storage), FAQ editor, citations list.
  - "Publish" and "Unpublish" buttons with confirm dialog.
  - "Run refresh" button that enqueues a refresh job and polls its status.
- Generation section:
  - Form to trigger a new pipeline with optional topic seed.
  - Live job list: each row shows step progress (8 chips), duration, tokens, cost, error if any.
  - Click a job to view per-step input/output diffs.
- Content section (categories / tags / authors): CRUD tables with inline edit.
- Newsletter section: subscriber table (searchable, filterable by locale and confirmed state), export CSV, last digest status.
- Contact section: inbox list with preview, archive action, reply opens the local mail client (`mailto:`).
- Costs section: chart of daily Perplexity spend over 30 / 90 days, breakdown by step, projected monthly spend.
- All admin components built from `libs/ui` primitives; no admin-only dependencies.
- Admin pages are `dynamic = 'force-dynamic'`; no caching.

## Acceptance criteria

- Unauthenticated visitors hitting `/en/admin/*` are redirected to `/en/admin/login`.
- A non-allowlisted Supabase user cannot pass the admin guard even with a valid JWT.
- An admin can: trigger a generation, watch it progress, review it, edit one translation, and publish — with the public article page reflecting the change within 5 s.
- Every admin action appears in `audit_log`.
- Admin routes emit `noindex` at both HTTP header and meta tag levels.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md)
- [`.cursor/rules/nestjs-guidelines.mdc`](../.cursor/rules/nestjs-guidelines.mdc)
