# Plan: Feature 07 — Article Reading Experience

**Plan file:** `.kilo/plans/1777144781905-playful-mountain.md`  
**Feature spec:** `features/07-article-reading-experience.md`  
**Created:** 2026-04-25  
**Planner:** project-planner (repo-discovery + plan-writing)

---

## Overview

Wire the public article page (`/[locale]/articles/[slug]`) to read from the real database instead of mock data. Deliver a public `ArticlesController` in `apps/api`, a web API client, adapted UI components, per-article JSON-LD, FAQ and citations sections, ISR caching, and full SEO metadata — while preserving the existing Tailwind design system and accessibility primitives.

## Project type

Nx monorepo — NestJS API (`apps/api`) + Next.js 15 App Router frontend (`apps/web`), with shared libraries (`libs/db`, `libs/seo`, `libs/shared-types`, `libs/ui`).

## Codebase context

### What exists

- **Database & repository:** `libs/db` has Drizzle schema for `articles`, `article_translations`, `article_citations`, `authors`, `categories`, `tags`. `apps/api/src/articles/articles.repository.ts` already implements `findPublishedBySlug`, `findNeighborIds`, `findSummariesByIds`, `listPublishedSummaries`, `listTopSlugsByLocale`.
- **Shared types:** `libs/shared-types/src/schemas/articles.ts` defines `PublicArticleSchema`, `PublicArticleSummarySchema`, `PublicArticleCitationSchema`, `PublicAuthorSchema`, `PublicCategorySchema`, `PublicTagSchema`.
- **Web page + components:** `/[locale]/articles/[slug]/page.tsx` renders `ArticleDetailView` with child components (`ArticleHero`, `ArticleBody`, `AuthorBox`, `RelatedArticleNavigation`, `ArticleTopics`, `TableOfContents`, etc.). All currently import mock types from `apps/web/src/mocks/articles.ts` and `apps/web/src/mocks/authors.ts`.
- **SEO lib:** `libs/seo` exports `buildMetadata`, `buildOpenGraph`, `buildTwitter`, `canonicalUrl`, `buildHreflangMap`, plus JSON-LD builders for `Organization` and `WebSite`.
- **API client:** `apps/web/src/lib/api-client/api-fetch.ts` provides `apiFetch<T>` with error parsing.
- **ISR revalidation:** `apps/api/src/app/revalidate.controller.ts` exposes `POST /api/revalidate`. `apps/web/src/app/api/revalidate/route.ts` handles `revalidatePath` + `revalidateTag`. `WebIsrRevalidationService.revalidateAfterPublish` calls the web revalidation endpoint after publish.
- **Middleware:** `apps/web/src/middleware.ts` strips locale prefix into `x-pathname` header for canonical URL construction in RSCs.

### What is missing

- No public `ArticlesController` / `ArticlesService` in `apps/api`.
- No web API client for articles (`apps/web/src/lib/api-client/articles.ts`).
- `ArticleDetailView` and child components still bound to mock types (`Author`, `Article`, `ArticleBodyBlock[]`).
- `ArticleBody` only accepts a block array; the DB stores `bodyHtml` string.
- No `ArticleFaq` or `ArticleCitations` components.
- No per-article JSON-LD builders (`Article`, `BreadcrumbList`, `FAQPage`).
- `generateMetadata` on the article page is minimal (only title + description).
- No `generateStaticParams`.
- `WebIsrRevalidationService` revalidates `/blog/${slug}` but not `/articles/${slug}`.

## Success criteria

All acceptance criteria from the feature spec must pass:

1. A published article renders at `/[locale]/articles/[slug]` with correct `lang`, hreflang alternates, and canonical.
2. JSON-LD validates in Google's Rich Results test for `Article`, `BreadcrumbList`, and `FAQPage`.
3. Lighthouse mobile on a real article: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
4. `axe-core` reports zero critical/serious violations on the article template.
5. LCP ≤ 2.5 s, CLS ≤ 0.1 on 4G mobile.
6. Revalidation triggered by feature 06 updates the page within 5 seconds.
7. `GET /articles/:locale/:slug` returns 404 for unpublished or missing articles.
8. `GET /articles?locale=...` returns only published articles, newest first.

