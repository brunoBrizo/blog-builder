# Graph Report - blog-builder (2026-04-25)

## Corpus Check

- 306 files · ~143,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 775 nodes · 783 edges · 38 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 143 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]

## God Nodes (most connected - your core abstractions)

1. `AppConfigService` - 40 edges
2. `InMemoryGenerationRepository` - 29 edges
3. `GenerationRepository` - 27 edges
4. `AdSense Submission Readiness` - 21 edges
5. `Drizzle ORM` - 20 edges
6. `ArticleGenerationOrchestratorService` - 16 edges
7. `generateMetadata()` - 14 edges
8. `Web Foundation` - 14 edges
9. `Database & Data Layer` - 12 edges
10. `API Foundation` - 12 edges

## Surprising Connections (you probably didn't know these)

- `Database & Data Layer` --implements_in--> `libs/db Drizzle schema and client` [INFERRED]
  features/02-database-and-data-layer.md → README.md
- `buildArticleJsonLd()` --calls--> `ArticleBySlugPage()` [INFERRED]
  libs/seo/src/lib/json-ld/article.ts → apps/web/src/app/[locale]/articles/[slug]/page.tsx
- `buildFaqPageJsonLd()` --calls--> `ArticleBySlugPage()` [INFERRED]
  libs/seo/src/lib/json-ld/faq-page.ts → apps/web/src/app/[locale]/articles/[slug]/page.tsx
- `buildBreadcrumbListJsonLd()` --calls--> `ArticleBySlugPage()` [INFERRED]
  libs/seo/src/lib/json-ld/breadcrumb-list.ts → apps/web/src/app/[locale]/articles/[slug]/page.tsx
- `Foundation — Monorepo & Tooling` --establishes--> `Nx monorepo` [EXTRACTED]
  features/01-foundation-monorepo-tooling.md → README.md

## Communities

### Community 0 - "Community 0"

Cohesion: 0.05
Nodes (23): ArticleGenerationController, ArticleGenerationOrchestratorService, normalizePerplexitySearchForCitations(), pickBestResearchTopic(), pickCitationsFromStepOutput(), searchToCitations(), slugify(), executeArticleGenerationPipeline() (+15 more)

### Community 1 - "Community 1"

Cohesion: 0.04
Nodes (30): buildArticleJsonLd(), injectCitationLinks(), extractTocFromHtml(), getArticleBySlug(), listArticleSummaries(), listTopSlugs(), buildBreadcrumbListJsonLd(), buildMetadata() (+22 more)

### Community 2 - "Community 2"

Cohesion: 0.04
Nodes (9): AppConfigService, applySecurityMiddleware(), effectiveSentryTracesSampleRate(), parseEnv(), bootstrap(), initSentry(), getEnv(), ThrottleAdmin() (+1 more)

### Community 3 - "Community 3"

Cohesion: 0.09
Nodes (48): Google AdSense, Eight-step article generation pipeline, Google Consent Mode v2, Article generation pipeline steps, docs/accessibility.md (referenced), docs/product_idea.md (referenced), docs/seo-geo.md (referenced), docs/tech-stack.md (referenced) (+40 more)

### Community 4 - "Community 4"

Cohesion: 0.06
Nodes (6): BudgetService, startOfUtcDay(), createDatabase(), Drizzle ORM, HealthController, main()

### Community 5 - "Community 5"

Cohesion: 0.07
Nodes (2): GenerationRepository, normalizeTopicQueueKey()

### Community 6 - "Community 6"

Cohesion: 0.08
Nodes (13): apps/api NestJS API, apps/web Next.js frontend, Fly.io API deployment, GenerationModule, Inngest workflow orchestration, libs/db Drizzle schema and client, libs/prompts Perplexity prompt builders, libs/seo SEO helpers (+5 more)

### Community 7 - "Community 7"

