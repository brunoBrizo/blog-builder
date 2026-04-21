# Home Page Generation

## Overview
- **Project type**: Next.js App Router (frontend in `apps/web`), Tailwind CSS v4.
- **Codebase context**: Follows `nx-architecture.mdc`, `tech-stack.md`, and strict formatting. No shadcn/ui. AI-generated premium feel.
- **Success Criteria**:
  - Beautiful, dynamic "Stitch" level premium UI (subtle micro-animations, glassmorphism, modern typography).
  - Mobile-first, fully responsive design.
  - Includes: Hero section, Featured Articles, Categories, Newsletter CTA.
  - Fully accessible (WCAG 2.2 AA).

## Success criteria
- Adheres to `docs/accessibility.md` and `docs/seo-geo.md`.
- Mobile CWV: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Provides a premium, dark-mode focused aesthetic out of the box.

## Tech stack
- Next.js 16.2.4
- Tailwind CSS v4
- React 19.2

## File structure
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/global.css`
- `libs/ui/src/theme.css`
- `libs/ui/src/lib/hero.tsx`
- `libs/ui/src/lib/article-card.tsx`
- `libs/ui/src/lib/newsletter-cta.tsx`

## Task breakdown
1. Initialize core theme colors and properties in `libs/ui/src/theme.css`.
2. Build Hero component (`libs/ui/src/lib/hero.tsx`) with clear value proposition.
3. Build ArticleCard component (`libs/ui/src/lib/article-card.tsx`).
4. Build NewsletterCTA component (`libs/ui/src/lib/newsletter-cta.tsx`) honoring GDPR / CAN-SPAM.
5. Assemble all parts into `apps/web/src/app/page.tsx` with mock data for articles.
6. Refine animations (framer-motion or CSS based) and check responsiveness.

## Risks and open questions
- Framer-motion vs pure CSS for animations. (I propose we start with CSS or framer-motion if installed).
- Data source: For v1 rendering, we'll use mock data arrays mapped over ArticleCard, setting the stage for Supabase later.

## Final verification section
- Verify with `nx build web`, ESLint, and a Lighthouse accessibility sweep.