## Tech stack

- **Backend:** NestJS, Drizzle ORM, Zod (validation), Postgres
- **Frontend:** Next.js 15 App Router (RSC), React 19, TypeScript, Tailwind CSS v4, next-intl, next/image
- **Shared:** `libs/shared-types` (Zod schemas), `libs/seo` (metadata + JSON-LD builders)
- **Caching:** Next.js ISR (`revalidate`), `Cache-Control` headers on API

## File structure

### New files

```
apps/api/src/articles/
  articles.controller.ts
  articles.service.ts
  articles.module.ts

apps/web/src/lib/api-client/
  articles.ts

apps/web/src/components/
  article-faq.tsx
  article-citations.tsx
  article-html-body.tsx        # or ArticleBody html prop

libs/seo/src/lib/json-ld/
  article.ts
  breadcrumb-list.ts
  faq-page.ts
```

### Modified files

```
apps/api/src/app/app.module.ts
apps/api/src/generation/web-isr-revalidation.service.ts

libs/shared-types/src/schemas/articles.ts
libs/seo/src/index.ts

apps/web/src/components/article-detail-view.tsx
apps/web/src/components/article-body.tsx
apps/web/src/components/article-hero.tsx
apps/web/src/components/author-box.tsx
apps/web/src/components/article-topics.tsx
apps/web/src/components/related-article-navigation.tsx

apps/web/src/app/[locale]/articles/[slug]/page.tsx
apps/web/src/app/[locale]/blog/[slug]/page.tsx   # legacy redirect — verify still works
```

## Task breakdown

### Task 1 — Extend shared types for public article detail

**task_id:** `07-types`  
**agent:** backend-specialist  
**priority:** P0  
**dependencies:** none  
**skills:** typescript-advanced-types

**INPUT:** `libs/shared-types/src/schemas/articles.ts` with existing `PublicArticleSchema`.

**OUTPUT:**

- Add `PublicArticleNeighborSchema`:
  ```ts
  z.object({ slug: SlugSchema, title: z.string() });
  ```
- Add `PublicArticleDetailSchema` extending `PublicArticleSchema`:
  ```ts
  PublicArticleSchema.extend({
    translations: z.array(z.object({ locale: LocaleSchema, slug: SlugSchema })),
    neighbors: z.object({
      previous: PublicArticleNeighborSchema.nullable(),
      next: PublicArticleNeighborSchema.nullable(),
    }),
  });
  ```
- Add `PublicArticleListResponseSchema`:
  ```ts
  z.object({
    items: z.array(PublicArticleSummarySchema),
    nextCursor: z
      .object({ publishedAt: TimestampSchema, id: UuidSchema })
      .nullable(),
  });
  ```
- Re-export from `libs/shared-types/src/index.ts` if needed (already wildcard export).

**VERIFY:**

- `npx tsc -p libs/shared-types/tsconfig.lib.json --noEmit` passes.
- `nx run shared-types:lint` passes.

---

### Task 2 — Update ISR revalidation to cover `/articles/` paths

**task_id:** `07-revalidate-paths`  
**agent:** backend-specialist  
**priority:** P0  
**dependencies:** none  
**skills:** none

**INPUT:** `apps/api/src/generation/web-isr-revalidation.service.ts`.

**OUTPUT:**

- In `revalidateAfterPublish`, after adding `/blog/${r.slug}`, also add `/${r.locale}/articles/${r.slug}` to the `paths` set.
- Verify `revalidatePathAllowed` in `libs/shared-types/src/schemas/revalidate.ts` already matches `/articles/*` via the `/(?:en|pt-BR|es)/(?:blog|draft|articles)(?:\/|$)/` regex (prefix match). Confirm by testing: `/en/articles/foo` returns `true`.

**VERIFY:**

