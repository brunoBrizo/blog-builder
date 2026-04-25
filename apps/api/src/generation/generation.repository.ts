import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
} from 'drizzle-orm';

import {
  DRIZZLE,
  type Database,
  articleCitations,
  articles,
  articleTranslations,
  generationJobs,
  generationSteps,
  topicQueue,
} from '@blog-builder/db';

type Locale = 'en' | 'pt-BR' | 'es';

type StepName =
  | 'topic_research'
  | 'fact_check'
  | 'outline'
  | 'drafting'
  | 'quality_review'
  | 'seo_meta'
  | 'translation';

/** Advisory lock key for scheduled dequeue (must not collide with other app locks). */
export const SCHEDULED_GENERATION_ADVISORY_LOCK_KEY = 923_814_201;

export function normalizeTopicQueueKey(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 500);
}

@Injectable()
export class GenerationRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async createJob(input: {
    topic: string;
    targetLocales: Locale[];
    triggerKind?: 'manual' | 'scheduled';
    autoPublish?: boolean;
  }): Promise<string> {
    const [row] = await this.db
      .insert(generationJobs)
      .values({
        topic: input.topic,
        targetLocales: input.targetLocales,
        status: 'pending',
        triggerKind: input.triggerKind ?? 'manual',
        autoPublish: input.autoPublish ?? false,
      })
      .returning({ id: generationJobs.id });
    if (!row) {
      throw new Error('Failed to create generation job');
    }
    return row.id;
  }

  async requireJob(jobId: string) {
    const [job] = await this.db
      .select()
      .from(generationJobs)
      .where(eq(generationJobs.id, jobId))
      .limit(1);
    if (!job) {
      throw new Error(`generation job not found: ${jobId}`);
    }
    return job;
  }

  async markJobRunning(jobId: string): Promise<void> {
    await this.db
      .update(generationJobs)
      .set({
        status: 'running',
        startedAt: sql`coalesce(${generationJobs.startedAt}, now())`,
      })
      .where(eq(generationJobs.id, jobId));
  }

  async markJobSucceeded(jobId: string): Promise<void> {
    await this.db
      .update(generationJobs)
      .set({
        status: 'succeeded',
        completedAt: new Date(),
        error: null,
        failureClass: null,
        retryAfter: null,
      })
      .where(eq(generationJobs.id, jobId));
  }

  async markJobFailed(
    jobId: string,
    message: string,
    opts?: { failureClass?: string | null; retryAfter?: Date | null },
  ): Promise<void> {
    await this.db
      .update(generationJobs)
      .set({
        status: 'failed',
        completedAt: new Date(),
        error: message.slice(0, 2000),
        failureClass:
          opts?.failureClass === undefined ? null : opts.failureClass,
        retryAfter: opts?.retryAfter === undefined ? null : opts.retryAfter,
      })
      .where(eq(generationJobs.id, jobId));
  }

  async linkJobToArticle(jobId: string, articleId: string): Promise<void> {
    await this.db
      .update(generationJobs)
      .set({ articleId })
      .where(eq(generationJobs.id, jobId));
  }

  async completeStep(input: {
    jobId: string;
    stepOrder: number;
    stepName: StepName;
    locale?: Locale | null;
    model: string;
    stepInput: Record<string, unknown>;
    stepOutput: Record<string, unknown>;
    tokensInput: number;
    tokensOutput: number;
    costUsd: string;
  }): Promise<void> {
    await this.db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: generationSteps.id })
        .from(generationSteps)
        .where(
          and(
            eq(generationSteps.jobId, input.jobId),
            eq(generationSteps.stepOrder, input.stepOrder),
          ),
        )
        .limit(1);
      const now = new Date();
      const base = {
        jobId: input.jobId,
        stepName: input.stepName,
        stepOrder: input.stepOrder,
        locale: input.locale ?? null,
        status: 'succeeded' as const,
        model: input.model,
        input: input.stepInput,
        output: input.stepOutput,
        tokensInput: input.tokensInput,
        tokensOutput: input.tokensOutput,
        costUsd: input.costUsd,
        startedAt: now,
        completedAt: now,
        error: null,
      };
      if (existing[0]) {
        await tx
          .update(generationSteps)
          .set(base)
          .where(eq(generationSteps.id, existing[0].id));
      } else {
        await tx.insert(generationSteps).values(base);
      }
      const agg = await tx
        .select({
          tokens: sql<string>`coalesce(sum(${generationSteps.tokensInput} + ${generationSteps.tokensOutput}), 0)`,
          cost: sql<string>`coalesce(sum(${generationSteps.costUsd}::numeric), 0)`,
        })
        .from(generationSteps)
        .where(
          and(
            eq(generationSteps.jobId, input.jobId),
            eq(generationSteps.status, 'succeeded'),
          ),
        );
      const totalTokens = Number(agg[0]?.tokens ?? 0);
      const totalCost = String(agg[0]?.cost ?? '0');
      await tx
        .update(generationJobs)
        .set({
          totalTokens,
          totalCostUsd: totalCost,
        })
        .where(eq(generationJobs.id, input.jobId));
    });
  }

  async createDraftArticle(input: {
    jobId: string;
    authorId: string;
    sourcePrompt: string;
    bodyMarkdown: string;
    bodyHtml: string;
    slug: string;
    title: string;
    subtitle: string | null;
    tldr: string;
    keyTakeaways: string[];
    faq: { question: string; answer: string }[];
    metaTitle: string;
    metaDescription: string;
    ogTitle: string | null;
    ogDescription: string | null;
    wordCount: number;
    readingTimeMinutes: number;
  }): Promise<{ articleId: string; enTranslationId: string }> {
    return this.db.transaction(async (tx) => {
      const [article] = await tx
        .insert(articles)
        .values({
          authorId: input.authorId,
          status: 'draft',
          defaultLocale: 'en',
          sourcePrompt: input.sourcePrompt,
          wordCountTarget: 2000,
          wordCountActual: input.wordCount,
          tokenCostTotal: 0,
        })
        .returning({ id: articles.id });
      if (!article) {
        throw new Error('Failed to insert article');
      }
      const [tr] = await tx
        .insert(articleTranslations)
        .values({
          articleId: article.id,
          locale: 'en',
          slug: input.slug,
          title: input.title,
          subtitle: input.subtitle,
          tldr: input.tldr,
          keyTakeaways: input.keyTakeaways,
          bodyMarkdown: input.bodyMarkdown,
          bodyHtml: input.bodyHtml,
          faq: input.faq,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogTitle: input.ogTitle,
          ogDescription: input.ogDescription,
          readingTimeMinutes: input.readingTimeMinutes,
        })
        .returning({ id: articleTranslations.id });
      if (!tr) {
        throw new Error('Failed to insert EN translation');
      }
      await tx
        .update(generationJobs)
        .set({ articleId: article.id })
        .where(eq(generationJobs.id, input.jobId));
      return { articleId: article.id, enTranslationId: tr.id };
    });
  }

  async upsertTranslation(input: {
    articleId: string;
    locale: Locale;
    slug: string;
    title: string;
    subtitle: string | null;
    tldr: string;
    keyTakeaways: string[];
    bodyMarkdown: string;
    bodyHtml: string;
    faq: { question: string; answer: string }[];
    metaTitle: string;
    metaDescription: string;
    ogTitle: string | null;
    ogDescription: string | null;
    readingTimeMinutes: number;
  }): Promise<string> {
    const existing = await this.db
      .select({ id: articleTranslations.id })
      .from(articleTranslations)
      .where(
        and(
          eq(articleTranslations.articleId, input.articleId),
          eq(articleTranslations.locale, input.locale),
        ),
      )
      .limit(1);
    if (existing[0]) {
      await this.db
        .update(articleTranslations)
        .set({
          slug: input.slug,
          title: input.title,
          subtitle: input.subtitle,
          tldr: input.tldr,
          keyTakeaways: input.keyTakeaways,
          bodyMarkdown: input.bodyMarkdown,
          bodyHtml: input.bodyHtml,
          faq: input.faq,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogTitle: input.ogTitle,
          ogDescription: input.ogDescription,
          readingTimeMinutes: input.readingTimeMinutes,
        })
        .where(eq(articleTranslations.id, existing[0].id));
      return existing[0].id;
    }
    const [row] = await this.db
      .insert(articleTranslations)
      .values({
        articleId: input.articleId,
        locale: input.locale,
        slug: input.slug,
        title: input.title,
        subtitle: input.subtitle,
        tldr: input.tldr,
        keyTakeaways: input.keyTakeaways,
        bodyMarkdown: input.bodyMarkdown,
        bodyHtml: input.bodyHtml,
        faq: input.faq,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        ogTitle: input.ogTitle,
        ogDescription: input.ogDescription,
        readingTimeMinutes: input.readingTimeMinutes,
      })
      .returning({ id: articleTranslations.id });
    if (!row) {
      throw new Error('Failed to insert translation');
    }
    return row.id;
  }

  async replaceCitations(
    articleTranslationId: string,
    citations: { url: string; title?: string; snippet?: string }[],
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .delete(articleCitations)
        .where(eq(articleCitations.articleTranslationId, articleTranslationId));
      if (citations.length === 0) {
        return;
      }
      await tx.insert(articleCitations).values(
        citations.map((c, i) => ({
          articleTranslationId,
          url: c.url,
          title: c.title ?? null,
          snippet: c.snippet ?? null,
          orderIndex: i,
        })),
      );
    });
  }

  async updateArticleTokenTotal(
    articleId: string,
    tokenTotal: number,
  ): Promise<void> {
    await this.db
      .update(articles)
      .set({ tokenCostTotal: tokenTotal })
      .where(eq(articles.id, articleId));
  }

  async monthlySpendUtc(
    year: number,
    monthIndex0: number,
  ): Promise<{
    monthSpendUsd: string;
    jobCount: number;
  }> {
    const start = new Date(Date.UTC(year, monthIndex0, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthIndex0 + 1, 1, 0, 0, 0, 0));
    const row = await this.db
      .select({
        sum: sql<string>`coalesce(sum(${generationJobs.totalCostUsd}::numeric), 0)`,
        n: sql<string>`count(*)::text`,
      })
      .from(generationJobs)
      .where(
        and(
          isNotNull(generationJobs.completedAt),
          gte(generationJobs.completedAt, start),
          lt(generationJobs.completedAt, end),
          eq(generationJobs.status, 'succeeded'),
        ),
      );
    return {
      monthSpendUsd: row[0]?.sum ?? '0',
      jobCount: Number(row[0]?.n ?? 0),
    };
  }

  async countSucceededSteps(jobId: string): Promise<number> {
    const row = await this.db
      .select({ n: sql<string>`count(*)::text` })
      .from(generationSteps)
      .where(
        and(
          eq(generationSteps.jobId, jobId),
          eq(generationSteps.status, 'succeeded'),
        ),
      );
    return Number(row[0]?.n ?? 0);
  }

  async getStepOutput(
    jobId: string,
    stepOrder: number,
  ): Promise<Record<string, unknown> | null> {
    const [row] = await this.db
      .select({ output: generationSteps.output })
      .from(generationSteps)
      .where(
        and(
          eq(generationSteps.jobId, jobId),
          eq(generationSteps.stepOrder, stepOrder),
          eq(generationSteps.status, 'succeeded'),
        ),
      )
      .limit(1);
    return (row?.output as Record<string, unknown> | null) ?? null;
  }

  async findTranslationId(
    articleId: string,
    locale: Locale,
  ): Promise<string | null> {
    const [row] = await this.db
      .select({ id: articleTranslations.id })
      .from(articleTranslations)
      .where(
        and(
          eq(articleTranslations.articleId, articleId),
          eq(articleTranslations.locale, locale),
        ),
      )
      .limit(1);
    return row?.id ?? null;
  }

  async listCitationPayloads(
    translationId: string,
  ): Promise<{ url: string; title?: string; snippet?: string }[]> {
    const rows = await this.db
      .select({
        url: articleCitations.url,
        title: articleCitations.title,
        snippet: articleCitations.snippet,
      })
      .from(articleCitations)
      .where(eq(articleCitations.articleTranslationId, translationId));
    return rows.map((r) => {
      const row: { url: string; title?: string; snippet?: string } = {
        url: r.url,
      };
      if (r.title != null) {
        row.title = r.title;
      }
      if (r.snippet != null) {
        row.snippet = r.snippet;
      }
      return row;
    });
  }

  async countAvailableTopics(): Promise<number> {
    const row = await this.db
      .select({ n: sql<string>`count(*)::text` })
      .from(topicQueue)
      .where(eq(topicQueue.status, 'available'));
    return Number(row[0]?.n ?? 0);
  }

  async insertTopicQueueCandidates(
    topics: {
      primaryLongTailKeyword: string;
      suggestedTitle: string;
      score?: number;
    }[],
  ): Promise<number> {
    let inserted = 0;
    for (const t of topics) {
      const normalizedTopic = normalizeTopicQueueKey(t.primaryLongTailKeyword);
      const displayTitle = t.suggestedTitle.trim().slice(0, 500);
      const scoreVal = String(t.score ?? 0);
      const rows = await this.db
        .insert(topicQueue)
        .values({
          normalizedTopic,
          displayTitle,
          score: scoreVal,
          source: 'research',
          status: 'available',
        })
        .onConflictDoNothing({ target: topicQueue.normalizedTopic })
        .returning({ id: topicQueue.id });
      if (rows.length > 0) {
        inserted += 1;
      }
    }
    return inserted;
  }

  /**
   * Picks next available topic under advisory lock and creates a scheduled job.
   * Excludes topics matching existing article slugs or recently failed (90d).
   * Returns null when queue is empty (caller should refill and retry).
   */
  async reserveScheduledTopicAndCreateJob(input: {
    targetLocales: Locale[];
    autoPublish: boolean;
  }): Promise<string | null> {
    return this.db.transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(${SCHEDULED_GENERATION_ADVISORY_LOCK_KEY})`,
      );

      // Build exclusion sets: existing slugs and recently-failed topics
      const slugRows = await tx
        .select({ slug: articleTranslations.slug })
        .from(articleTranslations);
      const existingSlugSet = new Set(
        slugRows.map((r) => normalizeTopicQueueKey(r.slug.replace(/-/g, ' '))),
      );

      const failedJobRows = await tx
        .select({ topic: generationJobs.topic })
        .from(generationJobs)
        .where(
          and(
            eq(generationJobs.status, 'failed'),
            gte(generationJobs.completedAt, sql`now() - interval '90 days'`),
          ),
        );
      const failedTopicSet = new Set(
        failedJobRows.map((j) => normalizeTopicQueueKey(j.topic)),
      );

      const candidates = await tx
        .select()
        .from(topicQueue)
        .where(eq(topicQueue.status, 'available'))
        .orderBy(desc(topicQueue.score), asc(topicQueue.createdAt))
        .for('update', { skipLocked: true });

      const row = candidates.find(
        (c) =>
          !existingSlugSet.has(c.normalizedTopic) &&
          !failedTopicSet.has(c.normalizedTopic),
      );
      if (!row) {
        return null;
      }

      const [job] = await tx
        .insert(generationJobs)
        .values({
          topic: row.displayTitle,
          targetLocales: input.targetLocales,
          status: 'pending',
          triggerKind: 'scheduled',
          autoPublish: input.autoPublish,
        })
        .returning({ id: generationJobs.id });
      if (!job) {
        throw new Error('Failed to insert generation job');
      }
      await tx
        .update(topicQueue)
        .set({
          status: 'reserved',
          generationJobId: job.id,
          updatedAt: new Date(),
        })
        .where(eq(topicQueue.id, row.id));
      return job.id;
    });
  }

  async releaseReservedTopicForJob(jobId: string): Promise<void> {
    await this.db
      .update(topicQueue)
      .set({
        status: 'available',
        generationJobId: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(topicQueue.generationJobId, jobId),
          eq(topicQueue.status, 'reserved'),
        ),
      );
  }

  async markTopicQueueConsumedForJob(
    jobId: string,
    articleId: string,
  ): Promise<void> {
    await this.db
      .update(topicQueue)
      .set({
        status: 'consumed',
        articleId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(topicQueue.generationJobId, jobId),
          eq(topicQueue.status, 'reserved'),
        ),
      );
  }

  async publishArticle(articleId: string): Promise<void> {
    await this.db
      .update(articles)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId));
  }

  async listTranslationSlugsForArticle(
    articleId: string,
  ): Promise<{ locale: Locale; slug: string }[]> {
    return this.db
      .select({
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
      })
      .from(articleTranslations)
      .where(eq(articleTranslations.articleId, articleId));
  }

  async listRetryableFailedJobs(limit: number): Promise<string[]> {
    const now = new Date();
    const rows = await this.db
      .select({ id: generationJobs.id })
      .from(generationJobs)
      .where(
        and(
          eq(generationJobs.status, 'failed'),
          eq(generationJobs.triggerKind, 'scheduled'),
          eq(generationJobs.failureClass, 'transient'),
          or(
            isNull(generationJobs.retryAfter),
            lte(generationJobs.retryAfter, now),
          ),
        ),
      )
      .orderBy(asc(generationJobs.completedAt))
      .limit(limit);
    return rows.map((r) => r.id);
  }

  async resetJobToPendingForRetry(jobId: string): Promise<void> {
    const job = await this.requireJob(jobId);
    await this.db
      .update(generationJobs)
      .set({
        status: 'pending',
        error: null,
        startedAt: null,
        completedAt: null,
        failureClass: null,
        retryAfter: null,
        retryAttempt: job.retryAttempt + 1,
      })
      .where(eq(generationJobs.id, jobId));
  }
}
