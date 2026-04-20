# SEO and Generative Engine Optimization (GEO)

Source of truth for how this blog ranks in traditional search engines (Google, Bing, DuckDuckGo) and in AI answer engines (ChatGPT Search, Perplexity, Claude, Google AI Overviews, Copilot). [`docs/tech-stack.md`](tech-stack.md) is the vendor/tool registry and defers to this file for all SEO and GEO policy.

## Success criteria

- Three locales served as subdirectories (`/en`, `/pt-br`, `/es`) with correct `hreflang` and `x-default`.
- JSON-LD rendered per applicable page: Article (+ `speakable`), FAQPage, HowTo, BreadcrumbList, WebSite + SearchAction, Organization, Person.
- Sitemap and robots auto-generated; Google Search Console and GA4 wired from day one.
- Lighthouse (mobile) SEO = 100 on homepage and any article.
- Site is indexable and citable by ChatGPT Search, Perplexity, Claude, and Google AI Overviews; every article ships a TL;DR / key-takeaways block and FAQ schema to maximize passage-level extractability.
- Content refresh cron re-runs research/outline/writer/humanizer for top performers monthly.

## Tooling committed

- **Google Search Console** — sitemap submission, indexing monitoring, Core Web Vitals report.
- **Google Analytics 4** — lazy-loaded, consent-gated.
- **Google AdSense** — lazy-loaded, consent-gated.
- **Google-certified CMP** (Funding Choices or equivalent) — GDPR/UK/EEA consent gating.
- **Vercel Analytics / Speed Insights** — optional, cookieless CWV telemetry.
- **Native Next.js SEO primitives** — `app/sitemap.ts`, `app/robots.ts`, `generateMetadata`, in-page JSON-LD helpers from `libs/seo`.
- **`libs/seo`** — typed JSON-LD builders (Article + speakable, FAQPage, HowTo, BreadcrumbList, WebSite + SearchAction, Organization, Person) and hreflang/sitemap helpers.
- **`libs/prompts`** — Perplexity prompts in Calls 4 (Writer) and 6 (SEO Metadata) enforce GEO-friendly content structure (see below).

## SEO requirement mapping

| Requirement (from [`docs/product_idea.md`](product_idea.md))          | Implementation in this stack                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| HTTPS                                                                 | Vercel + Fly.io (TLS enforced by platform)                                                                    |
| Mobile-first, LCP < 2.5s                                              | Next.js RSC + ISR, `next/image`, `next/font`, lazy-loaded Ads/GA                                              |
| XML Sitemap                                                           | `app/sitemap.ts` (Next.js native), submitted to GSC                                                           |
| Robots.txt                                                            | `app/robots.ts` (Next.js native)                                                                              |
| Core Web Vitals (LCP/INP/CLS)                                         | RSC-by-default, Lighthouse CI gate in PRs, Vercel Speed Insights                                              |
| Schema markup (Article, FAQ, HowTo, Breadcrumb, WebSite+SearchAction) | `libs/seo` JSON-LD builders, rendered via `generateMetadata` and inline scripts                               |
| Clean URL structure                                                   | App Router slug-based routing (`/[locale]/[category]/[slug]`)                                                 |
| Internal linking / topic clusters                                     | `article_translations` has `related_slugs[]`; rendered by a shared `RelatedArticles` component from `libs/ui` |
| Google Search Console                                                 | Verified via DNS TXT; sitemap submitted post-deploy                                                           |
| GA4                                                                   | Loaded via consent-gated, lazy `<Script strategy="lazyOnload">`                                               |
| One H1, H2/H3 hierarchy                                               | Enforced by the writer-step prompt + markdown rendering in `libs/ui/Prose`                                    |
| Meta description < 155 chars                                          | Generated in Call 6 (SEO Metadata) and validated by Zod                                                       |
| Alt text on images                                                    | Generated alongside images; validated in the admin publish gate                                               |
| 1,500–2,500 words                                                     | Enforced by writer-step prompt; validated before publish                                                      |
| Long-tail, low-difficulty keywords                                    | Call 1 (Topic Research) and Call 2 (Competitor Analysis) output the target phrases                            |
| hreflang + subdirectories                                             | `next-intl` locale routing + `generateMetadata` emits `alternates.languages` with `x-default`                 |
| Content refresh                                                       | Monthly `pg_cron` job re-runs Calls 2/4/5/6 on top-N articles ranked by GA4 snapshot                          |
| Generative Engine Optimization                                        | See `Generative Engine Optimization (GEO)` section below                                                      |

## Generative Engine Optimization (GEO)

GEO is the practice of making content discoverable, extractable, and citable by AI answer engines. It is a probabilistic channel — attribution is not guaranteed — but the surfaces that make a site citable by LLMs (structured data, passage-level clarity, machine-readable maps) also reinforce traditional SEO.

### AI crawler policy (`app/robots.ts`)

