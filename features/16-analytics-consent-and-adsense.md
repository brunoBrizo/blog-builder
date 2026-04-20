# 16. Analytics, Consent & AdSense

## Goal

Ship privacy-compliant analytics, a proper consent banner, and AdSense ad placement that respects user consent and keeps Core Web Vitals intact.

## Dependencies

- [04. Web Foundation](./04-web-foundation.md).
- [07. Article Reading Experience](./07-article-reading-experience.md).
- [11. Mandatory AdSense Pages](./11-mandatory-adsense-pages.md) (Privacy + Cookie policies must exist).

## Scope

In scope:

- Cookie consent banner built around Google Consent Mode v2.
- Google Analytics 4 (free) integration gated by consent.
- Google AdSense auto-ads and in-article manual slots gated by consent.
- Content Security Policy tightened for the Google tag + AdSense domains only.
- Core Web Vitals instrumentation to Vercel Analytics (free tier) or a self-hosted endpoint.

Out of scope:

- Non-Google ad networks.
- Server-side GA4 ingestion.

## Backend work

- None required. Keep the CSP header source of truth (`next.config.ts`) in `apps/web`.

## Frontend work

- Consent banner (Radix-based, focus-trapped, keyboard-operable):
  - Shown once per visitor or after cookie expiry (6 months).
  - Categories: Necessary (always on), Analytics, Advertising, Personalization.
  - Actions: "Accept all", "Reject all", "Preferences" (opens a per-category toggle sheet).
  - Stores the decision in a first-party cookie (`consent_v1`) and mirrors it into Google Consent Mode v2 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`).
  - Persists nothing else until the user makes a choice — the default state signals consent denial for GA4 and AdSense (Consent Mode v2 still allows pinged-but-cookieless modeled conversions).
  - Re-openable from the footer "Cookie preferences" link.
- GA4 integration:
  - Load the `gtag.js` script via `next/script` `strategy="afterInteractive"` and only after `analytics_storage = granted`.
  - Page-view tracking on App Router navigation via `usePathname` + `useSearchParams` effect.
  - Configure IP anonymization + data retention 2 months.
  - GA4 property ID from env var, injected at build time.
- AdSense integration:
  - Load `adsbygoogle.js` after the consent banner resolves and only when `ad_storage = granted`.
  - Auto-ads enabled globally; add two explicit in-article slots in the article template (mid-article after the 2nd H2; end-of-article before related articles) with `data-ad-client` and `data-ad-slot` attributes and reserved CSS height to prevent CLS.
  - Legal pages, admin routes, and `/search` never show ads.
  - Consent withdrawal immediately hides rendered ads and stops future impressions.
- Core Web Vitals reporting:
  - `reportWebVitals` pipes LCP, CLS, INP, TTFB to the chosen sink (Vercel Analytics free, or a tiny `POST /vitals` endpoint in `apps/api` — pick the free path with the smaller CSP footprint).
- CSP tightening:
  - Allowlist only: `self`, `*.googletagmanager.com`, `*.google-analytics.com`, `pagead2.googlesyndication.com`, `*.adtrafficquality.google`, `*.doubleclick.net`, `*.ezoic.com` (if ever used later: removable), Supabase Storage image domain, and `resend.com` for email pixels if relevant.
  - `frame-ancestors 'none'` on all pages.
  - `upgrade-insecure-requests`.
  - Nonce-based inline script policy for the consent banner bootstrap.
- All scripts added must be deferred and must not block LCP on the article page.

## Acceptance criteria

- Before consent: no `_ga`, no `IDE`, no `__gads` cookies set (verified via DevTools Application tab).
- After "Accept all": GA4 page view fires; AdSense requests `adsbygoogle.js`; relevant cookies set with correct scope.
- After "Reject all": no analytics/ads cookies; Consent Mode v2 signals set to `denied`; AdSense does not render ads.
- Article pages keep Lighthouse Performance ≥ 85 with ads rendered (realistic budget once AdSense is live).
- CLS from ad slots ≤ 0.05 thanks to reserved heights.
- CSP blocks any other third-party script (verified via `report-to` endpoint during QA).

## Related docs

- [`docs/product_idea.md`](../docs/product_idea.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md)
- [`docs/seo-geo.md`](../docs/seo-geo.md)
