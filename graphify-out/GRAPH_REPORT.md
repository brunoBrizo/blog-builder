# Graph Report - /Users/brunobrizolara/src/blog-builder (2026-04-23)

## Corpus Check

- Large corpus: 288 files · ~92,884 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary

- 840 nodes · 792 edges · 60 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 95 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_InMemoryGenerationRepository +|InMemoryGenerationRepository +]]
- [[_COMMUNITY_Drizzle ORM +|Drizzle ORM +]]
- [[_COMMUNITY_AdSense Submission Readiness +|AdSense Submission Readiness +]]
- [[_COMMUNITY_next-intl i18n +|next-intl i18n +]]
- [[_COMMUNITY_Inngest workflow orchestration +|Inngest workflow orchestration +]]
- [[_COMMUNITY_AppConfigService +|AppConfigService +]]
- [[_COMMUNITY_Tech Stack AI Tech Blog +|Tech Stack AI Tech Blog +]]
- [[_COMMUNITY_revalidateOnServer() +|revalidateOnServer() +]]
- [[_COMMUNITY_initSentry() +|initSentry() +]]
- [[_COMMUNITY_GenerationRepository +|GenerationRepository +]]
- [[_COMMUNITY_buildMetadata() +|buildMetadata() +]]
- [[_COMMUNITY_setup() +|setup() +]]
- [[_COMMUNITY_generation.errors.ts +|generation.errors.ts +]]
- [[_COMMUNITY_card.tsx +|card.tsx +]]
- [[_COMMUNITY_DrizzleModule +|DrizzleModule +]]
- [[_COMMUNITY_TestEndpointsController +|TestEndpointsController +]]
- [[_COMMUNITY_alert.tsx +|alert.tsx +]]
- [[_COMMUNITY_RevalidateAuthGuard +|RevalidateAuthGuard +]]
- [[_COMMUNITY_CronAuthGuard +|CronAuthGuard +]]
- [[_COMMUNITY_TestEndpointsGuard +|TestEndpointsGuard +]]
- [[_COMMUNITY_AppController +|AppController +]]
- [[_COMMUNITY_InngestDevKeysLogger +|InngestDevKeysLogger +]]
- [[_COMMUNITY_connectionOptions() +|connectionOptions() +]]
- [[_COMMUNITY_middleware() +|middleware() +]]
- [[_COMMUNITY_table-of-contents.tsx +|table-of-contents.tsx +]]
- [[_COMMUNITY_consent-placeholder.tsx +|consent-placeholder.tsx +]]
- [[_COMMUNITY_auth.decorators.ts +|auth.decorators.ts +]]
- [[_COMMUNITY_SentryHttpBreadcrumbInterceptor +|SentryHttpBreadcrumbInterceptor +]]
- [[_COMMUNITY_AppService +|AppService +]]
- [[_COMMUNITY_RevalidateController +|RevalidateController +]]
- [[_COMMUNITY_KillSwitchService +|KillSwitchService +]]
- [[_COMMUNITY_PerplexityClient +|PerplexityClient +]]
- [[_COMMUNITY_stub-perplexity.fixtures.ts +|stub-perplexity.fixtures.ts +]]
- [[_COMMUNITY_Skeleton()|Skeleton()]]
- [[_COMMUNITY_cn()|cn()]]
- [[_COMMUNITY_Container()|Container()]]
- [[_COMMUNITY_Badge()|Badge()]]
- [[_COMMUNITY_pathAllowed()|pathAllowed()]]
- [[_COMMUNITY_getCategory()|getCategory()]]
- [[_COMMUNITY_GlobalError()|GlobalError()]]
- [[_COMMUNITY_AdminPlaceholderPage()|AdminPlaceholderPage()]]
- [[_COMMUNITY_PrivacyPlaceholderPage()|PrivacyPlaceholderPage()]]
- [[_COMMUNITY_TermsPlaceholderPage()|TermsPlaceholderPage()]]
- [[_COMMUNITY_ShareButtons()|ShareButtons()]]
- [[_COMMUNITY_AnalyticsPlaceholder()|AnalyticsPlaceholder()]]
- [[_COMMUNITY_NewsletterCard()|NewsletterCard()]]
- [[_COMMUNITY_SidebarCategories()|SidebarCategories()]]
- [[_COMMUNITY_handleCopy()|handleCopy()]]
- [[_COMMUNITY_ArticleCard()|ArticleCard()]]
- [[_COMMUNITY_CoreModule|CoreModule]]
- [[_COMMUNITY_AppConfigModule|AppConfigModule]]
- [[_COMMUNITY_ApiAuthModule|ApiAuthModule]]
- [[_COMMUNITY_ApiThrottlerModule|ApiThrottlerModule]]
- [[_COMMUNITY_ApiObservabilityModule|ApiObservabilityModule]]
- [[_COMMUNITY_mockHost()|mockHost()]]
- [[_COMMUNITY_ApiLoggingModule|ApiLoggingModule]]
- [[_COMMUNITY_AppModule|AppModule]]
- [[_COMMUNITY_RevalidatePathDto|RevalidatePathDto]]
- [[_COMMUNITY_NewsletterSubscribeDto|NewsletterSubscribeDto]]
- [[_COMMUNITY_PostInternalArticlesGenerateDto|PostInternalArticlesGenerateDto]]