- Unit test or inline log verification that `revalidatePathAllowed('/en/articles/test-slug') === true`.
- No TypeScript errors in `apps/api`.

---

### Task 3 — Build API Articles module (Controller + Service)

**task_id:** `07-api-module`  
**agent:** backend-specialist  
**priority:** P0  
**dependencies:** `07-types`, `07-revalidate-paths`  
**skills:** nestjs-best-practices, testing-patterns

**INPUT:** Existing `ArticlesRepository` at `apps/api/src/articles/articles.repository.ts`.

**OUTPUT:**

1. **`ArticlesService`** (`apps/api/src/articles/articles.service.ts`):
   - `findPublishedBySlug(locale, slug)`:
     - Call `repo.findPublishedBySlug(locale, slug)`.
     - Call `repo.findNeighborIds(row.articleId, row.categoryId, row.publishedAt)`.
     - Call `repo.findSummariesByIds([neighborIds.previousId, neighborIds.nextId].filter(Boolean), locale)` to hydrate neighbor titles.
     - Map raw row fields to `PublicArticleDetailSchema` shape (validate with Zod).
     - Return `PublicArticleDetail`.
   - `listPublishedSummaries(locale, limit, cursor?)`:
     - Call `repo.listPublishedSummaries(locale, limit, cursor)`.
     - Map rows to `PublicArticleSummarySchema[]`.
     - Return `{ items, nextCursor }`.

2. **`ArticlesController`** (`apps/api/src/articles/articles.controller.ts`):
   - `@Controller('articles')`
   - `@Get(':locale/:slug')` → `articlesService.findPublishedBySlug(locale, slug)`
     - `@Header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')`
     - Return 404 via `NotFoundException` for missing/unpublished.
   - `@Get()` → `articlesService.listPublishedSummaries(locale, limit, cursor?)`
     - Query params: `locale` (required), `limit` (default 20, max 100), `cursor` (optional JSON string `{ publishedAt, id }`).
     - Parse `cursor` safely with Zod.
     - `@Header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')`

3. **`ArticlesModule`** (`apps/api/src/articles/articles.module.ts`):
   - Register `ArticlesController`, `ArticlesService`, `ArticlesRepository`.
   - Import `DrizzleModule` (if needed) or rely on existing provider.

4. **Wire into `AppModule`:**
   - Add `ArticlesModule` to `apps/api/src/app/app.module.ts` imports.

**VERIFY:**

- `nx run api:lint` passes.
- `nx run api:test` passes (add controller + service unit tests; mock `ArticlesRepository`).
- Start API locally: `GET /api/articles/en/complete-guide-to-rag` returns 404 when no data, or valid `PublicArticleDetail` when a published article exists.
- `GET /api/articles?locale=en&limit=10` returns only published articles ordered by `publishedAt` desc.
- Response headers include `cache-control: public, s-maxage=60, stale-while-revalidate=300`.

---

### Task 4 — Build JSON-LD helpers in `libs/seo`

