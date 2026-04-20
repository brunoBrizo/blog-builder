# 04. Web Foundation

## Goal

Turn the empty Next.js app into the production shell for the blog: internationalized routing, global layout with header/footer/nav, shared UI primitives, theming, typography, images/fonts pipeline, analytics + consent hooks, and the baseline SEO metadata plumbing. Every frontend feature after this builds on top of this shell.

## Dependencies

- [01. Foundation — Monorepo & Tooling](./01-foundation-monorepo-tooling.md).

## Scope

In scope:

- `next-intl` v16 configured for `en`, `pt-br`, `es` with `en` as default and middleware-driven locale detection.
- App Router root layout: document language + dir, theme class, skip-to-content link, global header, global footer, global sticky newsletter slot (UI only in this feature; wiring in feature 12).
- Typography, color tokens, spacing tokens wired through Tailwind v4 CSS-first config, shared between `libs/ui` and `apps/web`.
- `libs/ui` first batch of primitives the rest of the features will consume: Button, Link, Input, Textarea, Label, Checkbox, RadioGroup, Select, Dialog, Toast, Container, Card, Badge, Avatar, Alert, VisuallyHidden, Skeleton, Breadcrumbs. All built on Radix primitives where interactive semantics matter.
- `libs/seo` first batch: `buildMetadata()` helper, `buildOpenGraph()`, `buildTwitter()`, canonical URL helper, hreflang map builder, JSON-LD builders for `WebSite` and `Organization`.
- `next/image` pipeline with Supabase Storage as the image source; `next/font` for Inter + JetBrains Mono, self-hosted.
- Light/dark theme toggle respecting `prefers-color-scheme`; preference persisted in cookie.
- Baseline metadata (default `<title>`, `description`, `og:site_name`, favicons, web manifest).
- Structured data for Organization + WebSite injected in root layout.
- 404 and 500 pages with localized copy.
- Analytics + consent scaffolding (script placeholders only; real wiring happens in feature 16).

Out of scope:

- Actual blog reading UX (feature 07), homepage grid (feature 08), legal pages (feature 11), newsletter/contact logic (features 12/13), AdSense (feature 16), full a11y hardening (feature 17).

## Backend work

None. This feature does not touch `apps/api`.

## Frontend work

- Install and configure `next-intl` with message files for `en`, `pt-br`, `es`. Locale segment is the first path segment (`/en/...`, `/pt-br/...`, `/es/...`); default locale does not redirect.
- Root layout renders `<html lang>` and `<html dir>` from the active locale.
- Middleware enforces locale resolution and exposes `x-pathname` header so server components can build canonical URLs.
- Add the three top-level routes' empty placeholders (`(marketing)/`, `blog/`, `admin/`) so later features can drop pages in without restructuring.
- Build the `libs/ui` primitives listed above. Each primitive ships: component + variants (via `class-variance-authority`), unit test, Radix-based a11y semantics where relevant, and a Storybook-free visual demo (MDX page under `apps/web/app/_demo` during development; deleted before production).
- Build the `libs/seo` helpers listed above. Helpers are pure, unit-tested, and accept a locale + canonical path.
- Global header with logo, primary nav (placeholder links to be filled by later features), language switcher that preserves the current path, and theme toggle.
- Global footer with copyright, links to legal pages (placeholders filled in feature 11), social links (slot only for now), and the `List-Unsubscribe`-compliant newsletter footer text.
- Sticky newsletter CTA placeholder component on every page (form hookup lands in feature 12).
- `next/image` with a `remotePatterns` entry for Supabase Storage; AVIF/WebP enabled; default quality tuned.
- `next/font` with `Inter` variable + `JetBrains Mono` subset, swapped on `font-display: swap`, preloaded.
- Configure Turbopack as the dev bundler and verify the production build completes with the React Compiler enabled.
- 404 and 500 pages built from the `libs/ui` primitives with localized copy.

## Acceptance criteria

- Navigating to `/`, `/en/`, `/pt-br/`, `/es/` all resolve and render with the correct language, `lang`, and localized copy.
- Language switcher preserves the current path and pushes a canonical URL with `hreflang` alternates.
- Lighthouse mobile score on the home placeholder: Performance ≥ 90, Best Practices ≥ 95, SEO = 100.
- `libs/ui` primitives pass keyboard + screen reader sanity checks (no focus traps, visible focus ring, roles correct).
- Production build enables the React Compiler without runtime warnings.
- Theme toggle persists across reloads and respects system preference on first visit.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#frontend)
- [`docs/accessibility.md`](../docs/accessibility.md)
- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`.cursor/rules/nx-react.mdc`](../.cursor/rules/nx-react.mdc)
