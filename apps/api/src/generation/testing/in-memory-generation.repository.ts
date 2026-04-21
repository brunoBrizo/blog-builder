import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';

type Locale = 'en' | 'pt-BR' | 'es';

type StepName =
  | 'topic_research'
  | 'fact_check'
  | 'outline'
  | 'drafting'
  | 'quality_review'
  | 'seo_meta'
  | 'translation';

type JobRow = {
  id: string;
  topic: string;
  targetLocales: Locale[];
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  totalTokens: number;
  totalCostUsd: string;
  articleId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  error: string | null;
};

type StepRow = {
  jobId: string;
  stepOrder: number;
  stepName: StepName;
  locale: Locale | null;
  status: 'succeeded';
  output: Record<string, unknown>;
  tokensInput: number;
  tokensOutput: number;
  costUsd: string;
};

type TranslationRow = {
  id: string;
  articleId: string;
  locale: Locale;
  slug: string;
};

/**
 * In-memory double for pipeline tests (no Postgres). Not wired in production.
 */
@Injectable()
export class InMemoryGenerationRepository {
  private readonly jobs = new Map<string, JobRow>();
  private readonly steps = new Map<string, StepRow>();
  private readonly articles = new Map<
    string,
    { id: string; tokenCostTotal: number }
  >();
  private readonly translations = new Map<string, TranslationRow>();
  private readonly citations = new Map<
    string,
    { url: string; title?: string; snippet?: string }[]
  >();

  async createJob(input: {
    topic: string;
    targetLocales: Locale[];
  }): Promise<string> {
    const id = randomUUID();
    this.jobs.set(id, {
      id,
      topic: input.topic,
      targetLocales: input.targetLocales,
      status: 'pending',
      totalTokens: 0,
      totalCostUsd: '0.000000',
      articleId: null,
      startedAt: null,
      completedAt: null,
      error: null,
    });
    return id;
  }

  async requireJob(jobId: string): Promise<JobRow> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`generation job not found: ${jobId}`);
    }
    return job;
  }

  async markJobRunning(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }
    job.status = 'running';
    job.startedAt = job.startedAt ?? new Date();
  }

  async markJobSucceeded(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }
    job.status = 'succeeded';
    job.completedAt = new Date();
    job.error = null;
  }

  async markJobFailed(jobId: string, message: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }
    job.status = 'failed';
    job.completedAt = new Date();
    job.error = message.slice(0, 2000);
  }

  async linkJobToArticle(jobId: string, articleId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      job.articleId = articleId;
    }
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
    const key = `${input.jobId}:${input.stepOrder}`;
    this.steps.set(key, {
      jobId: input.jobId,
      stepOrder: input.stepOrder,
      stepName: input.stepName,
      locale: input.locale ?? null,
      status: 'succeeded',
      output: input.stepOutput,
      tokensInput: input.tokensInput,
      tokensOutput: input.tokensOutput,
      costUsd: input.costUsd,
    });
    this.recomputeJobTotals(input.jobId);
  }

  private recomputeJobTotals(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }
    let totalTokens = 0;
    let totalCost = 0;
    for (const s of this.steps.values()) {
      if (s.jobId !== jobId || s.status !== 'succeeded') {
        continue;
      }
      totalTokens += s.tokensInput + s.tokensOutput;
      totalCost += Number(s.costUsd);
    }
    job.totalTokens = totalTokens;
    job.totalCostUsd = totalCost.toFixed(6);
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
    const articleId = randomUUID();
    const enTranslationId = randomUUID();
    this.articles.set(articleId, { id: articleId, tokenCostTotal: 0 });
    this.translations.set(`${articleId}:en`, {
      id: enTranslationId,
      articleId,
      locale: 'en',
      slug: input.slug,
    });
    const job = this.jobs.get(input.jobId);
    if (job) {
      job.articleId = articleId;
    }
    return { articleId, enTranslationId };
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
    const key = `${input.articleId}:${input.locale}`;
    const existing = this.translations.get(key);
    const id = existing?.id ?? randomUUID();
    this.translations.set(key, {
      id,
      articleId: input.articleId,
      locale: input.locale,
      slug: input.slug,
    });
    return id;
  }

  async replaceCitations(
    articleTranslationId: string,
    citations: { url: string; title?: string; snippet?: string }[],
  ): Promise<void> {
    this.citations.set(articleTranslationId, [...citations]);
  }

  async updateArticleTokenTotal(
    articleId: string,
    tokenTotal: number,
  ): Promise<void> {
    const a = this.articles.get(articleId);
    if (a) {
      a.tokenCostTotal = tokenTotal;
    }
  }

  async monthlySpendUtc(
    _year: number,
    _monthIndex0: number,
  ): Promise<{ monthSpendUsd: string; jobCount: number }> {
    void _year;
    void _monthIndex0;
    return { monthSpendUsd: '0', jobCount: 0 };
  }

  async countSucceededSteps(jobId: string): Promise<number> {
    let n = 0;
    for (const s of this.steps.values()) {
      if (s.jobId === jobId && s.status === 'succeeded') {
        n += 1;
      }
    }
    return n;
  }

  async getStepOutput(
    jobId: string,
    stepOrder: number,
  ): Promise<Record<string, unknown> | null> {
    const s = this.steps.get(`${jobId}:${stepOrder}`);
    return s?.output ?? null;
  }

  async findTranslationId(
    articleId: string,
    locale: Locale,
  ): Promise<string | null> {
    return this.translations.get(`${articleId}:${locale}`)?.id ?? null;
  }

  async listCitationPayloads(
    translationId: string,
  ): Promise<{ url: string; title?: string; snippet?: string }[]> {
    return this.citations.get(translationId) ?? [];
  }

  /** Test helper: translations stored per article/locale. */
  listTranslationLocales(articleId: string): Locale[] {
    const locales: Locale[] = [];
    for (const row of this.translations.values()) {
      if (row.articleId === articleId) {
        locales.push(row.locale);
      }
    }
    return locales;
  }
}
