# 07. Article Reading Experience

## Goal

Build the public article page: the canonical reading surface of the blog. It must load fast on mobile, be accessible, rank well in Google, and be quotable by AI answer engines.

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md).
- [04. Web Foundation](./04-web-foundation.md).
- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md) (content must exist to render).

## Scope

In scope:

- Route: `/[locale]/blog/[slug]` rendered as a React Server Component with ISR.
- API endpoint to fetch a published article by locale + slug.
- Full article template: title, TL;DR, key takeaways, body (Markdown → HTML), FAQ, citations, author bio, category, tags, published/updated timestamps, reading time.
- Full SEO + GEO markup for a single article.
- Related articles strip.

Out of scope:

- Homepage/category/tag indexes (feature 08).
- Search (feature 09).
- AdSense unit placement (feature 16).

## Backend work

- `GET /articles/:locale/:slug` — returns the full public shape for one published article, including translations' canonical slug for hreflang, citations, author, category, tags, FAQ, and neighboring articles for the "related" strip. Response schema in `libs/shared-types`, validated with Zod.
- `GET /articles?locale=...&limit=...&cursor=...` — cursor-paginated list of published articles for the homepage/category pages (used by feature 08, scaffolded here).
- Queries live in a `ArticlesRepository` in `apps/api`, use the Drizzle relational API, and select only public columns.
- Caching: responses carry `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`; `apps/web` caches by tag `article:<id>` so the revalidation hook in feature 06 can invalidate precisely.
- Increment a view counter (daily-bucketed, not per request) for analytics — append-only write, no PII.

## Frontend work

- Create `/[locale]/blog/[slug]/page.tsx` as an RSC that fetches via `apps/api`, sets `generateStaticParams` for the top N published slugs per locale, and configures `revalidate`.
- Render order of the page follows the GEO contract in [`docs/seo-geo.md`](../docs/seo-geo.md#generative-engine-optimization-geo):
  1. H1 title.
  2. TL;DR block (2–3 sentences) directly under H1.
  3. Key takeaways list (≤ 5 bullets).
  4. Table of contents (auto-built from H2s, anchor-linked).
  5. Body, with H2s that answer a concrete question in the first paragraph.
  6. FAQ section rendered from the article's FAQ data.
  7. Citations list rendered from `article_citations`.
  8. Author card with photo, name, bio, and `sameAs` links.
  9. "Related articles" strip (3–6 items from the same category).
- Typography optimized for long-form reading: comfortable line length (max ~72ch on desktop), generous line-height, dark-mode contrast meeting WCAG AA on body text.
- Images rendered via `next/image` with explicit width/height and `alt`. Hero image is the only LCP candidate and is `priority`.
- `generateMetadata`:
  - Canonical = `<origin>/<locale>/blog/<slug>`.
  - hreflang alternates for every locale the translation exists in, plus `x-default` pointing to the English version.
  - OG + Twitter tags (title, description, image, type=`article`).
  - `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag`.
- JSON-LD injected per article:
  - `Article` (headline, image, datePublished, dateModified, author, publisher, articleSection, inLanguage).
  - `BreadcrumbList` (Home → Category → Article).
  - `FAQPage` when FAQ data is present.
- Inline citations in the body link to the corresponding entry in the citations list and open in a new tab with `rel="noopener noreferrer"`.
- Reading time computed from word count server-side and rendered near the byline.
- A "Last reviewed on" date surfaces when the refresh job in feature 14 updates the article.
- Accessibility: semantic landmarks (`<article>`, `<main>`, `<nav aria-label="Table of contents">`, `<footer>` for author), skip-to-content target is the article `<main>`, visible focus on all links.
- Prefetch links to adjacent articles via `next/link` `prefetch` only on hover/viewport to keep the cold-load budget tight.

## Acceptance criteria

- A published article renders at all three locale URLs with correct `lang`, hreflang alternates, and canonical.
- JSON-LD validates against Google Rich Results test for Article, BreadcrumbList, and FAQPage.
- Lighthouse mobile on a real article: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- `axe-core` reports zero violations on the article template.
- LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on 4G mobile (WebPageTest or real-user Vitals in feature 18).
- Revalidation triggered by feature 06 updates the page within 5 seconds.

## Related docs

- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`docs/accessibility.md`](../docs/accessibility.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#frontend)
