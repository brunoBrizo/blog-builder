# 11. Mandatory AdSense Pages

## Goal

Publish every page Google AdSense and applicable privacy laws (GDPR, LGPD, CCPA) require before an AdSense application can pass review.

## Dependencies

- [04. Web Foundation](./04-web-foundation.md).

## Scope

In scope:

- Homepage (covered by feature 08; this feature ensures AdSense-required trust signals are present).
- About page.
- Contact page (UI here; backend in feature 13).
- Privacy Policy (GDPR + LGPD + CCPA + AdSense disclosures).
- Terms & Conditions.
- Cookie Policy (referenced by the consent banner in feature 16).
- Disclaimer (editorial, affiliate — even if none today, AdSense still expects it).
- Legal notice footer linking all the above on every page.

Out of scope:

- Contact form backend processing (feature 13).
- Cookie consent banner (feature 16).

## Backend work

None. These pages are statically generated per locale from localized MDX/markdown content in `apps/web/content/legal/<locale>/*.mdx`.

## Frontend work

- Static routes under `/[locale]/legal/*`:
  - `/[locale]/about`
  - `/[locale]/contact` (UI-only here)
  - `/[locale]/legal/privacy`
  - `/[locale]/legal/terms`
  - `/[locale]/legal/cookies`
  - `/[locale]/legal/disclaimer`
- Content is authored in MDX with frontmatter (`title`, `lastUpdated`, `version`) and compiled at build time. All three locales have a file — no page falls back silently to English.
- Privacy Policy must cover, at minimum:
  - Data controller identity and contact.
  - Data collected (analytics, cookies, newsletter email, contact form).
  - Legal basis (consent, legitimate interest).
  - Third parties (Google AdSense, Google Analytics, Resend, Sentry, Supabase, Vercel, Fly.io) with links to their privacy policies.
  - Cookie categories and retention.
  - Data-subject rights (access, rectification, erasure, objection, portability, complaint to supervisory authority).
  - Children's policy (no targeting under 13 / 16 per jurisdiction).
  - Data retention periods.
  - International data transfers and SCCs.
  - Updated date.
- Terms must include: acceptable use, intellectual property, disclaimer of warranties, limitation of liability, governing law, changes clause, contact.
- Disclaimer must cover editorial independence, AI-assisted content notice, no professional advice, and affiliate link disclosure (preemptive even with zero affiliate links today).
- Cookie Policy lists every cookie by name, purpose, duration, and whether it is first- or third-party. Synced with the consent banner categories in feature 16.
- About page includes publisher identity, editorial standards, how articles are produced (including AI + human review disclosure for E-E-A-T), and contact method.
- Footer on every page (added in feature 04) now links all legal pages and the contact page.
- Every legal page renders `BreadcrumbList` JSON-LD and has canonical + hreflang alternates.
- Every legal page has a clearly visible "Last updated: YYYY-MM-DD" line.

## Acceptance criteria

- All seven page types exist and render in all three locales with localized copy (not machine-translated placeholders).
- Footer on the homepage and every article links to Privacy, Terms, Cookies, Disclaimer, About, Contact.
- Lighthouse SEO = 100 on each legal page.
- Google's AdSense pre-check heuristics (manual review via the AdSense "Site requirements" list) pass: About, Contact, Privacy Policy accessible within two clicks from any page.
- Privacy policy version and last-updated date are visible and tracked in the MDX frontmatter.

## Related docs

- [`docs/product_idea.md`](../docs/product_idea.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md)
