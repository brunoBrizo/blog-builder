# Accessibility (WCAG 2.2 AA)

Source of truth for accessibility compliance across the public blog (`apps/web`) and the admin dashboard. [`docs/tech-stack.md`](tech-stack.md) is the vendor/tool registry and defers to this file for all accessibility policy and testing cadence.

## Target and success criteria

- **WCAG 2.2 Level AA** on both `apps/web` (public blog) and the admin dashboard.
- **axe-core clean**: zero critical or serious violations on every page template.
- **Lighthouse Accessibility ≥ 95** on the homepage and any article; enforced as a PR gate in Lighthouse CI.
- **Keyboard-only navigation** works end-to-end on every page (including the admin dashboard and generation job review UI).
- **Screen-reader smoke test** passes on NVDA (Windows) and VoiceOver (macOS/iOS) before each production deploy.
- **200% zoom** renders without horizontal scroll or clipped content on mobile and desktop viewports.
- **Reduced motion**: all non-essential animation respects `prefers-reduced-motion`.

## Tooling committed

All free / open-source; net new accessibility cost = **$0/month**.

- **`eslint-plugin-jsx-a11y`** — lint-time checks for missing `alt`, invalid ARIA, missing labels, etc. Runs in pre-commit (via Husky + lint-staged) and in CI.
- **`@axe-core/playwright`** — automated accessibility scans inside every Playwright end-to-end test. Fails the test on any critical or serious violation.
- **`axe-core` via Lighthouse CI** — PR gate on accessibility score ≥ 95 per URL under test.
- **Radix UI primitives** — accessible foundations for Dialog, DropdownMenu, Tabs, Popover, Tooltip, Accordion, Select, Toast (focus management, keyboard nav, and ARIA roles baked in). The `libs/ui` layer styles these primitives rather than rebuilding a11y from scratch.
- **NVDA** (Windows) and **VoiceOver** (macOS/iOS) — manual screen-reader verification, built into the OS.
- **Browser devtools** (Chrome/Firefox a11y inspector, forced-colors emulation, reduced-motion toggle) — ad-hoc debugging.

## Baseline practices

- **Semantic HTML first** — `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`; one `<h1>` per page with a clean H2/H3 hierarchy.
- **Focus visible** — retain or enhance the default focus ring; never set `outline: none` without an equivalent replacement that meets 3:1 contrast.
- **Skip-to-content link** rendered as the first focusable element on every page.
- **`lang` attribute per locale** — set on `<html>` via `next-intl` routing (`en`, `pt-br`, `es`).
- **Form accessibility** — every input has a programmatic `<label>`; errors surface via `aria-describedby` and role=`alert`; required fields marked with `aria-required` and visual indication.
- **Image alt text enforced** — lint rule + admin publish gate block articles where any `<img>` lacks descriptive alt; decorative images use `alt=""`.
- **Color contrast** — design tokens in `libs/ui` are audited to meet 4.5:1 (normal text) / 3:1 (large text and UI components).
- **Reduced motion** — every Framer Motion animation is gated by `useReducedMotion()`; CSS animations use `@media (prefers-reduced-motion: reduce)`.
- **Reading flow in RTL-safe order** — even though we don't ship RTL locales yet, avoid `float`-based layouts and rely on logical CSS properties.

## New WCAG 2.2 criteria explicitly addressed

WCAG 2.2 introduced nine new success criteria. The ones that most affect this project:

- **2.4.11 Focus Not Obscured (Minimum) — AA**: sticky headers, cookie banners, and toasts never fully obscure the focused element. Enforced by manual keyboard walkthrough and visual review.
- **2.4.12 Focus Not Obscured (Enhanced) — AAA**: aspirational; aim for it on the public blog where layouts are simpler.
- **2.4.13 Focus Appearance — AAA**: design tokens already target a thick, high-contrast focus ring; tracked as aspirational.
- **2.5.7 Dragging Movements — AA**: the admin dashboard's sortable lists (for article ordering, related-article curation) ship a keyboard/button alternative to drag-and-drop.
- **2.5.8 Target Size (Minimum) — AA**: all interactive targets are at least 24×24 CSS px; enforced via a `libs/ui` button/link minimum-size rule.
- **3.2.6 Consistent Help — A**: contact link appears in the same location (footer) across all pages.
- **3.3.7 Redundant Entry — A**: multi-step forms (newsletter confirmation, admin publish flow) pre-fill or auto-carry previously entered data.
- **3.3.8 Accessible Authentication (Minimum) — AA**: the admin login flow uses Supabase Auth's magic link / OAuth options; no cognitive-function test (e.g., puzzle CAPTCHA) is required to authenticate.

## Testing layers

1. **Lint (pre-commit + CI)** — `eslint-plugin-jsx-a11y` blocks obvious regressions before code lands.
2. **Automated axe scan in Playwright e2e** — `@axe-core/playwright` runs on every critical page template (home, article, category, author, about, contact, admin dashboard, admin publish form). Zero critical/serious violations required to merge.
3. **Lighthouse CI gate in PRs** — accessibility score ≥ 95 enforced per URL.
4. **Manual screen-reader smoke test pre-deploy** — NVDA + VoiceOver on homepage, one article, and the admin publish flow.
5. **Manual keyboard-only walkthrough** — every new page template tested without a mouse.
6. **Quarterly full audit** — walk the entire WCAG 2.2 AA checklist manually once per quarter and on any major navigation or layout change.

## Working checklist

The day-to-day audit checklist lives alongside the workspace rules at [`.cursor/skills/accessibility/SKILL.md`](../.cursor/skills/accessibility/SKILL.md). This doc sets the standard; the skill file is the step-by-step reviewer aid.

## Related docs

- [`docs/tech-stack.md`](tech-stack.md) — vendor and tool registry; this file is the authority for accessibility choices.
- [`docs/seo-geo.md`](seo-geo.md) — SEO and GEO policy (semantic HTML and alt text support both a11y and SEO).
- [`docs/product_idea.md`](product_idea.md) — original product requirements.