## God Nodes (most connected - your core abstractions)

1. `AppConfigService` - 38 edges
2. `Drizzle ORM` - 35 edges
3. `AdSense Submission Readiness` - 21 edges
4. `InMemoryGenerationRepository` - 20 edges
5. `GenerationRepository` - 19 edges
6. `ArticleGenerationOrchestratorService` - 16 edges
7. `next-intl i18n` - 15 edges
8. `Web Foundation` - 14 edges
9. `Database & Data Layer` - 12 edges
10. `API Foundation` - 12 edges

## Surprising Connections (you probably didn't know these)

- `Database & Data Layer` --implements_in--> `libs/db Drizzle schema and client` [INFERRED]
  features/02-database-and-data-layer.md → README.md
- `Foundation — Monorepo & Tooling` --establishes--> `Nx monorepo` [EXTRACTED]
  features/01-foundation-monorepo-tooling.md → README.md
- `Fly.io API deployment` --documents--> `Fly.io API hosting` [EXTRACTED]
  docs/api-fly-deploy.md → features/03-api-foundation.md
- `Fly.io API deployment` --applies_to--> `apps/api NestJS API` [INFERRED]
  docs/api-fly-deploy.md → README.md
- `Tech Stack AI Tech Blog` --STACK_MAPS_UI_LIB--> `libs/ui Nx library README` [EXTRACTED]
  docs/tech-stack.md → libs/ui/README.md

## Communities

### Community 0 - "InMemoryGenerationRepository +"

Cohesion: 0.09
Nodes (17): ArticleGenerationOrchestratorService, normalizePerplexitySearchForCitations(), pickCitationsFromStepOutput(), searchToCitations(), slugify(), buildStep1Research(), buildStep2Competitor(), buildStep3Outline() (+9 more)

### Community 1 - "Drizzle ORM +"

Cohesion: 0.05
Nodes (10): BudgetService, startOfUtcDay(), createDatabase(), Drizzle ORM, HealthController, main(), createdAtColumn(), deletedAtColumn() (+2 more)

### Community 2 - "AdSense Submission Readiness +"

Cohesion: 0.09
Nodes (48): Google AdSense, Eight-step article generation pipeline, Google Consent Mode v2, Article generation pipeline steps, docs/accessibility.md (referenced), docs/product_idea.md (referenced), docs/seo-geo.md (referenced), docs/tech-stack.md (referenced) (+40 more)

### Community 3 - "next-intl i18n +"

Cohesion: 0.06
Nodes (15): LanguageSwitcher(), generateMetadata(), LocaleLayout(), RootLayout(), isAppLocale(), localeToHtmlLang(), next-intl i18n, buildOrganizationJsonLd() (+7 more)

### Community 4 - "Inngest workflow orchestration +"

Cohesion: 0.07
Nodes (22): apps/api NestJS API, apps/web Next.js frontend, ArticleGenerationController, executeArticleGenerationPipeline(), cappedRunBudget(), createMemoizingStep(), createOrchestrator(), killSwitchClosed() (+14 more)

