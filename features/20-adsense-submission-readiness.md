# 20. AdSense Submission Readiness

## Goal

Reach the point where the AdSense application can be submitted with a realistic chance of first-time approval, then submit it. This feature is the program exit criterion.

## Dependencies

- Every previous feature (01–19).

## Scope

In scope:

- Pre-submission checklist audit (content volume, legal, UX, performance, a11y, SEO).
- Custom domain configured and HTTPS-only.
- 15–30 quality published articles seeded across categories and locales.
- AdSense account creation, site verification, and submission.
- Post-approval ad placement verification.

Out of scope:

- Ongoing ads ops / RPM optimization — post-launch work.

## Backend work

- Confirm `pg_cron` schedule has been running in production long enough that the article publish cadence is visible on the sitemap and the archive.
- Confirm cost ceilings + alerts (feature 18) are wired.
- No new endpoints.

## Frontend work

- Domain + DNS:
  - Custom domain attached to Vercel; HTTPS enforced; `www` and apex both resolve, one canonical, 301 on the other.
  - HSTS preload application submitted (optional).
- Pre-submission audit pass (produce a checklist artifact in the repo under `docs/launch-audit.md` listing each item, evidence link, and status):
  - Minimum 20 published, unique, in-depth articles in the primary locale (English), ≥ 10 each in pt-br and es via translations, all meeting the quality bar in [`docs/seo-geo.md`](../docs/seo-geo.md).
  - All AdSense-mandatory pages live and linked in the footer (feature 11).
  - Cookie banner + Consent Mode v2 active (feature 16).
  - Every article passes Rich Results validation (feature 07).
  - Lighthouse mobile Performance ≥ 85, SEO 100, A11y ≥ 95 on homepage, one article, one category, contact, privacy — screenshots committed.
  - Sitemap, robots, llms.txt, RSS resolve correctly on production domain (feature 10).
  - Sentry capturing errors, UptimeRobot reporting healthy (feature 18).
  - Per-locale `hreflang` verified via [hreflang-checker](https://technicalseo.com/tools/hreflang/) (free).
  - No 4xx/5xx crawl errors in Google Search Console.
  - Google Search Console property verified for all three locale subpaths; sitemap submitted.
  - GA4 data flowing for at least 14 days before submission.
- AdSense submission:
  - Create AdSense account tied to the publisher identity matching the About page.
  - Add the site, paste the AdSense verification snippet loaded only when `ad_storage=granted` (and during pre-approval, before consent decision, per AdSense guidance for unowned crawl verification — the verification script is exempt from consent until approval; re-gate after approval).
  - Submit for review.
- Post-approval:
  - Enable auto-ads and verify the two manual in-article slots render (feature 16).
  - Confirm CLS still meets the 0.1 threshold with ads live.
  - Add `ads.txt` to `apps/web/public/ads.txt` with the publisher ID; confirm it resolves at `/ads.txt`.

## Acceptance criteria

- `docs/launch-audit.md` is complete, every item ✅.
- Custom domain is HTTPS-only and both apex + www resolve consistently.
- AdSense application submitted and acknowledged by email.
- Post-approval: `/ads.txt` resolves, auto-ads visible, manual slots visible, CWV budget intact.
- Success criteria in [`docs/tech-stack.md`](../docs/tech-stack.md#success-criteria), [`docs/seo-geo.md`](../docs/seo-geo.md#success-criteria), and [`docs/accessibility.md`](../docs/accessibility.md#target-and-success-criteria) all hold in production.

## Related docs

- [`docs/product_idea.md`](../docs/product_idea.md)
- [`docs/seo-geo.md`](../docs/seo-geo.md)
- [`docs/accessibility.md`](../docs/accessibility.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md)
