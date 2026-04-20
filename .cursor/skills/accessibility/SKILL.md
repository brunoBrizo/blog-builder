---
name: accessibility
description: Audit and improve web accessibility following WCAG 2.2. Use when the user mentions accessibility, a11y, WCAG, screen readers, keyboard navigation, focus issues, contrast, labels, or making UI usable for assistive technology.
license: MIT
metadata:
  author: web-quality-skills
  version: "1.1"
---

# Accessibility

Use this skill to audit or fix web accessibility issues. Aim for WCAG 2.2 AA unless the user asks for a different target.

## Use It For

- Accessibility audits and remediation
- Keyboard, focus, screen reader, label, or contrast issues
- Forms, dialogs, menus, tabs, drag interactions, and dynamic updates
- Reviewing UI changes for WCAG impact before shipping

## Core Rules

- Prefer native HTML over ARIA-heavy custom widgets.
- Start with semantics, names, focus, and keyboard access before polishing edge cases.
- Do not rely on color, motion, hover, or pointer precision alone.
- Treat broken focus flow, missing labels, missing names, and low contrast as high-priority defects.
- Target AA by default. Use AAA only when the user explicitly wants the stricter bar.

## Audit Order

1. Check semantics first: headings, landmarks, buttons, links, form controls, page language.
2. Check keyboard behavior: Tab flow, activation keys, no traps, visible focus, focus not obscured.
3. Check accessible names: alt text, icon buttons, labels, link text, `aria-label` only when needed.
4. Check form UX: instructions, errors, `aria-invalid`, error announcements, redundant-entry and auth requirements.
5. Check visual access: text contrast, non-text contrast, zoom/reflow, target size, reduced motion.
6. Check dynamic UI: dialogs, tabs, live regions, notifications, drag alternatives.
7. Validate with a mix of automated and manual testing before calling the work done.

## Fix Priorities

### Fix Immediately

- Missing form labels or accessible names
- Missing alt text on meaningful images
- Keyboard traps or unreachable controls
- Missing or invisible focus states
- Contrast failures that block reading or control use

### Fix Before Shipping

- Missing skip link or landmark navigation on complex pages
- Broken error identification or status announcements
- Drag-only interactions without a click or keyboard path
- Authentication or multi-step forms that create avoidable cognitive load

## Reference Map

- Read [`references/A11Y-PATTERNS.md`](references/A11Y-PATTERNS.md) when you need implementation examples for dialogs, skip links, error handling, labels, drag alternatives, tabs, or live regions.
- Read [`references/WCAG.md`](references/WCAG.md) when you need criterion lookup, level details, what changed in 2.2, or testing-tool reminders.

## Validation

Use both kinds of checks:

- Automated: Lighthouse, axe, or equivalent repo tooling
- Manual: keyboard-only pass, screen reader spot check, 200% zoom, reduced motion, and target-size sanity check

Do not claim accessibility is fixed if only automated checks pass.

## Output Expectations

When auditing or reviewing, report:

- issue
- affected users
- WCAG principle or criterion if relevant
- recommended fix
- severity or shipping risk