Cohesion: 0.16
Nodes (24): Accessibility WCAG 2.2 AA policy, Article page design HTML, Articles list page design HTML, Home page design HTML, Help guides index, Article generation manual testing, Cost and safety knobs generation, Database workflows Drizzle Postgres (+16 more)

### Community 8 - "Community 8"

Cohesion: 0.11
Nodes (12): ApiError, parseApiErrorBody(), apiFetch(), getBaseUrl(), HttpExceptionFilter, statusToCode(), zodIssues(), assertAllowedPath() (+4 more)

### Community 9 - "Community 9"

Cohesion: 0.12
Nodes (3): ArticlesController, ArticlesRepository, ArticlesService

### Community 10 - "Community 10"

Cohesion: 0.15
Nodes (1): next-intl i18n

### Community 11 - "Community 11"

Cohesion: 0.27
Nodes (9): anonConnectionUrl(), quoteIdent(), resolveMigrationsFolder(), setup(), connectionOptions(), main(), resolveMigrationsFolder(), ensureMigrationPrerequisites() (+1 more)

### Community 14 - "Community 14"

Cohesion: 0.29
Nodes (3): BudgetExceededError, KillSwitchError, PerplexityValidationError

### Community 15 - "Community 15"

Cohesion: 0.33
Nodes (1): DrizzleModule

### Community 17 - "Community 17"

Cohesion: 0.4
Nodes (1): TestEndpointsController

### Community 19 - "Community 19"

Cohesion: 0.5
Nodes (1): RevalidateAuthGuard

### Community 20 - "Community 20"

Cohesion: 0.5
Nodes (1): CronAuthGuard

### Community 21 - "Community 21"

Cohesion: 0.5
Nodes (1): TestEndpointsGuard

### Community 22 - "Community 22"

Cohesion: 0.5
Nodes (1): AppController

### Community 23 - "Community 23"

Cohesion: 0.5
Nodes (1): InngestDevKeysLogger

### Community 24 - "Community 24"

Cohesion: 0.83
Nodes (3): createOrchestrator(), killSwitchOpen(), noopBudget()

### Community 25 - "Community 25"

Cohesion: 1.0
Nodes (2): connectionOptions(), main()

### Community 26 - "Community 26"

Cohesion: 1.0
Nodes (2): middleware(), stripLocalePrefix()

### Community 33 - "Community 33"

Cohesion: 0.67
Nodes (1): SentryHttpBreadcrumbInterceptor

### Community 34 - "Community 34"

Cohesion: 0.67
Nodes (1): AppService

### Community 35 - "Community 35"

Cohesion: 0.67
Nodes (1): RevalidateController

### Community 77 - "Community 77"

Cohesion: 1.0
Nodes (1): CoreModule

### Community 78 - "Community 78"

Cohesion: 1.0
Nodes (1): AppConfigModule

### Community 79 - "Community 79"

Cohesion: 1.0
Nodes (1): ApiAuthModule

### Community 80 - "Community 80"

Cohesion: 1.0
Nodes (1): ApiThrottlerModule

### Community 81 - "Community 81"

Cohesion: 1.0
Nodes (1): ApiObservabilityModule

### Community 83 - "Community 83"

Cohesion: 1.0
Nodes (1): ApiLoggingModule

### Community 84 - "Community 84"

Cohesion: 1.0
Nodes (1): AppModule

### Community 85 - "Community 85"

Cohesion: 1.0
Nodes (1): RevalidatePathDto

### Community 86 - "Community 86"

Cohesion: 1.0
Nodes (1): NewsletterSubscribeDto

### Community 87 - "Community 87"

Cohesion: 1.0
Nodes (1): ArticlesModule

### Community 88 - "Community 88"

Cohesion: 1.0
Nodes (1): PostInternalArticlesRetryDto

### Community 89 - "Community 89"

Cohesion: 1.0
Nodes (1): PostInternalArticlesGenerateDto

## Ambiguous Edges - Review These

- `Homepage & Blog Navigation` → `Mandatory AdSense Pages` [AMBIGUOUS]
  · relation: cross_cutting_homepage_signals

