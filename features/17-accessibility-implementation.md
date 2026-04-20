# 17. Accessibility Implementation

## Goal

Make the entire public site conform to WCAG 2.2 AA as specified in [`docs/accessibility.md`](../docs/accessibility.md), using only free and open-source tooling, and bake the checks into CI so regressions cannot merge.

## Dependencies

- [04. Web Foundation](./04-web-foundation.md).
- Features 07, 08, 09, 11, 12, 13, 16 (all user-facing surfaces must exist to audit).

## Scope

In scope:

- Workspace-level a11y tooling setup (ESLint, axe, Playwright a11y, Lighthouse CI).
- Hardening passes on every public route and component.
- Manual screen-reader and keyboard audit protocols.
- CI gate on axe + Lighthouse a11y score.

Out of scope:

- Admin routes are exempt from the public a11y bar but keep basic keyboard operability.
- Localization copy review — out of scope here.

## Backend work

- None. Accessibility is a frontend and testing concern.

## Frontend work

- Tooling:
  - `eslint-plugin-jsx-a11y` in the `apps/web` and `libs/ui` ESLint configs with the recommended ruleset; override any exceptions per-file with justification comments.
  - `@axe-core/react` hooked into development builds only (warn in console).
  - `@axe-core/playwright` runs on every Playwright end-to-end test with a zero-violation bar on critical/serious.
  - `@lhci/cli` (Lighthouse CI) as a GitHub Action step (wiring in feature 19) with `assertions: { "categories:accessibility": ["error", { "minScore": 0.95 }] }`.
- Hardening pass (per surface):
  - Landmarks: every page exposes exactly one `<header>`, one `<main>`, one `<footer>`, and correctly-labeled `<nav>` regions.
  - Skip-to-content link wired to `<main>` and visible on focus.
  - Headings follow a single logical outline per page (H1 once, H2 for sections, no level skips).
  - Every interactive element has an accessible name (visible text, `aria-label`, or `aria-labelledby`).
  - Focus order follows visual order; no custom `tabindex > 0`.
  - Focus ring is always visible, contrast ≥ 3:1 against background, disabled in neither light nor dark theme.
  - Color contrast: body text ≥ 4.5:1, large text ≥ 3:1, non-text UI ≥ 3:1. Verified with Stark (free in dev) and axe.
  - Target size (WCAG 2.2): every interactive element 44×44 CSS px minimum, with generous spacing.
  - Forms: labels associated via `for`/`id`; errors announced via `aria-describedby` + `aria-invalid`; no placeholder-as-label.
  - Images: meaningful `alt`; decorative images `alt=""`; figures use `<figcaption>`.
  - Links distinguish from body text by more than color (underline on hover/focus + weight).
  - Motion: honor `prefers-reduced-motion: reduce` by disabling non-essential animations.
  - Dialogs (search, confirm, cookie preferences): Radix `Dialog` with `aria-labelledby`, focus trap, `Esc` to close, scroll lock, restore focus on close.
  - Tables (if any in articles): `<caption>`, `<thead>`, `<th scope>`.
  - Live regions: search results and toast notifications use `aria-live="polite"`.
  - Keyboard shortcuts (if added): all can be disabled or remapped.
  - Language attributes: `<html lang>` correct per route; inline language switches use `lang="..."`.
- Manual audit protocol (run once per release candidate):
  - VoiceOver on macOS Safari: homepage, article, search, newsletter subscribe, contact, legal.
  - NVDA on Windows Firefox (free) on the same surfaces.
  - Keyboard-only traversal: every interactive element reachable and operable with keyboard alone.
  - Zoom to 400 % at 1280 px width: no content loss, no horizontal scroll beyond the natural text flow.
  - Dark mode contrast spot check.
- Fix-and-retest loop: every axe violation opens a ticket in the admin dashboard is noted in `features/` backlog notes. No release ships with open critical/serious violations on public pages.

## Acceptance criteria

- `pnpm nx run web:e2e` runs Playwright with axe and reports zero critical/serious violations on homepage, article, search dialog, category page, contact, legal pages, and newsletter flow.
- Lighthouse a11y score ≥ 95 on each of those surfaces.
- Manual keyboard traversal confirms no traps, all actions operable, focus indicator always visible.
- NVDA + VoiceOver smoke tests pass the checklist in [`docs/accessibility.md`](../docs/accessibility.md).

## Related docs

- [`docs/accessibility.md`](../docs/accessibility.md)