### Community 5 - "AppConfigService +"

Cohesion: 0.05
Nodes (1): AppConfigService

### Community 6 - "Tech Stack AI Tech Blog +"

Cohesion: 0.16
Nodes (24): Accessibility WCAG 2.2 AA policy, Article page design HTML, Articles list page design HTML, Home page design HTML, Help guides index, Article generation manual testing, Cost and safety knobs generation, Database workflows Drizzle Postgres (+16 more)

### Community 7 - "revalidateOnServer() +"

Cohesion: 0.16
Nodes (10): ApiError, parseApiErrorBody(), apiFetch(), getBaseUrl(), HttpExceptionFilter, statusToCode(), zodIssues(), apiBaseUrl() (+2 more)

### Community 8 - "initSentry() +"

Cohesion: 0.15
Nodes (10): applySecurityMiddleware(), isInngestPath(), effectiveSentryTracesSampleRate(), parseEnv(), bootstrap(), initSentry(), getEnv(), ThrottleAdmin() (+2 more)

### Community 9 - "GenerationRepository +"

Cohesion: 0.1
Nodes (1): GenerationRepository

### Community 10 - "buildMetadata() +"

Cohesion: 0.15
Nodes (6): buildMetadata(), buildOpenGraph(), buildTwitter(), canonicalUrl(), normalizePath(), buildHreflangMap()

### Community 11 - "setup() +"

Cohesion: 0.26
Nodes (9): anonConnectionUrl(), quoteIdent(), resolveMigrationsFolder(), setup(), connectionOptions(), main(), resolveMigrationsFolder(), ensureMigrationPrerequisites() (+1 more)

### Community 14 - "generation.errors.ts +"

Cohesion: 0.32
Nodes (3): BudgetExceededError, KillSwitchError, PerplexityValidationError

### Community 15 - "card.tsx +"

Cohesion: 0.43
Nodes (6): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 16 - "DrizzleModule +"

Cohesion: 0.29
Nodes (1): DrizzleModule

### Community 17 - "TestEndpointsController +"

Cohesion: 0.33
Nodes (1): TestEndpointsController

### Community 18 - "alert.tsx +"

Cohesion: 0.6
Nodes (3): Alert(), AlertDescription(), AlertTitle()

### Community 19 - "RevalidateAuthGuard +"

Cohesion: 0.4
Nodes (1): RevalidateAuthGuard

### Community 20 - "CronAuthGuard +"

Cohesion: 0.4
Nodes (1): CronAuthGuard

### Community 21 - "TestEndpointsGuard +"

Cohesion: 0.4
Nodes (1): TestEndpointsGuard

### Community 22 - "AppController +"

Cohesion: 0.4
Nodes (1): AppController

### Community 23 - "InngestDevKeysLogger +"

Cohesion: 0.4
Nodes (1): InngestDevKeysLogger

### Community 24 - "connectionOptions() +"

Cohesion: 0.83
Nodes (2): connectionOptions(), main()

### Community 25 - "middleware() +"

Cohesion: 0.83
Nodes (2): middleware(), stripLocalePrefix()

### Community 26 - "table-of-contents.tsx +"

Cohesion: 0.67
Nodes (2): cn(), handleIntersect()

### Community 27 - "consent-placeholder.tsx +"

Cohesion: 0.67
Nodes (2): ConsentPlaceholder(), setConsent()

### Community 28 - "auth.decorators.ts +"

Cohesion: 0.67
Nodes (2): UseCronAuth(), UseRevalidateAuth()

### Community 29 - "SentryHttpBreadcrumbInterceptor +"

Cohesion: 0.5
Nodes (1): SentryHttpBreadcrumbInterceptor

### Community 30 - "AppService +"

Cohesion: 0.5
Nodes (1): AppService

### Community 31 - "RevalidateController +"

Cohesion: 0.5
Nodes (1): RevalidateController

### Community 32 - "KillSwitchService +"

Cohesion: 0.5
Nodes (1): KillSwitchService

### Community 33 - "PerplexityClient +"