**task_id:** `07-seo-jsonld`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-types`  
**skills:** none

**INPUT:** Existing JSON-LD builders in `libs/seo/src/lib/json-ld/`.

**OUTPUT:**

1. **`libs/seo/src/lib/json-ld/article.ts`**:

   ```ts
   export type ArticleJsonLdInput = {
     headline: string;
     image: string[];
     datePublished: string;
     dateModified?: string;
     author: { name: string; url?: string };
     publisher: { name: string; logo?: string };
     articleSection?: string;
     inLanguage: string;
     description?: string;
     url: string;
   };
   export function buildArticleJsonLd(input: ArticleJsonLdInput): object { ... }
   ```

   Returns schema.org `Article` JSON-LD with `speakable` block (`cssSelector: ['.article-headline', '.article-body']`).

2. **`libs/seo/src/lib/json-ld/breadcrumb-list.ts`**:

   ```ts
   export type BreadcrumbListJsonLdInput = {
     items: { name: string; item: string }[];
   };
   export function buildBreadcrumbListJsonLd(input: BreadcrumbListJsonLdInput): object { ... }
   ```

   Returns schema.org `BreadcrumbList`.

3. **`libs/seo/src/lib/json-ld/faq-page.ts`**:

   ```ts
   export type FaqPageJsonLdInput = {
     questions: { name: string; acceptedAnswer: { text: string } }[];
   };
   export function buildFaqPageJsonLd(input: FaqPageJsonLdInput): object { ... }
   ```

   Returns schema.org `FAQPage`.

4. **Export all three** from `libs/seo/src/index.ts`.

**VERIFY:**

- `nx run seo:lint` passes.
- Add unit tests for each builder in `libs/seo/src/lib/json-ld/*.spec.ts`.
- `nx run seo:test` passes.
- Validate output with Google's Rich Results Test schema (manual spot-check).

---

### Task 5 — Build web API client for articles

**task_id:** `07-web-client`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-types`, `07-api-module`  
**skills:** none

**INPUT:** Existing `apiFetch` in `apps/web/src/lib/api-client/api-fetch.ts`.

**OUTPUT:**

1. **`apps/web/src/lib/api-client/articles.ts`**:

   ```ts
   import { apiFetch } from './api-fetch';
   import { PublicArticleDetailSchema, PublicArticleListResponseSchema } from '@blog-builder/shared-types';
   import type { PublicArticleDetail, PublicArticleListResponse } from '@blog-builder/shared-types';

   export async function getArticleBySlug(
     locale: string,
     slug: string,
   ): Promise<PublicArticleDetail | null> {
     try {
       const data = await apiFetch<unknown>({
         path: `articles/${encodeURIComponent(locale)}/${encodeURIComponent(slug)}`,
       });
       return PublicArticleDetailSchema.parse(data);
     } catch (err) {
       if (err instanceof ApiError && err.status === 404) return null;
       throw err;
     }
   }

   export async function listArticleSummaries(
     locale: string,
     limit: number,
     cursor?: { publishedAt: string; id: string },
   ): Promise<PublicArticleListResponse> { ... }
   ```

2. **Static params helper** (same file or separate):
   ```ts
   export async function listTopSlugs(locale: string, limit: number): Promise<{ slug: string }[]> { ... }
   ```

**VERIFY:**

- `nx run web:lint` passes.
- TypeScript compiles `apps/web` with no errors.
- Manual test: call `getArticleBySlug('en', 'test')` against running API returns expected shape or `null` on 404.

---

### Task 6 — Build new article components (FAQ, Citations, HTML body)

**task_id:** `07-new-components`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-types`  
**skills:** accessibility

**INPUT:** Feature spec requirements for FAQ, Citations, and `bodyHtml` rendering.

**OUTPUT:**

1. **`ArticleFaq`** (`apps/web/src/components/article-faq.tsx`):
   - Props: `{ faq: { question: string; answer: string }[] }`
   - Render as plain Q&A list with `id` anchors (`faq-1`, `faq-2`, …) for deep-linking.
   - Use semantic HTML (`dl` / `dt` / `dd` or `details`/`summary`).
   - Wrap in `section` with `aria-labelledby`.
   - Style with existing Tailwind tokens (no new design system). Match article body spacing.

2. **`ArticleCitations`** (`apps/web/src/components/article-citations.tsx`):
   - Props: `{ citations: PublicArticleCitation[] }`
   - Render numbered list (`ol`) with `id="cite-N"` on each `li`.
   - Each item: title (linked, `rel="noopener noreferrer"`, `target="_blank"`), publisher, snippet.
   - If `title` is null, show domain from URL as fallback.

3. **Adapt `ArticleBody`** (`apps/web/src/components/article-body.tsx`):
   - Change props to:
     ```ts
     type ArticleBodyProps = {
       blocks?: ArticleBodyBlock[];
       html?: string;
       className?: string;
     };
     ```
   - If `html` is provided, render:
     ```tsx
     <div
       className={cn(
         'prose prose-zinc max-w-none text-base text-zinc-600 font-light leading-relaxed space-y-6',
         className,
       )}
       dangerouslySetInnerHTML={{ __html: html }}
     />
     ```
   - Keep existing block rendering as fallback when `blocks` is provided.
   - This preserves backward compatibility with any remaining mock usage.

4. **Server-side TOC extraction utility** (`apps/web/src/lib/article-toc.ts`):

   ```ts
   export function extractTocFromHtml(
     html: string,
   ): { id: string; title: string }[] {
     const matches = [
       ...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi),
     ];
     return matches.map(([, id, rawTitle]) => ({
       id,
       title: rawTitle.replace(/<[^>]*>/g, ''),
     }));
   }
   ```

   - No extra dependency needed; regex is sufficient for controlled `bodyHtml` output.

5. **Citation link injection utility** (`apps/web/src/lib/article-citations.ts`):
   ```ts
   export function injectCitationLinks(
     html: string,
     citationCount: number,
   ): string {
     return html.replace(/\[\s*(\d+)\s*\]/g, (match, num) => {
       const n = parseInt(num, 10);
       if (n >= 1 && n <= citationCount) {
         return `<a href="#cite-${n}" class="text-indigo-600 hover:underline">${match}</a>`;
       }
       return match;
     });
   }
   ```

   - Applied server-side in the page component before passing `bodyHtml` to `ArticleBody`.

**VERIFY:**

- `nx run web:lint` passes.
- Components render correctly in Storybook or local dev if available.
- `axe-core` run on `ArticleFaq` and `ArticleCitations` templates reports zero critical/serious violations.

---

### Task 7 — Adapt existing components to public types

**task_id:** `07-adapt-components`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-types`, `07-new-components`  
**skills:** accessibility

**INPUT:** Existing components bound to mock types.

**OUTPUT:**
Update type imports and prop usage. Do NOT change visual styling or layout.

1. **`ArticleHero`**:
   - Replace `import type { Author } from '../mocks/authors'` with `import type { PublicAuthor } from '@blog-builder/shared-types'`.
   - Use `author.fullName` instead of `author.name`.
   - Use `author.photoUrl` instead of `author.avatarUrl`.

2. **`AuthorBox`**:
   - Replace mock `Author` with `PublicAuthor`.
   - Use `author.fullName`, `author.photoUrl`.
   - For `role` (articleEeat variant): use `author.expertise[0] ?? ''`.
   - For social links: iterate `author.sameAs` URLs. Detect Twitter/X by hostname (`twitter.com`, `x.com`), GitHub by `github.com`, fallback to generic globe icon. Render each as a link with `aria-label`.

3. **`ArticleTopics`**:
   - Replace `ArticleTopicTag` with `PublicTag`.
   - Map `tag.name` to label. No `href` yet (feature 08). Render as static spans.

4. **`RelatedArticleNavigation`**:
   - Remove mock import; define local inline type `{ previous: { slug: string; title: string } | null; next: { slug: string; title: string } | null }`.
   - Component logic stays identical.

5. **`ArticleDetailView`**:
   - Replace `import type { Article } from '../mocks/articles'` with `import type { PublicArticleDetail } from '@blog-builder/shared-types'`.
   - Change props to:
     ```ts
     type ArticleDetailViewProps = {
       article: PublicArticleDetail;
       toc: { id: string; title: string }[];
     };
     ```
   - Map fields:
     - `title` → `title`
     - `subtitle ?? tldr` → `subhead`
     - `coverImageUrl` → `featuredImageUrl` (fallback placeholder if null)
     - `category?.name` → category pill label
     - `category` → breadcrumb parent label (`category.name`) and href (`/articles` for now)
     - `readingTimeMinutes` → `readTimeMin`
     - `publishedAt` → formatted date string (e.g., `new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`)
     - `author` → `AuthorBox` + `ArticleHero`
     - `tags` → `ArticleTopics`
     - `bodyHtml` → `ArticleBody` (via `html` prop) after citation injection
     - `faq` → `ArticleFaq` (render only if `faq.length > 0`)
     - `citations` → `ArticleCitations` (render only if `citations.length > 0`)
     - `neighbors` → `RelatedArticleNavigation`
     - `keyTakeaways` → render as a `<ul>` block before `ArticleBody` if non-empty
   - Preserve layout grid (`lg:col-span-8` / `lg:col-span-4`) and ad placeholders.

**VERIFY:**

- `nx run web:lint` passes.
- `nx run web:build` passes (catches type errors).
- Visual regression: compare article page screenshot with mock version; layout must be pixel-equivalent (except new FAQ/citations sections).

---

### Task 8 — Wire article page (RSC)

**task_id:** `07-page-wire`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-web-client`, `07-adapt-components`, `07-seo-jsonld`  
**skills:** vercel-react-best-practices

**INPUT:** `apps/web/src/app/[locale]/articles/[slug]/page.tsx`.

**OUTPUT:**

1. **Replace mock import** with `getArticleBySlug` from `apps/web/src/lib/api-client/articles.ts`.

2. **`generateMetadata`**:

   ```ts
   export async function generateMetadata({
     params,
   }: Props): Promise<Metadata> {
     const { locale, slug } = await params;
     const article = await getArticleBySlug(locale, slug);
     if (!article) return { title: 'Not found' };

     const title = article.metaTitle || article.title;
     const description = article.metaDescription || article.tldr;
     const pathname = `/articles/${slug}`;
     const ogLocale =
       locale === 'pt-br' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US';

     const base = buildMetadata({
       locale: locale as SeoLocale,
       pathname,
       title,
       description,
       siteName: 'Blog Builder',
       ogLocale,
       openGraphType: 'article',
     });

     return {
       ...base,
       openGraph: {
         ...base.openGraph,
         type: 'article',
         publishedTime: article.publishedAt ?? undefined,
         modifiedTime: article.publishedAt ?? undefined,
         authors: [article.author.fullName],
         section: article.category?.name ?? undefined,
         tags: article.tags.map((t) => t.name),
       },
     };
   }
   ```

3. **`generateStaticParams`**:

   ```ts
   export async function generateStaticParams() {
     const locales = ['en', 'pt-br', 'es'];
     const limit = 50; // top N per locale
     const params: { locale: string; slug: string }[] = [];
     for (const locale of locales) {
       const slugs = await listTopSlugs(locale, limit);
       for (const { slug } of slugs) {
         params.push({ locale, slug });
       }
     }
     return params;
   }
   ```

4. **Page component**:

   ```ts
   export const revalidate = 60;

   export default async function ArticleBySlugPage({ params }: Props) {
     const { locale, slug } = await params;
     const article = await getArticleBySlug(locale, slug);
     if (!article) notFound();

     const toc = extractTocFromHtml(article.bodyHtml);
     const bodyHtml = injectCitationLinks(article.bodyHtml, article.citations.length);

     const jsonLdArticle = buildArticleJsonLd({ ... });
     const jsonLdBreadcrumb = buildBreadcrumbListJsonLd({ ... });
     const jsonLdFaq = article.faq.length > 0 ? buildFaqPageJsonLd({ ... }) : null;

     return (
       <>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
         {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}
         <ArticleDetailView article={article} toc={toc} />
       </>
     );
   }
   ```

5. **Legacy redirect page** (`apps/web/src/app/[locale]/blog/[slug]/page.tsx`):
   - Verify it still redirects to `/[locale]/articles/[slug]` using `redirect()` from `next/navigation`.
   - No mock dependency changes needed if it uses `redirect` only.

**VERIFY:**

- `nx run web:build` passes in production mode.
- Page renders without runtime errors for a published article slug.
- `notFound()` triggers for non-existent slugs (404 page).
- `<meta property="og:type" content="article">` present.
- `<link rel="canonical">` and hreflang alternates present.
- JSON-LD scripts present in `<head>` (view page source).
- `generateStaticParams` produces expected param array at build time.

---

### Task 9 — Accessibility, performance, and SEO verification

**task_id:** `07-a11y-perf`  
**agent:** frontend-specialist  
**priority:** P0  
**dependencies:** `07-page-wire`  
**skills:** accessibility

**INPUT:** Fully wired article page.

**OUTPUT:**

1. **Accessibility audit:**
   - Run `axe-core` (via browser devtools or `@axe-core/react` test harness) on the article template.
   - Ensure zero critical/serious violations.
   - Check: focus-visible rings on interactive elements, `aria-label` on breadcrumbs, `nav aria-label="Table of contents"`, `SkipToContent` target `<main id="main">`.

2. **Lighthouse audit (mobile):**
   - Run Lighthouse on a real article page in production build (`nx run web:build:production` then `npx serve dist/apps/web`).
   - Targets: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
   - Ensure LCP ≤ 2.5 s, CLS ≤ 0.1.
   - If Performance < 90, optimize: verify `next/image` is used for `ArticleFeaturedImage` and `ArticleHero` avatar; ensure hero image has `priority` prop; check font loading.

3. **Rich Results Test:**
   - Copy page source JSON-LD blocks into Google's Rich Results Test.
   - Validate `Article`, `BreadcrumbList`, and `FAQPage` schemas.

**VERIFY:**

- Document Lighthouse scores in a verification log.
- Document axe-core results (zero critical/serious).
- Document Rich Results Test pass/fail per schema.

---

### Task 10 — End-to-end revalidation test

**task_id:** `07-revalidate-e2e`  
**agent:** backend-specialist + frontend-specialist  
**priority:** P0  
**dependencies:** `07-api-module`, `07-page-wire`, `07-revalidate-paths`  
**skills:** testing-patterns

**INPUT:** ISR revalidation pipeline (feature 06 triggers + web page).

**OUTPUT:**

1. Trigger `WebIsrRevalidationService.revalidateAfterPublish` for an article (or manually call `POST /api/revalidate` with the article paths).
2. Verify that:
   - `/${locale}/articles/${slug}` is included in the revalidated paths.
   - The web page updates within 5 seconds of revalidation trigger.
   - If using tag-based invalidation: verify `revalidateTag('article:<id>')` is called (if implemented).

**VERIFY:**

- Log timestamp before trigger, then request page until content changes (or 304/200 with updated content).
- Confirm elapsed time < 5 seconds.

---

### Task 11 — Final lint, typecheck, and test run

**task_id:** `07-final-check`  
**agent:** backend-specialist + frontend-specialist  
**priority:** P0  
**dependencies:** all above tasks  
**skills:** lint-and-validate

**INPUT:** All code changes across `apps/api`, `apps/web`, `libs/shared-types`, `libs/seo`.

**OUTPUT:**

- Run the full validation matrix:
  ```bash
  nx run-many -t lint,typecheck,test -p api,web,shared-types,seo,db
  ```
  (Note: `web` may not have a `test` target; run `lint` and `build` instead.)
- Fix any failures.

**VERIFY:**

- Zero failures across all projects.
- `nx run api:build` succeeds.
- `nx run web:build:production` succeeds.

---

## Risks and open questions

| Risk                                                                                                                    | Impact | Mitigation                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bodyHtml` from pipeline may not contain `id` attributes on `<h2>` tags, breaking TOC extraction.                       | High   | Plan includes server-side TOC extraction via regex `<h2[^>]*id="..."`. If pipeline omits IDs, update pipeline (feature 05) or add a server-side ID injection step before rendering.                                                           |
| `bodyHtml` may not contain inline citation anchors (`#cite-N`), breaking citation deep-links.                           | Medium | Plan includes `injectCitationLinks` utility as fallback. Verify pipeline output first; if already present, skip injection.                                                                                                                    |
| `PublicAuthor` shape differs from mock `Author` (`fullName` vs `name`, `photoUrl` vs `avatarUrl`, no `role`/`socials`). | Medium | Task 7 explicitly updates all consuming components. Risk is missing a prop reference; caught by TypeScript build.                                                                                                                             |
| Author social links: `sameAs` is `string[]` without platform labels.                                                    | Low    | Detect platform by URL hostname in `AuthorBox`. Fallback to generic external-link icon. Acceptable until dedicated social schema is added.                                                                                                    |
| Next.js `fetch` cache tags with dynamic IDs (`article:<id>`) are hard to set before the fetch.                          | Medium | Primary invalidation is `revalidatePath`. If tag-based invalidation is required, use `unstable_cache` with a slug-derived tag (`article-slug:${locale}:${slug}`) and update `WebIsrRevalidationService` to invalidate both path and slug-tag. |
| Category page URLs don't exist yet (feature 08). Breadcrumb parent href is ambiguous.                                   | Low    | Link breadcrumb parent to `/articles` (generic list) until category pages ship.                                                                                                                                                               |
| `generateStaticParams` fetches from API at build time; if API is unavailable, build fails.                              | Medium | Wrap `listTopSlugs` call in `try/catch` and return empty array on failure, allowing build to proceed with dynamic generation.                                                                                                                 |
| Lighthouse Performance < 90 if hero image is not optimized.                                                             | Medium | Verify `next/image` with `priority` is used for hero. Verify no layout shift from late-loaded fonts or images.                                                                                                                                |

## Final verification

Before marking the feature complete, run this checklist:

- [ ] **API endpoints**
  - [ ] `GET /api/articles/en/test-slug` returns `PublicArticleDetail` for published article.
  - [ ] `GET /api/articles/en/test-slug` returns 404 for draft / missing.
  - [ ] `GET /api/articles?locale=en&limit=10` returns newest published summaries only.
  - [ ] Response headers include `cache-control: public, s-maxage=60, stale-while-revalidate=300`.

- [ ] **Web page**
  - [ ] `/en/articles/test-slug` renders without runtime errors.
  - [ ] Mock import `getArticleBySlug` from `@/mocks/articles` is **removed** from the page.
  - [ ] `generateStaticParams` outputs slugs at build time.
  - [ ] `notFound()` triggers for missing slugs.

- [ ] **SEO**
  - [ ] `<title>` uses `metaTitle || title`.
  - [ ] `<meta name="description">` uses `metaDescription || tldr`.
  - [ ] Canonical URL is `<origin>/<locale>/articles/<slug>`.
  - [ ] Hreflang alternates present for all translations.
  - [ ] `og:type` = `article`.
  - [ ] `article:published_time`, `article:author`, `article:section`, `article:tag` present in OpenGraph metadata.
  - [ ] JSON-LD `Article`, `BreadcrumbList`, and `FAQPage` (when applicable) scripts present in page source.

- [ ] **UI / Components**
  - [ ] `ArticleFaq` renders Q&A with anchor IDs.
  - [ ] `ArticleCitations` renders numbered list with external links.
  - [ ] `ArticleBody` renders `bodyHtml` with correct prose styling.
  - [ ] `TableOfContents` extracts H2s from `bodyHtml` and scroll-spies correctly.
  - [ ] `AuthorBox` uses real author photo, name, expertise, and `sameAs` links.
  - [ ] `RelatedArticleNavigation` shows previous/next articles from API.

- [ ] **Accessibility & Performance**
  - [ ] `axe-core`: zero critical/serious violations.
  - [ ] Lighthouse mobile: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
  - [ ] LCP ≤ 2.5 s, CLS ≤ 0.1.

- [ ] **Caching & Revalidation**
  - [ ] ISR revalidation includes `/${locale}/articles/${slug}` paths.
  - [ ] Page content updates within 5 seconds of revalidation trigger.

- [ ] **Build & CI**
  - [ ] `nx run-many -t lint -p api,web,shared-types,seo` passes.
  - [ ] `nx run api:test` passes.
  - [ ] `nx run web:build:production` passes.
  - [ ] `nx run api:build` passes.
