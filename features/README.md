# Features — Build Order

This folder decomposes the AI & Tech Blog into independently deliverable features. Each file states the goal, dependencies, and separates backend work from frontend work without including code.

Read the source-of-truth docs before starting any feature:

- [`docs/product_idea.md`](../docs/product_idea.md) — business requirements, AdSense rules, newsletter behavior.
- [`docs/tech-stack.md`](../docs/tech-stack.md) — committed technology choices.
- [`docs/built-article-steps.md`](../docs/built-article-steps.md) — the 8-call Perplexity pipeline.
- [`docs/seo-geo.md`](../docs/seo-geo.md) — SEO and Generative Engine Optimization policy.
- [`docs/accessibility.md`](../docs/accessibility.md) — WCAG 2.2 AA target and testing layers.

## Build order

Features are numbered in the order they should be delivered. Numbering reflects dependencies, not team capacity — several features can run in parallel (see each file's `Dependencies` section).

| #   | Feature                                                                               | Primary owner |
| --- | ------------------------------------------------------------------------------------- | ------------- |
| 01  | [Foundation — Monorepo & Tooling](./01-foundation-monorepo-tooling.md)                | Platform      |
| 02  | [Database & Data Layer](./02-database-and-data-layer.md)                              | Backend       |
| 03  | [API Foundation](./03-api-foundation.md)                                              | Backend       |
| 04  | [Web Foundation](./04-web-foundation.md)                                              | Frontend      |
| 05  | [Perplexity Article Pipeline](./05-perplexity-article-pipeline.md)                    | Backend       |
| 06  | [Scheduled Article Generation](./06-scheduled-article-generation.md)                  | Backend       |
| 07  | [Article Reading Experience](./07-article-reading-experience.md)                      | Frontend      |
| 08  | [Homepage & Blog Navigation](./08-homepage-and-blog-navigation.md)                    | Full-stack    |
| 09  | [In-site Search](./09-in-site-search.md)                                              | Full-stack    |
| 10  | [SEO & GEO Discoverability Files](./10-seo-geo-discoverability-files.md)              | Frontend      |
| 11  | [Mandatory AdSense Pages](./11-mandatory-adsense-pages.md)                            | Frontend      |
| 12  | [Newsletter Subscription & Weekly Digest](./12-newsletter-subscription-and-digest.md) | Full-stack    |
| 13  | [Contact Form](./13-contact-form.md)                                                  | Full-stack    |
| 14  | [Content Refresh Job](./14-content-refresh-job.md)                                    | Backend       |
| 15  | [Admin Dashboard](./15-admin-dashboard.md)                                            | Full-stack    |
| 16  | [Analytics, Consent & AdSense](./16-analytics-consent-and-adsense.md)                 | Frontend      |
| 17  | [Accessibility Implementation](./17-accessibility-implementation.md)                  | Frontend      |
| 18  | [Observability & Monitoring](./18-observability-and-monitoring.md)                    | Full-stack    |
| 19  | [CI / CD & Deployments](./19-ci-cd-and-deployments.md)                                | Platform      |
| 20  | [AdSense Submission Readiness](./20-adsense-submission-readiness.md)                  | Product       |

## Suggested parallelization

- After **01–04** land, **05/06** (backend pipeline) and **07/08/10/11** (frontend reading experience + SEO surfaces + legal pages) can run in parallel.
- **12 (Newsletter)** and **13 (Contact)** are small, self-contained, and can be picked up whenever capacity allows after **03**.
- **17 (Accessibility)** runs continuously from the day **04** ships and has a final hardening pass before AdSense submission.
- **18 (Observability)** can be wired in as soon as **03** and **04** are deployable.
- **19 (CI/CD)** must be partially in place before **01** merges (lint + test gates) and fully complete before **20**.

## Definition of done for the whole program

Every feature file carries its own acceptance criteria. The program ships when:

1. All 20 feature files have their acceptance criteria met.
2. Success criteria in [`docs/tech-stack.md`](../docs/tech-stack.md#success-criteria), [`docs/seo-geo.md`](../docs/seo-geo.md#success-criteria), and [`docs/accessibility.md`](../docs/accessibility.md#target-and-success-criteria) are verified in production.
3. The AdSense application in Feature 20 has been submitted.
