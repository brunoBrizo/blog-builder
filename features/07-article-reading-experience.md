# 07. Article Reading Experience

## Goal

Finish wiring the public article page so it reads from the real database instead of mock data, while preserving the existing UI design, component library, and theming already built in `apps/web`.

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md).
- [04. Web Foundation](./04-web-foundation.md).
- [05. Perplexity Article Pipeline](./05-perplexity-article-pipeline.md) (content must exist to render).
- [06. Scheduled Article Generation](./06-scheduled-article-generation.md) (ISR revalidation hook).

## What is already built

### Frontend components and pages (apps/web)

- **Route**: `/[locale]/articles/[slug]` exists at `apps/web/src/app/[locale]/articles/[slug]/page.tsx`. It renders via `ArticleDetailView` (`apps/web/src/components/article-detail-view.tsx`).
- **Legacy redirect**: `/[locale]/blog/[slug]` redirects to `/[locale]/articles/[slug]` (`apps/web/src/app/[locale]/blog/[slug]/page.tsx`).
- **Article detail UI** (`ArticleDetailView`) already assembles:
  - `ArticleBreadcrumbs` — Home → Category → Article.
  - `ArticleHero` — H1 title, category pill, subhead, author avatar, published date, reading time, share buttons.
  - `ArticleFeaturedImage` — hero image with caption.
  - `ArticleBody` — rich block renderer (lead, paragraphs, H2/H3 with anchor IDs, lists, blockquotes, stats, code blocks, in-content ad placeholders).
  - `ArticleTopics` — tag pills at bottom.
  - `AuthorBox` (variant `articleEeat`) — author photo, name, role, bio, social links.
  - `RelatedArticleNavigation` — previous/next article cards.
  - `TableOfContents` (sidebar, sticky) — scroll-spy nav built from H2s.
  - `NewsletterCard` + `AdPlaceholder` (sidebar).
- **Accessibility primitives already present**: `SkipToContent`, semantic `<article>` / `<main>` / `<aside>`, focus-visible rings on links, `aria-label` on breadcrumbs, `nav aria-label="Table of contents"`.
- **Theme system**: dark/light toggle (`ThemeToggle`) with cookie persistence; Tailwind v4 tokens in `libs/ui`.
- **Layout**: `apps/web/src/app/[locale]/layout.tsx` provides `NextIntlClientProvider`, `SiteHeader`, `SiteFooter`, `RootJsonLd`, analytics/consent placeholders, and `SkipToContent` targeting `<main id="main">`.
- **SEO helpers in `libs/seo`**: `buildMetadata`, `buildOpenGraph`, `buildTwitter`, `canonicalUrl`, `buildHreflangMap`, `buildWebSiteJsonLd`, `buildOrganizationJsonLd`.
- **Shared types in `libs/shared-types`**: `PublicArticleSchema`, `PublicArticleSummarySchema`, `PublicArticleCitationSchema` mirror the DB shape.

### Backend / data layer

- **Database schema**: `articles`, `article_translations`, `article_citations`, `authors`, `categories`, `tags` are all defined in `libs/db/src/schema/` with Drizzle relations.
- **Generation pipeline** (feature 05/06) already persists `bodyHtml`, `faq`, `keyTakeaways`, `tldr`, `metaTitle`, `metaDescription`, `readingTimeMinutes`, and citations into the DB.
- **No public article API endpoint yet** — the page currently imports `getArticleBySlug` from `apps/web/src/mocks/articles.ts`.

## Scope

In scope:

1. **API endpoint** `GET /articles/:locale/:slug` in `apps/api` that returns `PublicArticleSchema` for published articles only.
2. **API endpoint** `GET /articles?locale=...&limit=...&cursor=...` cursor-paginated list of published articles (scaffolded for feature 08).
3. **ArticlesRepository** in `apps/api` with Drizzle relational queries selecting only public columns.
4. **Web page wiring** — replace mock import in `apps/web/src/app/[locale]/articles/[slug]/page.tsx` with a real API fetch; implement `generateMetadata` with hreflang, OG, article tags; emit per-article JSON-LD.
5. **ISR caching** — API responses carry `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`; web caches by tag `article:<id>` so feature 06 revalidation invalidates precisely.
6. **FAQ section** — new component (`ArticleFaq`) rendered from the article's FAQ data above the citations list.
7. **Citations section** — new component (`ArticleCitations`) rendered from `article_citations` with inline anchor links.
8. **JSON-LD per article** — `Article`, `BreadcrumbList`, and `FAQPage` schemas injected via `<script type="application/ld+json">`.

Out of scope:

- Homepage / category / tag list pages (feature 08).
- Search (feature 09).
- AdSense unit placement (feature 16).
- View-counter analytics (deferred; append-only write, no PII).

## Detailed work

### Backend

#### `GET /articles/:locale/:slug`

