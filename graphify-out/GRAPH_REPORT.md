# Graph Report - blog-builder (2026-04-24)

## Corpus Check

- 251 files · ~112,488 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 617 nodes · 619 edges · 36 communities detected
- Extraction: 84% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 95 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]

## God Nodes (most connected - your core abstractions)

1. `AppConfigService` - 37 edges
2. `AdSense Submission Readiness` - 21 edges
3. `InMemoryGenerationRepository` - 19 edges
4. `GenerationRepository` - 18 edges
5. `Drizzle ORM` - 18 edges
6. `ArticleGenerationOrchestratorService` - 15 edges
7. `Web Foundation` - 14 edges
8. `Database & Data Layer` - 12 edges
9. `API Foundation` - 12 edges
10. `Perplexity Article Pipeline` - 12 edges

## Surprising Connections (you probably didn't know these)

- `Database & Data Layer` --implements_in--> `libs/db Drizzle schema and client` [INFERRED]
  features/02-database-and-data-layer.md → README.md
- `Foundation — Monorepo & Tooling` --establishes--> `Nx monorepo` [EXTRACTED]
  features/01-foundation-monorepo-tooling.md → README.md
- `buildMetadata()` --calls--> `generateMetadata()` [INFERRED]
  libs/seo/src/lib/build-metadata.ts → apps/web/src/app/[locale]/layout.tsx
- `getSiteUrl()` --calls--> `generateMetadata()` [INFERRED]
  libs/seo/src/lib/site-url.ts → apps/web/src/app/[locale]/layout.tsx
- `getSiteUrl()` --calls--> `RootJsonLd()` [INFERRED]
  libs/seo/src/lib/site-url.ts → apps/web/src/components/root-json-ld.tsx

## Communities

### Community 0 - "Community 0"

Cohesion: 0.07
Nodes (20): ArticleGenerationOrchestratorService, normalizePerplexitySearchForCitations(), pickCitationsFromStepOutput(), searchToCitations(), slugify(), executeArticleGenerationPipeline(), buildStep1Research(), buildStep2Competitor() (+12 more)

### Community 1 - "Community 1"

Cohesion: 0.09
Nodes (48): Google AdSense, Eight-step article generation pipeline, Google Consent Mode v2, Article generation pipeline steps, docs/accessibility.md (referenced), docs/product_idea.md (referenced), docs/seo-geo.md (referenced), docs/tech-stack.md (referenced) (+40 more)

### Community 2 - "Community 2"

Cohesion: 0.05
Nodes (2): AppConfigService, applySecurityMiddleware()

### Community 3 - "Community 3"

Cohesion: 0.06
Nodes (6): BudgetService, startOfUtcDay(), createDatabase(), Drizzle ORM, HealthController, main()

### Community 4 - "Community 4"

Cohesion: 0.07
Nodes (14): apps/api NestJS API, apps/web Next.js frontend, ArticleGenerationController, Fly.io API deployment, GenerationModule, Inngest workflow orchestration, libs/db Drizzle schema and client, libs/prompts Perplexity prompt builders (+6 more)

### Community 5 - "Community 5"

Cohesion: 0.08
Nodes (15): buildMetadata(), buildOpenGraph(), buildTwitter(), canonicalUrl(), normalizePath(), buildHreflangMap(), LanguageSwitcher(), generateMetadata() (+7 more)

### Community 6 - "Community 6"

Cohesion: 0.16
Nodes (24): Accessibility WCAG 2.2 AA policy, Article page design HTML, Articles list page design HTML, Home page design HTML, Help guides index, Article generation manual testing, Cost and safety knobs generation, Database workflows Drizzle Postgres (+16 more)

### Community 7 - "Community 7"

Cohesion: 0.11
Nodes (1): GenerationRepository

### Community 8 - "Community 8"

Cohesion: 0.17
Nodes (10): ApiError, parseApiErrorBody(), apiFetch(), getBaseUrl(), HttpExceptionFilter, statusToCode(), zodIssues(), apiBaseUrl() (+2 more)

### Community 9 - "Community 9"

Cohesion: 0.15
Nodes (1): next-intl i18n

### Community 10 - "Community 10"

Cohesion: 0.27
Nodes (9): anonConnectionUrl(), quoteIdent(), resolveMigrationsFolder(), setup(), connectionOptions(), main(), resolveMigrationsFolder(), ensureMigrationPrerequisites() (+1 more)

### Community 11 - "Community 11"

Cohesion: 0.23
Nodes (7): effectiveSentryTracesSampleRate(), parseEnv(), bootstrap(), initSentry(), getEnv(), ThrottleAdmin(), ThrottlePublicWrite()

### Community 12 - "Community 12"

Cohesion: 0.18
Nodes (1): generateMetadata()

### Community 15 - "Community 15"

Cohesion: 0.29
Nodes (3): BudgetExceededError, KillSwitchError, PerplexityValidationError

### Community 16 - "Community 16"

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

Cohesion: 1.0
Nodes (2): connectionOptions(), main()

### Community 25 - "Community 25"

Cohesion: 1.0
Nodes (2): middleware(), stripLocalePrefix()

### Community 29 - "Community 29"

Cohesion: 0.67
Nodes (1): SentryHttpBreadcrumbInterceptor

### Community 30 - "Community 30"

Cohesion: 0.67
Nodes (1): AppService

### Community 31 - "Community 31"

Cohesion: 0.67
Nodes (1): RevalidateController

### Community 51 - "Community 51"