Cohesion: 0.5
Nodes (1): PerplexityClient

### Community 34 - "stub-perplexity.fixtures.ts +"

Cohesion: 0.67
Nodes (2): createCrashResumePerplexityStub(), createStubPerplexityChat()

### Community 35 - "Skeleton()"

Cohesion: 0.67
Nodes (1): Skeleton()

### Community 36 - "cn()"

Cohesion: 0.67
Nodes (1): cn()

### Community 37 - "Container()"

Cohesion: 0.67
Nodes (1): Container()

### Community 38 - "Badge()"

Cohesion: 0.67
Nodes (1): Badge()

### Community 39 - "pathAllowed()"

Cohesion: 0.67
Nodes (1): pathAllowed()

### Community 40 - "getCategory()"

Cohesion: 0.67
Nodes (1): getCategory()

### Community 41 - "GlobalError()"

Cohesion: 0.67
Nodes (1): GlobalError()

### Community 42 - "AdminPlaceholderPage()"

Cohesion: 0.67
Nodes (1): AdminPlaceholderPage()

### Community 43 - "PrivacyPlaceholderPage()"

Cohesion: 0.67
Nodes (1): PrivacyPlaceholderPage()

### Community 44 - "TermsPlaceholderPage()"

Cohesion: 0.67
Nodes (1): TermsPlaceholderPage()

### Community 45 - "ShareButtons()"

Cohesion: 0.67
Nodes (1): ShareButtons()

### Community 46 - "AnalyticsPlaceholder()"

Cohesion: 0.67
Nodes (1): AnalyticsPlaceholder()

### Community 47 - "NewsletterCard()"

Cohesion: 0.67
Nodes (1): NewsletterCard()

### Community 48 - "SidebarCategories()"

Cohesion: 0.67
Nodes (1): SidebarCategories()

### Community 49 - "handleCopy()"

Cohesion: 0.67
Nodes (1): handleCopy()

### Community 50 - "ArticleCard()"

Cohesion: 0.67
Nodes (1): ArticleCard()

### Community 51 - "CoreModule"

Cohesion: 0.67
Nodes (1): CoreModule

### Community 52 - "AppConfigModule"

Cohesion: 0.67
Nodes (1): AppConfigModule

### Community 53 - "ApiAuthModule"

Cohesion: 0.67
Nodes (1): ApiAuthModule

### Community 54 - "ApiThrottlerModule"

Cohesion: 0.67
Nodes (1): ApiThrottlerModule

### Community 55 - "ApiObservabilityModule"

Cohesion: 0.67
Nodes (1): ApiObservabilityModule

### Community 56 - "mockHost()"

Cohesion: 0.67
Nodes (1): mockHost()

### Community 57 - "ApiLoggingModule"

Cohesion: 0.67
Nodes (1): ApiLoggingModule

### Community 58 - "AppModule"

Cohesion: 0.67
Nodes (1): AppModule

### Community 59 - "RevalidatePathDto"

Cohesion: 0.67
Nodes (1): RevalidatePathDto

### Community 60 - "NewsletterSubscribeDto"

Cohesion: 0.67
Nodes (1): NewsletterSubscribeDto

### Community 61 - "PostInternalArticlesGenerateDto"

Cohesion: 0.67
Nodes (1): PostInternalArticlesGenerateDto

## Ambiguous Edges - Review These

- `Homepage & Blog Navigation` → `Mandatory AdSense Pages` [AMBIGUOUS]
  · relation: cross_cutting_homepage_signals

## Knowledge Gaps

