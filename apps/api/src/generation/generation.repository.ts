import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gte, isNotNull, lt, sql } from 'drizzle-orm';

import {
  DRIZZLE,
  type Database,
  articleCitations,
  articles,
  articleTranslations,
  generationJobs,
  generationSteps,
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

@Injectable()
export class GenerationRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async createJob(input: {
    topic: string;
    targetLocales: Locale[];
  }): Promise<string> {
    const [row] = await this.db
      .insert(generationJobs)
      .values({
        topic: input.topic,
        targetLocales: input.targetLocales,
        status: 'pending',
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
      })
      .where(eq(generationJobs.id, jobId));
  }

  async markJobFailed(jobId: string, message: string): Promise<void> {
    await this.db
      .update(generationJobs)
      .set({
        status: 'failed',
        completedAt: new Date(),
        error: message.slice(0, 2000),
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
}
