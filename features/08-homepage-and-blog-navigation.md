# 08. Homepage & Blog Navigation

## Goal

Build the browsing surfaces that get visitors from the front door to an article: homepage, category pages, tag pages, and the blog index. All localized, all fast, all SEO-complete.

## Dependencies

- [04. Web Foundation](./04-web-foundation.md).
- [07. Article Reading Experience](./07-article-reading-experience.md) (consumes the list endpoint defined there).

## Scope

In scope:

- Routes: `/[locale]` (homepage), `/[locale]/blog` (all articles), `/[locale]/category/[categorySlug]`, `/[locale]/tag/[tagSlug]`, `/[locale]/author/[authorSlug]`.
- List endpoints + category/tag lookups in `apps/api`.
- Pagination (cursor-based) and filtering.
- Index-page SEO: ItemList JSON-LD, Breadcrumbs, canonical + hreflang, proper `rel=prev/next` avoided in favor of canonical per page.

Out of scope:

- Global search (feature 09).
- Article reading page (feature 07).
- Admin CRUD for categories/tags (feature 15).

## Backend work

- `GET /categories?locale=...` and `GET /tags?locale=...` — localized lists with article counts, cached.
- `GET /categories/:locale/:slug` and `GET /tags/:locale/:slug` — resolve the aggregate root by translation slug.
- `GET /authors/:slug` — author profile + paginated articles.
- Extend the list endpoint from feature 07 (`GET /articles`) to accept `categoryId`, `tagId`, `authorId` filters and a cursor.
- Repositories return only public columns; counts are computed via indexed `COUNT(*)` over the published+locale filter.
- Cache headers identical to feature 07 list endpoint; revalidation hook from feature 06 invalidates homepage and any affected category/tag tag keys.

## Frontend work

- Homepage `/[locale]`:
  - Hero section with the latest featured article (editor-pickable in feature 15; until then, the most recent published).
  - "Latest articles" grid (cursor-paginated, 12 per page).
  - "Browse by category" strip linking to category pages.
  - Newsletter signup block (component from feature 04; wired in feature 12).
- `/[locale]/blog` — paginated index of all published articles, newest first, with cursor-based "Load more" behavior that degrades gracefully to `?cursor=` URLs for SEO crawlability.
- `/[locale]/category/[categorySlug]` and `/[locale]/tag/[tagSlug]`:
  - Page title = category/tag name + localized "articles" suffix.
  - One-paragraph localized description (authored in feature 15, optional).
  - Paginated article grid.
- `/[locale]/author/[authorSlug]`:
  - Author card (photo, bio, `sameAs` links).
  - Paginated articles by this author.
- All index pages render: breadcrumbs, canonical URL for the current page (including cursor), hreflang alternates, `ItemList` JSON-LD listing visible articles in DOM order.
- Cards in grids: cover image (`next/image`, lazy), category pill, title, TL;DR excerpt, reading time, published date. Entire card is a single `<a>` wrapping a semantic `<article>`.
- Grid uses CSS grid with responsive columns (1 / 2 / 3 at mobile / tablet / desktop).
- Empty states (no articles yet in category) render a localized message and a CTA back to the homepage.

## Acceptance criteria

- All four route families render in all three locales with correct lang/hreflang/canonical.
- Pagination is crawlable: the Google bot (simulated via Lighthouse crawler) can follow cursor links to reach all published articles.
- `ItemList` JSON-LD validates on Rich Results test.
- Lighthouse mobile on homepage: Performance ≥ 90, SEO = 100.
- No horizontal scroll on 360 px viewport; all interactive elements have 44×44 CSS-pixel tap targets (WCAG 2.2 target size).

## Related docs

- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`docs/accessibility.md`](../docs/accessibility.md#new-wcag-22-criteria-we-explicitly-address)