- **31 isolated node(s):** `pnpm workspaces`, `apps/web Next.js frontend`, `libs/ui component library`, `libs/shared-types`, `libs/seo SEO helpers` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `AppConfigService +`** (37 nodes): `AppConfigService`, `.builtAt()`, `.constructor()`, `.corsOriginWeb()`, `.cronIpAllowlistRaw()`, `.cronSharedSecret()`, `.databasePoolMax()`, `.databaseUrl()`, `.enableTestEndpoints()`, `.generationDailyUsdCeiling()`, `.generationDefaultAuthorId()`, `.generationKillSwitch()`, `.generationPerRunTokenBudget()`, `.gitSha()`, `.inngestEventKey()`, `.inngestKeysOptional()`, `.inngestServePath()`, `.inngestSigningKey()`, `.logLevel()`, `.nodeEnv()`, `.perplexityApiKey()`, `.perplexityTimeoutMs()`, `.perplexityUsdPerMtokensCompletion()`, `.perplexityUsdPerMtokensPrompt()`, `.port()`, `.releaseTag()`, `.resendApiKey()`, `.revalidateSharedSecret()`, `.sentryDsn()`, `.supabaseSecretKey()`, `.supabaseUrl()`, `.throttlerAdmin()`, `.throttlerPublicRead()`, `.throttlerPublicWrite()`, `.trustProxy()`, `app-config.service.ts`, `app-config.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GenerationRepository +`** (20 nodes): `generation.repository.ts`, `GenerationRepository`, `.completeStep()`, `.constructor()`, `.countSucceededSteps()`, `.createDraftArticle()`, `.createJob()`, `.findTranslationId()`, `.getStepOutput()`, `.linkJobToArticle()`, `.listCitationPayloads()`, `.markJobFailed()`, `.markJobRunning()`, `.markJobSucceeded()`, `.monthlySpendUtc()`, `.replaceCitations()`, `.requireJob()`, `.updateArticleTokenTotal()`, `.upsertTranslation()`, `generation.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DrizzleModule +`** (7 nodes): `DrizzleModule`, `.constructor()`, `.forRoot()`, `.forRootAsync()`, `.onModuleDestroy()`, `drizzle.module.ts`, `drizzle.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TestEndpointsController +`** (6 nodes): `test-endpoints.controller.ts`, `TestEndpointsController`, `.cronOk()`, `.rateLimitProbe()`, `.validateNewsletter()`, `test-endpoints.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RevalidateAuthGuard +`** (5 nodes): `revalidate-auth.guard.ts`, `RevalidateAuthGuard`, `.canActivate()`, `.constructor()`, `revalidate-auth.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CronAuthGuard +`** (5 nodes): `cron-auth.guard.ts`, `CronAuthGuard`, `.canActivate()`, `.constructor()`, `cron-auth.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TestEndpointsGuard +`** (5 nodes): `test-endpoints.guard.ts`, `TestEndpointsGuard`, `.canActivate()`, `.constructor()`, `test-endpoints.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppController +`** (5 nodes): `AppController`, `.constructor()`, `.getData()`, `app.controller.ts`, `app.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `InngestDevKeysLogger +`** (5 nodes): `inngest-dev-keys.logger.ts`, `InngestDevKeysLogger`, `.constructor()`, `.onModuleInit()`, `inngest-dev-keys.logger.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `connectionOptions() +`** (4 nodes): `reset.ts`, `connectionOptions()`, `main()`, `reset.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `middleware() +`** (4 nodes): `middleware.ts`, `middleware()`, `stripLocalePrefix()`, `middleware.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `table-of-contents.tsx +`** (4 nodes): `table-of-contents.tsx`, `cn()`, `handleIntersect()`, `table-of-contents.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `consent-placeholder.tsx +`** (4 nodes): `consent-placeholder.tsx`, `ConsentPlaceholder()`, `setConsent()`, `consent-placeholder.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `auth.decorators.ts +`** (4 nodes): `auth.decorators.ts`, `UseCronAuth()`, `UseRevalidateAuth()`, `auth.decorators.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SentryHttpBreadcrumbInterceptor +`** (4 nodes): `sentry-breadcrumb.interceptor.ts`, `SentryHttpBreadcrumbInterceptor`, `.intercept()`, `sentry-breadcrumb.interceptor.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppService +`** (4 nodes): `AppService`, `.getData()`, `app.service.ts`, `app.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RevalidateController +`** (4 nodes): `revalidate.controller.ts`, `RevalidateController`, `.trigger()`, `revalidate.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `KillSwitchService +`** (4 nodes): `kill-switch.service.ts`, `KillSwitchService`, `.constructor()`, `kill-switch.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PerplexityClient +`** (4 nodes): `perplexity.client.ts`, `PerplexityClient`, `.constructor()`, `perplexity.client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `stub-perplexity.fixtures.ts +`** (4 nodes): `stub-perplexity.fixtures.ts`, `createCrashResumePerplexityStub()`, `createStubPerplexityChat()`, `stub-perplexity.fixtures.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton()`** (3 nodes): `skeleton.tsx`, `Skeleton()`, `skeleton.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `cn()`** (3 nodes): `cn()`, `cn.ts`, `cn.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Container()`** (3 nodes): `Container()`, `container.tsx`, `container.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Badge()`** (3 nodes): `Badge()`, `badge.tsx`, `badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `pathAllowed()`** (3 nodes): `revalidate.ts`, `pathAllowed()`, `revalidate.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `getCategory()`** (3 nodes): `articles.ts`, `getCategory()`, `articles.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GlobalError()`** (3 nodes): `global-error.tsx`, `GlobalError()`, `global-error.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AdminPlaceholderPage()`** (3 nodes): `page.tsx`, `AdminPlaceholderPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PrivacyPlaceholderPage()`** (3 nodes): `page.tsx`, `PrivacyPlaceholderPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TermsPlaceholderPage()`** (3 nodes): `page.tsx`, `TermsPlaceholderPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ShareButtons()`** (3 nodes): `share-buttons.tsx`, `ShareButtons()`, `share-buttons.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AnalyticsPlaceholder()`** (3 nodes): `AnalyticsPlaceholder()`, `analytics-placeholder.tsx`, `analytics-placeholder.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NewsletterCard()`** (3 nodes): `newsletter-card.tsx`, `NewsletterCard()`, `newsletter-card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SidebarCategories()`** (3 nodes): `sidebar-categories.tsx`, `SidebarCategories()`, `sidebar-categories.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `handleCopy()`** (3 nodes): `code-block.tsx`, `handleCopy()`, `code-block.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ArticleCard()`** (3 nodes): `article-card.tsx`, `ArticleCard()`, `article-card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CoreModule`** (3 nodes): `core.module.ts`, `CoreModule`, `core.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppConfigModule`** (3 nodes): `AppConfigModule`, `app-config.module.ts`, `app-config.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ApiAuthModule`** (3 nodes): `ApiAuthModule`, `api-auth.module.ts`, `api-auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ApiThrottlerModule`** (3 nodes): `ApiThrottlerModule`, `api-throttler.module.ts`, `api-throttler.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ApiObservabilityModule`** (3 nodes): `ApiObservabilityModule`, `api-observability.module.ts`, `api-observability.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `mockHost()`** (3 nodes): `http-exception.filter.spec.ts`, `mockHost()`, `http-exception.filter.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ApiLoggingModule`** (3 nodes): `ApiLoggingModule`, `api-logging.module.ts`, `api-logging.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppModule`** (3 nodes): `AppModule`, `app.module.ts`, `app.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RevalidatePathDto`** (3 nodes): `revalidate-path.dto.ts`, `RevalidatePathDto`, `revalidate-path.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NewsletterSubscribeDto`** (3 nodes): `newsletter-subscribe.dto.ts`, `NewsletterSubscribeDto`, `newsletter-subscribe.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostInternalArticlesGenerateDto`** (3 nodes): `post-internal-articles-generate.dto.ts`, `PostInternalArticlesGenerateDto`, `post-internal-articles-generate.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Homepage & Blog Navigation` and `Mandatory AdSense Pages`?**
  _Edge tagged AMBIGUOUS (relation: cross_cutting_homepage_signals) - confidence is low._
- **Why does `Drizzle ORM` connect `Drizzle ORM +` to `GenerationRepository +`, `AdSense Submission Readiness +`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Database & Data Layer` connect `AdSense Submission Readiness +` to `Drizzle ORM +`, `Inngest workflow orchestration +`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `next-intl i18n` connect `next-intl i18n +` to `AdSense Submission Readiness +`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `pnpm workspaces`, `apps/web Next.js frontend`, `libs/ui component library` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InMemoryGenerationRepository +` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Drizzle ORM +` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