Cohesion: 1.0
Nodes (1): CoreModule

### Community 52 - "Community 52"

Cohesion: 1.0
Nodes (1): AppConfigModule

### Community 53 - "Community 53"

Cohesion: 1.0
Nodes (1): ApiAuthModule

### Community 54 - "Community 54"

Cohesion: 1.0
Nodes (1): ApiThrottlerModule

### Community 55 - "Community 55"

Cohesion: 1.0
Nodes (1): ApiObservabilityModule

### Community 57 - "Community 57"

Cohesion: 1.0
Nodes (1): ApiLoggingModule

### Community 58 - "Community 58"

Cohesion: 1.0
Nodes (1): AppModule

### Community 59 - "Community 59"

Cohesion: 1.0
Nodes (1): RevalidatePathDto

### Community 60 - "Community 60"

Cohesion: 1.0
Nodes (1): NewsletterSubscribeDto

### Community 61 - "Community 61"

Cohesion: 1.0
Nodes (1): PostInternalArticlesGenerateDto

## Ambiguous Edges - Review These

- `Homepage & Blog Navigation` → `Mandatory AdSense Pages` [AMBIGUOUS]
  · relation: cross_cutting_homepage_signals

## Knowledge Gaps

- **42 isolated node(s):** `CoreModule`, `AppConfigModule`, `ApiAuthModule`, `ApiThrottlerModule`, `ApiObservabilityModule` (+37 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 2`** (40 nodes): `AppConfigService`, `.builtAt()`, `.constructor()`, `.corsOriginWeb()`, `.cronIpAllowlistRaw()`, `.cronSharedSecret()`, `.databasePoolMax()`, `.databaseUrl()`, `.enableTestEndpoints()`, `.generationDailyUsdCeiling()`, `.generationDefaultAuthorId()`, `.generationKillSwitch()`, `.generationPerRunTokenBudget()`, `.gitSha()`, `.inngestEventKey()`, `.inngestKeysOptional()`, `.inngestServePath()`, `.inngestSigningKey()`, `.logLevel()`, `.nodeEnv()`, `.perplexityApiKey()`, `.perplexityTimeoutMs()`, `.perplexityUsdPerMtokensCompletion()`, `.perplexityUsdPerMtokensPrompt()`, `.port()`, `.releaseTag()`, `.resendApiKey()`, `.revalidateSharedSecret()`, `.sentryDsn()`, `.supabaseCorsOrigin()`, `.supabaseSecretKey()`, `.supabaseUrl()`, `.throttlerAdmin()`, `.throttlerPublicRead()`, `.throttlerPublicWrite()`, `.trustProxy()`, `applySecurityMiddleware()`, `isInngestPath()`, `app-config.service.ts`, `apply-security.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (18 nodes): `GenerationRepository`, `.completeStep()`, `.constructor()`, `.countSucceededSteps()`, `.createDraftArticle()`, `.createJob()`, `.findTranslationId()`, `.getStepOutput()`, `.linkJobToArticle()`, `.listCitationPayloads()`, `.markJobFailed()`, `.markJobRunning()`, `.markJobSucceeded()`, `.monthlySpendUtc()`, `.replaceCitations()`, `.requireJob()`, `.updateArticleTokenTotal()`, `.upsertTranslation()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (13 nodes): `error.tsx`, `newsletter-sticky.tsx`, `privacy-policy-dialog.tsx`, `site-header.tsx`, `skip-to-content.tsx`, `theme-toggle.tsx`, `request.ts`, `next-intl i18n`, `navItemActive()`, `SkipToContent()`, `applyForcedClass()`, `setCookie()`, `ThemeToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (11 nodes): `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `ArticleBySlugPage()`, `generateMetadata()`, `NewsBySlugPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (6 nodes): `DrizzleModule`, `.constructor()`, `.forRoot()`, `.forRootAsync()`, `.onModuleDestroy()`, `drizzle.module.ts`
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
- **Thin community `Community 24`** (3 nodes): `reset.ts`, `connectionOptions()`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (3 nodes): `middleware.ts`, `middleware()`, `stripLocalePrefix()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (3 nodes): `sentry-breadcrumb.interceptor.ts`, `SentryHttpBreadcrumbInterceptor`, `.intercept()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `AppService`, `.getData()`, `app.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `revalidate.controller.ts`, `RevalidateController`, `.trigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (2 nodes): `core.module.ts`, `CoreModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (2 nodes): `AppConfigModule`, `app-config.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (2 nodes): `ApiAuthModule`, `api-auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (2 nodes): `ApiThrottlerModule`, `api-throttler.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (2 nodes): `ApiObservabilityModule`, `api-observability.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (2 nodes): `ApiLoggingModule`, `api-logging.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (2 nodes): `AppModule`, `app.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (2 nodes): `revalidate-path.dto.ts`, `RevalidatePathDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (2 nodes): `newsletter-subscribe.dto.ts`, `NewsletterSubscribeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (2 nodes): `post-internal-articles-generate.dto.ts`, `PostInternalArticlesGenerateDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Homepage & Blog Navigation` and `Mandatory AdSense Pages`?**
  _Edge tagged AMBIGUOUS (relation: cross_cutting_homepage_signals) - confidence is low._
- **Why does `Drizzle ORM` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `Database & Data Layer` connect `Community 1` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Web Foundation` connect `Community 1` to `Community 9`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `CoreModule`, `AppConfigModule`, `ApiAuthModule` to the rest of the system?**
  _42 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
