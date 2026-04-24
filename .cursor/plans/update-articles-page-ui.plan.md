---
project_type: Next.js Web App
description: Pixel-perfect UI update for the Articles/Tutorials page based on the provided HTML design.
---

# Overview
The goal is to update the UI of the `blog-builder` web application to perfectly match the design specifications provided in `docs/designs/articles-page.html`. This involves modifying the global layout, site header, footer, blog list page, and all related sub-components to achieve a pixel-perfect result.

## Codebase Context
- **Framework**: Next.js (App Router with `next-intl` for i18n).
- **Styling**: Tailwind CSS.
- **Component Locations**: 
  - Application Pages: `apps/web/src/app/[locale]/`
  - Specific App Components: `apps/web/src/components/`
  - Global CSS: `apps/web/src/app/global.css`

## Success Criteria
- The `/blog` (or `/tutorials`) page is visually indistinguishable from `docs/designs/articles-page.html`.
- Responsive behaviors (mobile/desktop) match the HTML.
- Hover states, micro-animations, and transitions are fully implemented.

## Tech Stack
- Next.js (React)
- Tailwind CSS
- Typescript

## File Structure
- `apps/web/src/app/[locale]/blog/page.tsx`
- `apps/web/src/components/*`

---

# Task Breakdown

### Task 1: Global Styles and Typography
- **task_id**: global-styles
- **name**: Update global CSS and fonts
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: High
- **dependencies**: None
- **INPUT**: `docs/designs/articles-page.html`
- **OUTPUT**: Updated `apps/web/src/app/[locale]/fonts.ts` (or equivalent) and `apps/web/src/app/global.css`
- **VERIFY**: Ensure `.bg-grid-pattern`, `.mask-radial-fade`, and `.no-scrollbar` are defined and correct fonts load.

### Task 2: Site Header Updates
- **task_id**: site-header
- **name**: Refactor site header
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: High
- **dependencies**: global-styles
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/components/site-header.tsx`
- **OUTPUT**: Updated `site-header.tsx` matching the dark, blurred header design.
- **VERIFY**: Check desktop nav items, search input, language switcher, and mobile menu button styles.

### Task 3: Blog Page Header & Layout Structure
- **task_id**: blog-layout
- **name**: Update main blog page layout
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: High
- **dependencies**: global-styles
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/app/[locale]/blog/page.tsx`
- **OUTPUT**: Updated `page.tsx` with max-w-6xl structure, "Explore the Archive" badge, and 8/4 column grid.
- **VERIFY**: Check page header text and column alignment on lg screens.

### Task 4: Ad Placeholders
- **task_id**: ad-placeholders
- **name**: Update ad placeholders
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: Medium
- **dependencies**: blog-layout
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/components/ad-placeholder.tsx`
- **OUTPUT**: Updated `ad-placeholder.tsx` for leaderboard and sidebar variants.
- **VERIFY**: Verify dashed borders, backdrop-blur, and text styles match exactly.

### Task 5: Article Cards & Feed
- **task_id**: article-cards
- **name**: Refactor article cards and feed
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: High
- **dependencies**: blog-layout
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/components/article-card.tsx`
- **OUTPUT**: Updated `article-card.tsx` (cornerstone/standard variants) and feed separators in `page.tsx`.
- **VERIFY**: Ensure image hover zoom, text colors, margins, and gradients match.

### Task 6: Pagination Component
- **task_id**: pagination
- **name**: Update pagination
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: Medium
- **dependencies**: blog-layout
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/components/pagination.tsx`
- **OUTPUT**: Updated `pagination.tsx` matching the new design.
- **VERIFY**: Verify top border, button states, and active page styling.

### Task 7: Sidebar Components
- **task_id**: sidebar-components
- **name**: Update sidebar components
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: High
- **dependencies**: blog-layout
- **INPUT**: `docs/designs/articles-page.html`, `author-box.tsx`, `newsletter-card.tsx`, `sidebar-categories.tsx`
- **OUTPUT**: Updated sidebar components matching dark theme, blur effects, and counter badges.
- **VERIFY**: Check author avatar blur, newsletter purple orb, and category hover states.

### Task 8: Site Footer Updates
- **task_id**: site-footer
- **name**: Refactor site footer
- **agent**: `frontend-specialist`
- **skills**: `frontend-design`
- **priority**: Medium
- **dependencies**: global-styles
- **INPUT**: `docs/designs/articles-page.html`, `apps/web/src/components/site-footer.tsx`
- **OUTPUT**: Updated `site-footer.tsx` matching the dark footer design.
- **VERIFY**: Verify background color, borders, and navigation links.

---

# Risks and open questions
- **Icons**: The HTML uses `iconify-icon`, but the React app currently uses `lucide-react`. We will exclusively use `lucide-react` and find the closest visual matches for the icons used in the HTML design. No `iconify-icon` scripts will be injected.

# Final verification section
Once all tasks are implemented, a comprehensive visual review should be conducted:
1. Verify typography: Check that `Inter` and `Plus Jakarta Sans` are correctly applied globally.
2. Verify layout constraints: Ensure `max-w-6xl` is respected and responsive breakpoints match the HTML.
3. Compare hover effects: Mouse over all cards, links, and buttons to ensure transitions match the reference perfectly.
4. Lint and build: Run the standard linting and build checks to ensure no regressions were introduced.