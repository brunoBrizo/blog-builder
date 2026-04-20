# 09. In-site Search

## Goal

Ship a fast, locale-aware search that lets visitors find published articles by title, body, tag, or category. Built entirely on Postgres full-text search — no third-party search service.

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md) (scaffolds the `tsvector` column).
- [07. Article Reading Experience](./07-article-reading-experience.md).
- [08. Homepage & Blog Navigation](./08-homepage-and-blog-navigation.md).

## Scope

In scope:

- Postgres FTS: `tsvector` column on `article_translations`, GIN index, trigger or generated column to keep it fresh, `pg_trgm` index for fuzzy title matching.
- Search API endpoint with ranking, highlighting, and locale filtering.
- Search page + header search UI in `apps/web`.
- Search result SEO treatment (noindex).

Out of scope:

- Semantic / vector search — explicitly out of scope to stay free.
- Search analytics (feature 16).

## Backend work

- SQL migration: add a generated `tsvector` column on `article_translations` combining title (weight A), TL;DR (A), key takeaways (B), and body (C), configured for the language matching the translation's locale (`english`, `portuguese`, `spanish`).
- Add a GIN index on that column and a `pg_trgm` `gin_trgm_ops` index on the title column for typo tolerance.
- `GET /search?q=...&locale=...&limit=...&cursor=...`:
  - Sanitizes the query, builds a `plainto_tsquery` in the correct language.
  - Ranks with `ts_rank_cd` weighted by `{0.1, 0.4, 0.6, 1.0}`.
  - Falls back to `pg_trgm` similarity on the title when `ts_rank_cd` returns no hits.
  - Returns `{ slug, title, tldr, category, coverUrl, highlight }` where `highlight` is `ts_headline` output with safe HTML tags sanitized downstream.
  - Only matches `published` translations in the requested locale.
- Rate-limited (`@nestjs/throttler`): 20 req/min/IP.
- Repository method lives in `ArticlesRepository` with an explicit return type; query uses Drizzle's `sql` helper for FTS.

## Frontend work

- Header search icon opens a search dialog (Radix Dialog, focus-trapped, `Esc` to close, keyboard navigable). On mobile, dialog takes full viewport; on desktop, centered modal.
- Instant results after 250 ms debounce with a minimum query length of 2 characters; each result is a keyboard-focusable link to the article.
- Up/down arrow key navigation between results; Enter opens.
- Dedicated route `/[locale]/search?q=...` renders the same results server-side (for deep links, sharing, and crawl-ability of nothing — this page is `noindex`).
- Empty state ("No results — try broader keywords"), loading state (Skeleton rows), and error state (with retry).
- The dialog and page both announce result counts via `aria-live="polite"`.
- Highlighted matches render with a `<mark>` element and WCAG-AA contrast.
- `/search` page metadata: `robots: noindex, follow`, canonical = self (no query string), no hreflang across locales (search results are not canonical content).

## Acceptance criteria

- Searching an indexed title returns it within 200 ms on a warm DB connection.
- A single typo in a short title (e.g. "Nextjs" vs "Next.js") still surfaces the right result via `pg_trgm` fallback.
- Cross-locale bleed is prevented: a query on `/pt-br/search` returns only pt-br translations.
- Dialog is fully operable via keyboard and meets axe-core zero-violation bar.
- `/search` pages are tagged `noindex`.

## Related docs

- [`docs/tech-stack.md`](../docs/tech-stack.md#data-layer)
- [`docs/seo-geo.md`](../docs/seo-geo.md#technical-seo)
- [`docs/accessibility.md`](../docs/accessibility.md)