Default: allow search/citation bots, block training-only bots.

**Allow** (these bots can drive referral traffic and cite sources):

- `OAI-SearchBot` — ChatGPT Search.
- `PerplexityBot` — Perplexity.
- `ClaudeBot` — Claude web search.
- `Google-Extended` — Google AI Overviews and Gemini.
- `Bingbot` — Microsoft Copilot (also standard Bing).
- `DuckAssistBot` — DuckDuckGo AI.

**Block** (these bots ingest content for model training without attribution):

- `GPTBot` — OpenAI training crawler.
- `CCBot` — Common Crawl.
- `anthropic-ai` — Anthropic training crawler.
- `Bytespider` — ByteDance.
- `Applebot-Extended` — Apple training-only crawler.
- `Amazonbot` — Amazon training.
- `Meta-ExternalAgent` — Meta training.
- `FacebookBot` — Meta training.

Review cadence: every 3 months. New bots appear quarterly and some ignore `robots.txt`, so the allow/block list is treated as a living document, not a one-time config.

### Content requirements (enforced via Perplexity prompts in `libs/prompts`)

Every generated article must include:

- Opening 2–3 sentence **TL;DR** (passage-level citability).
- **H2 sections framed as questions or direct answers** (extractable for AI Overviews). Direct-answer paragraphs kept to 40–80 words so LLMs can quote them cleanly.
- **Bulleted key takeaways** near the top.
- **Inline source attribution** with publisher name and date (for example, "according to Stanford's 2025 AI Index"). LLM retrievers weight content with named, dated citations.
- **FAQ block** at the bottom with 5–8 question/answer pairs, mirrored into `FAQPage` JSON-LD.
- **Author byline** with link to an author page that carries `Person` + `sameAs` schema (E-E-A-T signal used by both Google and LLM retrievers).

These requirements are encoded into the Call 4 (Writer) and Call 6 (SEO Metadata) prompts and validated by Zod before the article is persisted.

### Structured-data surfaces (`libs/seo` builders)

- `Article` with a `speakable` block for AI-assistant quotability.
- `FAQPage` (sourced from the article's FAQ block).
- `HowTo` (where applicable; detected from article type in Call 3 Outline).
- `BreadcrumbList` on every article and category page.
- `WebSite` + `SearchAction` on the homepage.
- `Organization` on the homepage and legal pages.
- `Person` on every author page, with `sameAs` pointing to public profiles (LinkedIn, X, personal site) to strengthen E-E-A-T.

### Discoverability files

- `app/sitemap.ts` — one sitemap per locale plus an index sitemap.
- **`llms.txt`** — short machine-readable project map (summary, key URLs, tone guidance). Served from `apps/web/app/llms.txt/route.ts`.
- **`llms-full.txt`** — longer, passage-friendly export of the most important articles, regenerated on publish. Served from `apps/web/app/llms-full.txt/route.ts`.
- **RSS and Atom feeds per locale** — `feed.xml` and `atom.xml` under each locale; LLM retrievers and aggregators consume them.

`llms.txt` is a community convention (surfaced by Perplexity, Anthropic, and others), not a standard. We commit to it opportunistically; cost of maintaining it is negligible and fully isolated from other SEO infrastructure.

### Measurement

- **Month 1–3**: manual AI citation tracking — periodically search ChatGPT, Perplexity, Gemini, and Copilot for target topics and log whether the blog is cited.
- **Month 4+**: evaluate paid GEO measurement tooling (Profound, Peec AI, Otterly) only if GEO-attributable referral traffic materializes. Deferred until traffic justifies spend; tracked in [`docs/tech-stack.md`](tech-stack.md) Risks and open questions.

## AdSense signals that overlap with SEO/GEO

AdSense approval and ongoing ad revenue both depend on signals that also lift traditional and generative rankings:

- **Author identity and E-E-A-T** — real name, bio, photo, stated expertise on every byline; `Person` JSON-LD on author pages.
- **Domain age ≥ 30 days** — registration scheduled at project kickoff.
- **Minimum 15–30 indexed articles, 800+ words each** — met by two weeks of the 4×/week cron plus manual seeding of cornerstone articles.
- **No empty categories or "coming soon" pages** — category pages render only when ≥ 3 articles exist.

The mandatory-pages checklist and launch-blocker view of AdSense readiness live in [`docs/tech-stack.md`](tech-stack.md) under "AdSense readiness mapping".

## Related docs

- [`docs/tech-stack.md`](tech-stack.md) — vendor and tool registry; this file is the authority for SEO and GEO choices.
- [`docs/accessibility.md`](accessibility.md) — WCAG 2.2 AA compliance (accessibility also reinforces SEO rankings).
- [`docs/product_idea.md`](product_idea.md) — original SEO, content, and AdSense requirements.
- [`docs/built-article-steps.md`](built-article-steps.md) — 8-call Perplexity pipeline that produces GEO-compliant content.
