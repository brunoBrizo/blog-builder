# 10. SEO & GEO Discoverability Files

## Goal

Ship every machine-readable surface search engines and AI crawlers need to find, fetch, classify, and cite our content: sitemaps, `robots.txt`, `llms.txt`, `llms-full.txt`, RSS, security headers, and site-wide structured data.

## Dependencies

- [04. Web Foundation](./04-web-foundation.md).
- [07. Article Reading Experience](./07-article-reading-experience.md) (articles exist).
- [08. Homepage & Blog Navigation](./08-homepage-and-blog-navigation.md) (category/tag pages exist).

## Scope

In scope:

- `/robots.txt` — generated from the allow/block policy in [`docs/seo-geo.md`](../docs/seo-geo.md#ai-crawler-policy).
- `/sitemap.xml` — index sitemap pointing to per-locale sitemaps.
- `/sitemap-<locale>.xml` per locale, split when > 50 000 URLs.
- `/llms.txt` and `/llms-full.txt` per the GEO policy.
- `/rss.xml` per locale.
- Global JSON-LD for `WebSite` (with `SearchAction`), `Organization`, `Publisher` rendered in the root layout.
- Security + SEO headers via `next.config.ts` and middleware (HSTS, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, X-Robots-Tag defaults).
- Favicons (full set), `manifest.webmanifest`, Apple touch icons.

Out of scope:

- Per-article JSON-LD (already in feature 07).
- AdSense-mandatory pages (feature 11).
- Analytics / consent (feature 16).

## Backend work

- Expose `GET /sitemap/articles?locale=...` returning `{ slug, updatedAt }` for all published translations, cursor-paginated so `apps/web` can stream sitemaps larger than 50 000 URLs.
- Expose `GET /feed/articles?locale=...&limit=50` returning the data needed to build the RSS feed.
- Both endpoints cache at the edge with short TTL and are invalidated by the revalidation hook in feature 06.

## Frontend work

- `app/robots.ts` implements the allow/block rules in [`docs/seo-geo.md`](../docs/seo-geo.md#ai-crawler-policy):
  - Allow: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `ChatGPT-User`, `Perplexity-User`, `Applebot`, `Applebot-Extended`.
  - Disallow: `GPTBot`, `Google-Extended`, `anthropic-ai`, `ClaudeBot`, `CCBot`, `Omgilibot`, `Amazonbot`, and any other training-only crawler listed in the policy.
  - Allow `/` for the allowed bots; disallow `/admin/`, `/api/`, `/_next/`, `/search`.
  - Reference the sitemap.
- `app/sitemap.ts` returns a sitemap index and per-locale sitemaps. Each URL carries `lastmod`, `changefreq`, `priority`. Large locales automatically split into `sitemap-<locale>-1.xml`, `-2.xml`, etc.
- `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` serve the GEO manifest as plain text per [`docs/seo-geo.md`](../docs/seo-geo.md#llmstxt--llms-fulltxt). Content is generated at build time and revalidated on publish.
- `app/[locale]/rss.xml/route.ts` emits a valid RSS 2.0 feed with `<atom:link rel="self">`, localized `<language>`, and full-HTML `<content:encoded>` for the top 50 articles.
- Root layout injects JSON-LD for `WebSite` (with `SearchAction` pointing at `/[locale]/search?q={query}`), `Organization` (logo, sameAs), and `Publisher`.
- `next.config.ts` sets security headers: `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` minimal, and a CSP baseline tightened in feature 16.
- Admin routes emit `X-Robots-Tag: noindex, nofollow`; `/search` pages get the same header.
- Ship the complete favicon set + `manifest.webmanifest` with localized `name`/`short_name`.

## Acceptance criteria

- `curl /robots.txt` shows exactly the allow/block list in [`docs/seo-geo.md`](../docs/seo-geo.md#ai-crawler-policy) and a sitemap line.
- `/sitemap.xml` validates (`xmllint --noout`) and lists every per-locale sitemap.
- Per-locale sitemaps list every published article translation with correct `lastmod`.
- `/llms.txt` and `/llms-full.txt` parse as plain text and match the structure in the GEO doc.
- RSS feed validates (W3C Feed Validator) for each locale.
- Google Rich Results test returns no errors on `WebSite`, `Organization`, and per-article schemas.
- `securityheaders.com` grade ≥ A.

## Related docs

- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md#seo--geo)