## Knowledge Gaps

- **44 isolated node(s):** `CoreModule`, `AppConfigModule`, `ApiAuthModule`, `ApiThrottlerModule`, `ApiObservabilityModule` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 5`** (29 nodes): `generation.repository.ts`, `GenerationRepository`, `.completeStep()`, `.constructor()`, `.countAvailableTopics()`, `.countSucceededSteps()`, `.createDraftArticle()`, `.createJob()`, `.findTranslationId()`, `.getStepOutput()`, `.insertTopicQueueCandidates()`, `.linkJobToArticle()`, `.listCitationPayloads()`, `.listRetryableFailedJobs()`, `.listTranslationSlugsForArticle()`, `.markJobFailed()`, `.markJobRunning()`, `.markJobSucceeded()`, `.markTopicQueueConsumedForJob()`, `.monthlySpendUtc()`, `.publishArticle()`, `.releaseReservedTopicForJob()`, `.replaceCitations()`, `.requireJob()`, `.reserveScheduledTopicAndCreateJob()`, `.resetJobToPendingForRetry()`, `.updateArticleTokenTotal()`, `.upsertTranslation()`, `normalizeTopicQueueKey()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (13 nodes): `error.tsx`, `newsletter-sticky.tsx`, `privacy-policy-dialog.tsx`, `site-header.tsx`, `skip-to-content.tsx`, `theme-toggle.tsx`, `request.ts`, `next-intl i18n`, `navItemActive()`, `SkipToContent()`, `applyForcedClass()`, `setCookie()`, `ThemeToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (6 nodes): `DrizzleModule`, `.constructor()`, `.forRoot()`, `.forRootAsync()`, `.onModuleDestroy()`, `drizzle.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `test-endpoints.controller.ts`, `TestEndpointsController`, `.cronOk()`, `.rateLimitProbe()`, `.validateNewsletter()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (4 nodes): `revalidate-auth.guard.ts`, `RevalidateAuthGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `cron-auth.guard.ts`, `CronAuthGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (4 nodes): `test-endpoints.guard.ts`, `TestEndpointsGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `AppController`, `.constructor()`, `.getData()`, `app.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (4 nodes): `inngest-dev-keys.logger.ts`, `InngestDevKeysLogger`, `.constructor()`, `.onModuleInit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (3 nodes): `reset.ts`, `connectionOptions()`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (3 nodes): `middleware.ts`, `middleware()`, `stripLocalePrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (3 nodes): `sentry-breadcrumb.interceptor.ts`, `SentryHttpBreadcrumbInterceptor`, `.intercept()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (3 nodes): `AppService`, `.getData()`, `app.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (3 nodes): `revalidate.controller.ts`, `RevalidateController`, `.trigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (2 nodes): `core.module.ts`, `CoreModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `AppConfigModule`, `app-config.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `ApiAuthModule`, `api-auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `ApiThrottlerModule`, `api-throttler.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `ApiObservabilityModule`, `api-observability.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `ApiLoggingModule`, `api-logging.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (2 nodes): `AppModule`, `app.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `revalidate-path.dto.ts`, `RevalidatePathDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `newsletter-subscribe.dto.ts`, `NewsletterSubscribeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `articles.module.ts`, `ArticlesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (2 nodes): `post-internal-articles-retry.dto.ts`, `PostInternalArticlesRetryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `post-internal-articles-generate.dto.ts`, `PostInternalArticlesGenerateDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Homepage & Blog Navigation` and `Mandatory AdSense Pages`?**
  _Edge tagged AMBIGUOUS (relation: cross_cutting_homepage_signals) - confidence is low._
- **Why does `Drizzle ORM` connect `Community 4` to `Community 9`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `next-intl i18n` connect `Community 10` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Web Foundation` connect `Community 3` to `Community 10`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `CoreModule`, `AppConfigModule`, `ApiAuthModule` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
