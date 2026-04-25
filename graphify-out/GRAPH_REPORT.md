# Graph Report - blog-builder (2026-04-25)

## Corpus Check

- 291 files · ~137,100 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 730 nodes · 728 edges · 36 communities detected
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 122 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]

## God Nodes (most connected - your core abstractions)

1. `AppConfigService` - 40 edges
2. `InMemoryGenerationRepository` - 29 edges
3. `GenerationRepository` - 27 edges
4. `AdSense Submission Readiness` - 21 edges
5. `Drizzle ORM` - 19 edges
6. `ArticleGenerationOrchestratorService` - 16 edges
7. `Web Foundation` - 14 edges
8. `Database & Data Layer` - 12 edges
9. `API Foundation` - 12 edges
10. `Perplexity Article Pipeline` - 12 edges

## Surprising Connections (you probably didn't know these)

- `Database & Data Layer` --implements_in--> `libs/db Drizzle schema and client` [INFERRED]
  features/02-database-and-data-layer.md → README.md
- `Foundation — Monorepo & Tooling` --establishes--> `Nx monorepo` [EXTRACTED]
  features/01-foundation-monorepo-tooling.md → README.md
- `revalidatePathAllowed()` --calls--> `assertAllowedPath()` [INFERRED]
  libs/shared-types/src/schemas/revalidate.ts → apps/web/src/lib/api-client/revalidate.ts
- `buildMetadata()` --calls--> `generateMetadata()` [INFERRED]
  libs/seo/src/lib/build-metadata.ts → apps/web/src/app/[locale]/layout.tsx
- `getSiteUrl()` --calls--> `generateMetadata()` [INFERRED]
  libs/seo/src/lib/site-url.ts → apps/web/src/app/[locale]/layout.tsx

## Communities

### Community 0 - "Community 0"

Cohesion: 0.05
Nodes (23): ArticleGenerationController, ArticleGenerationOrchestratorService, normalizePerplexitySearchForCitations(), pickBestResearchTopic(), pickCitationsFromStepOutput(), searchToCitations(), slugify(), executeArticleGenerationPipeline() (+15 more)

### Community 1 - "Community 1"

Cohesion: 0.04
Nodes (9): AppConfigService, applySecurityMiddleware(), effectiveSentryTracesSampleRate(), parseEnv(), bootstrap(), initSentry(), getEnv(), ThrottleAdmin() (+1 more)

### Community 2 - "Community 2"

Cohesion: 0.09
Nodes (48): Google AdSense, Eight-step article generation pipeline, Google Consent Mode v2, Article generation pipeline steps, docs/accessibility.md (referenced), docs/product_idea.md (referenced), docs/seo-geo.md (referenced), docs/tech-stack.md (referenced) (+40 more)

### Community 3 - "Community 3"

Cohesion: 0.05
Nodes (16): buildMetadata(), buildOpenGraph(), buildTwitter(), canonicalUrl(), normalizePath(), buildHreflangMap(), LanguageSwitcher(), generateMetadata() (+8 more)

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
Nodes (6): getArticleBySlug(), ArticleBySlugPage(), generateMetadata(), NewsBySlugPage(), TutorialBySlugPage(), getTutorialBySlug()

### Community 10 - "Community 10"

Cohesion: 0.27
Nodes (9): anonConnectionUrl(), quoteIdent(), resolveMigrationsFolder(), setup(), connectionOptions(), main(), resolveMigrationsFolder(), ensureMigrationPrerequisites() (+1 more)

### Community 13 - "Community 13"

Cohesion: 0.29
Nodes (3): BudgetExceededError, KillSwitchError, PerplexityValidationError

### Community 14 - "Community 14"

Cohesion: 0.33
Nodes (1): DrizzleModule

### Community 16 - "Community 16"

Cohesion: 0.4
Nodes (1): TestEndpointsController

### Community 18 - "Community 18"

Cohesion: 0.5
Nodes (1): RevalidateAuthGuard

### Community 19 - "Community 19"

Cohesion: 0.5
Nodes (1): CronAuthGuard

### Community 20 - "Community 20"

Cohesion: 0.5
Nodes (1): TestEndpointsGuard

### Community 21 - "Community 21"

Cohesion: 0.5
Nodes (1): AppController

### Community 22 - "Community 22"

Cohesion: 0.5
Nodes (1): InngestDevKeysLogger

### Community 23 - "Community 23"

Cohesion: 0.83
Nodes (3): createOrchestrator(), killSwitchOpen(), noopBudget()

### Community 24 - "Community 24"

Cohesion: 1.0
Nodes (2): connectionOptions(), main()

### Community 25 - "Community 25"

Cohesion: 1.0
Nodes (2): middleware(), stripLocalePrefix()

### Community 32 - "Community 32"

Cohesion: 0.67
Nodes (1): SentryHttpBreadcrumbInterceptor

### Community 33 - "Community 33"

Cohesion: 0.67
Nodes (1): AppService

### Community 34 - "Community 34"