- Controller + service in `apps/api` (e.g., `ArticlesController` / `ArticlesService`).
- Query joins `articles` → `article_translations` (by locale + slug, `status = 'published'`) → `authors` → `categories` → `article_citations` → `tags`.
- Returns `PublicArticleSchema` (validated via Zod, shared in `libs/shared-types`).
- Include `translations` slugs for hreflang alternates (`[{ locale, slug }]`).
- Include neighboring articles for `RelatedArticleNavigation` (previous/next by `published_at` in the same category).
- `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.

#### `GET /articles?locale=...&limit=...&cursor=...`

- Cursor-paginated list using `published_at` + `id` as the cursor.
- Returns `PublicArticleSummarySchema[]`.
- Scaffolded here; consumed by feature 08.

#### Drizzle relational queries

- Use Drizzle relational API (`.with()`) or explicit joins.
- Select only public columns; never expose `sourcePrompt`, `tokenCostTotal`, `deletedAt`, etc.
- ` ArticlesRepository` lives under `apps/api/src/articles/articles.repository.ts`.

### Frontend

#### Page wiring (`apps/web/src/app/[locale]/articles/[slug]/page.tsx`)

- Replace `import { getArticleBySlug } from '@/mocks/articles'` with an API fetch.
- Fetch function can live in `apps/web/src/lib/api-client/articles.ts`.
- `generateMetadata`:
  - `title` = `article.metaTitle || article.title`
  - `description` = `article.metaDescription || article.tldr`
  - `canonical` = `<origin>/<locale>/articles/<slug>`
  - `alternates.languages` = hreflang map from `article.translations`
  - `openGraph.type = 'article'`
  - `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag`
- `generateStaticParams` — statically generate top N published slugs per locale at build time.
- `'use cache'` or ISR `revalidate` configured so the page is stale-while-revalidating.

#### JSON-LD per article

Use `libs/seo` builders (create new ones if needed):

- `Article` JSON-LD: headline, image, datePublished, dateModified, author (Person), publisher (Organization), articleSection, inLanguage, speakable block.
- `BreadcrumbList`: Home → Category → Article.
- `FAQPage`: only when `article.faq.length > 0`.
  Render via inline `<script type="application/ld+json">` in the RSC.

#### FAQ component (`ArticleFaq`)

- New file `apps/web/src/components/article-faq.tsx`.
- Accepts `faq: { question: string; answer: string }[]`.
- Render as collapsible sections or a plain Q&A list; add `id` anchors for deep-linking.
- Placed between `ArticleBody` and `ArticleCitations` in `ArticleDetailView`.

#### Citations component (`ArticleCitations`)

- New file `apps/web/src/components/article-citations.tsx`.
- Accepts `citations: PublicArticleCitation[]`.
- Numbered list with title, publisher, snippet, URL (opens new tab, `rel="noopener noreferrer"`).
- Inline citation links in `ArticleBody` should target the corresponding entry here. Since `bodyHtml` comes from the pipeline, either:
  - The pipeline already embeds `<a href="#cite-N">` anchors, or
  - Post-process `bodyHtml` server-side to inject citation links based on `article_citations` order.

#### Adapt `ArticleDetailView`

- Swap the mock `Article` type for `PublicArticle` from `libs/shared-types`.
- Map DB fields to existing component props:
  - `title` → `title`
  - `subtitle` / `tldr` → `subhead`
  - `bodyHtml` → rendered inside `ArticleBody` (may need a new block type or pass HTML directly)
  - `keyTakeaways` → new "Key takeaways" block near top (optional — can be rendered as a `<ul>` block before body)
  - `faq` → `ArticleFaq`
  - `citations` → `ArticleCitations`
  - `author` → `AuthorBox`
  - `category` → breadcrumb + category pill
  - `tags` → `ArticleTopics`
  - `readingTimeMinutes` / `publishedAt` → hero byline
  - `coverImageUrl` → `ArticleFeaturedImage`
- Preserve existing Tailwind classes, layout grid (`lg:col-span-8` / `lg:col-span-4`), and ad placeholders.

### Acceptance criteria

- A published article renders at `/[locale]/articles/[slug]` with correct `lang`, hreflang alternates, and canonical.
- JSON-LD validates in Google's Rich Results test for `Article`, `BreadcrumbList`, and `FAQPage`.
- Lighthouse mobile on a real article: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- `axe-core` reports zero critical/serious violations on the article template.
- LCP ≤ 2.5 s, CLS ≤ 0.1 on 4G mobile.
- Revalidation triggered by feature 06 updates the page within 5 seconds.
- `GET /articles/:locale/:slug` returns 404 for unpublished or missing articles.
- `GET /articles?locale=...` returns only published articles, newest first.

## Related docs

- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`docs/accessibility.md`](../docs/accessibility.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#frontend)