Cohesion: 0.67
Nodes (1): RevalidateController

### Community 72 - "Community 72"

Cohesion: 1.0
Nodes (1): CoreModule

### Community 73 - "Community 73"

Cohesion: 1.0
Nodes (1): AppConfigModule

### Community 74 - "Community 74"

Cohesion: 1.0
Nodes (1): ApiAuthModule

### Community 75 - "Community 75"

Cohesion: 1.0
Nodes (1): ApiThrottlerModule

### Community 76 - "Community 76"

Cohesion: 1.0
Nodes (1): ApiObservabilityModule

### Community 78 - "Community 78"

Cohesion: 1.0
Nodes (1): ApiLoggingModule

### Community 79 - "Community 79"

Cohesion: 1.0
Nodes (1): AppModule

### Community 80 - "Community 80"

Cohesion: 1.0
Nodes (1): RevalidatePathDto

### Community 81 - "Community 81"

Cohesion: 1.0
Nodes (1): NewsletterSubscribeDto

### Community 82 - "Community 82"

Cohesion: 1.0
Nodes (1): PostInternalArticlesRetryDto

### Community 83 - "Community 83"

Cohesion: 1.0
Nodes (1): PostInternalArticlesGenerateDto

## Ambiguous Edges - Review These

- `Homepage & Blog Navigation` → `Mandatory AdSense Pages` [AMBIGUOUS]
  · relation: cross_cutting_homepage_signals

## Knowledge Gaps

- **43 isolated node(s):** `CoreModule`, `AppConfigModule`, `ApiAuthModule`, `ApiThrottlerModule`, `ApiObservabilityModule` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 5`** (29 nodes): `generation.repository.ts`, `GenerationRepository`, `.completeStep()`, `.constructor()`, `.countAvailableTopics()`, `.countSucceededSteps()`, `.createDraftArticle()`, `.createJob()`, `.findTranslationId()`, `.getStepOutput()`, `.insertTopicQueueCandidates()`, `.linkJobToArticle()`, `.listCitationPayloads()`, `.listRetryableFailedJobs()`, `.listTranslationSlugsForArticle()`, `.markJobFailed()`, `.markJobRunning()`, `.markJobSucceeded()`, `.markTopicQueueConsumedForJob()`, `.monthlySpendUtc()`, `.publishArticle()`, `.releaseReservedTopicForJob()`, `.replaceCitations()`, `.requireJob()`, `.reserveScheduledTopicAndCreateJob()`, `.resetJobToPendingForRetry()`, `.updateArticleTokenTotal()`, `.upsertTranslation()`, `normalizeTopicQueueKey()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (6 nodes): `DrizzleModule`, `.constructor()`, `.forRoot()`, `.forRootAsync()`, `.onModuleDestroy()`, `drizzle.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (5 nodes): `test-endpoints.controller.ts`, `TestEndpointsController`, `.cronOk()`, `.rateLimitProbe()`, `.validateNewsletter()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (4 nodes): `revalidate-auth.guard.ts`, `RevalidateAuthGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (4 nodes): `cron-auth.guard.ts`, `CronAuthGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `test-endpoints.guard.ts`, `TestEndpointsGuard`, `.canActivate()`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (4 nodes): `AppController`, `.constructor()`, `.getData()`, `app.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `inngest-dev-keys.logger.ts`, `InngestDevKeysLogger`, `.constructor()`, `.onModuleInit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (3 nodes): `reset.ts`, `connectionOptions()`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (3 nodes): `middleware.ts`, `middleware()`, `stripLocalePrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (3 nodes): `sentry-breadcrumb.interceptor.ts`, `SentryHttpBreadcrumbInterceptor`, `.intercept()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (3 nodes): `AppService`, `.getData()`, `app.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (3 nodes): `revalidate.controller.ts`, `RevalidateController`, `.trigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (2 nodes): `core.module.ts`, `CoreModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (2 nodes): `AppConfigModule`, `app-config.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (2 nodes): `ApiAuthModule`, `api-auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (2 nodes): `ApiThrottlerModule`, `api-throttler.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (2 nodes): `ApiObservabilityModule`, `api-observability.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `ApiLoggingModule`, `api-logging.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `AppModule`, `app.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `revalidate-path.dto.ts`, `RevalidatePathDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `newsletter-subscribe.dto.ts`, `NewsletterSubscribeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (2 nodes): `post-internal-articles-retry.dto.ts`, `PostInternalArticlesRetryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `post-internal-articles-generate.dto.ts`, `PostInternalArticlesGenerateDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Homepage & Blog Navigation` and `Mandatory AdSense Pages`?**
  _Edge tagged AMBIGUOUS (relation: cross_cutting_homepage_signals) - confidence is low._
- **Why does `Drizzle ORM` connect `Community 4` to `Community 2`, `Community 5`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `Inngest workflow orchestration` connect `Community 6` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Database & Data Layer` connect `Community 2` to `Community 4`, `Community 6`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `CoreModule`, `AppConfigModule`, `ApiAuthModule` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
