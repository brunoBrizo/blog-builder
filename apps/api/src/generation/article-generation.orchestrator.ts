import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

import {
  type Step1ResearchResponse,
  type Step2CompetitorResponse,
  type Step3OutlineResponse,
  type Step4WriteResponse,
  type Step5HumanizeResponse,
  type Step6SeoResponse,
  type Step7TranslatePtResponse,
  type Step8TranslateEsResponse,
  Step4WriteResponseSchema,
  buildStep1Research,
  buildStep2Competitor,
  buildStep3Outline,
  buildStep4Write,
  buildStep5Humanize,
  buildStep6Seo,
  buildStep7TranslatePt,
  buildStep8TranslateEs,
} from '@blog-builder/prompts';

import { AppConfigService } from '../core/config/app-config.service';
import { BudgetService } from './budget.service';
import { GenerationRepository } from './generation.repository';
import {
  BudgetExceededError,
  KillSwitchError,
  PerplexityValidationError,
} from './generation.errors';
import { KillSwitchService } from './kill-switch.service';
import {
  markdownToHtml,
  readingMinutesFromWordCount,
  wordCountFromMarkdown,
} from './markdown.util';
import { PerplexityClient } from './perplexity.client';
import { WebIsrRevalidationService } from './web-isr-revalidation.service';

function pickBestResearchTopic(
  research: Step1ResearchResponse,
): Step1ResearchResponse['topics'][number] {
  const topics = [...research.topics];
  topics.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const best = topics[0];
  if (!best) {
    throw new PerplexityValidationError('No topics in research output');
  }
  return best;
}

function slugify(raw: string): string {
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return s.length > 0 ? s : 'article';
}

function searchToCitations(
  search:
    | {
        url: string;
        title?: string;
        date?: string;
        last_updated?: string;
      }[]
    | undefined,
): { url: string; title?: string; snippet?: string }[] {
  if (!search?.length) {
    return [];
  }
  return search.map((r) => {
    const row: { url: string; title?: string; snippet?: string } = {
      url: r.url,
    };
    if (r.title !== undefined) {
      row.title = r.title;
    }
    const snippet = r.date ?? r.last_updated;
    if (snippet !== undefined) {
      row.snippet = snippet;
    }
    return row;
  });
}

function normalizePerplexitySearchForCitations(
  rows:
    | {
        url: string;
        title?: string | undefined;
        date?: string | undefined;
        last_updated?: string | undefined;
      }[]
    | undefined,
): Parameters<typeof searchToCitations>[0] {
  if (!rows?.length) {
    return [];
  }
  return rows.map((r) => {
    const o: {
      url: string;
      title?: string;
      date?: string;
      last_updated?: string;
    } = { url: r.url };
    if (r.title !== undefined) {
      o.title = r.title;
    }
    if (r.date !== undefined) {
      o.date = r.date;
    }
    if (r.last_updated !== undefined) {
      o.last_updated = r.last_updated;
    }
    return o;
  });
}

function pickCitationsFromStepOutput(
  o: Record<string, unknown> | null,
): { url: string; title?: string; snippet?: string }[] {
  const c = o?.['_citations'];
  if (!Array.isArray(c)) {
    return [];
  }
  return c.filter(
    (x): x is { url: string; title?: string; snippet?: string } =>
      typeof x === 'object' &&
      x !== null &&
      'url' in x &&
      typeof (x as { url: string }).url === 'string',
  );
}

@Injectable()
export class ArticleGenerationOrchestratorService {
  private readonly logger = new Logger(
    ArticleGenerationOrchestratorService.name,
  );

  constructor(
    private readonly cfg: AppConfigService,
    private readonly perplexity: PerplexityClient,
    private readonly repo: GenerationRepository,
    private readonly budget: BudgetService,
    private readonly killSwitch: KillSwitchService,
    private readonly webIsr: WebIsrRevalidationService,
  ) {}

  private logStep(meta: {
    jobId: string;
    runId?: string;
    step: string;
    tokens: number;
    costUsd: string;
    durationMs: number;
    status: 'ok' | 'error';
  }): void {
    this.logger.log({
      msg: 'generation_step',
      jobId: meta.jobId,
      ...(meta.runId !== undefined ? { runId: meta.runId } : {}),
      step: meta.step,
      tokens: meta.tokens,
      costUsd: meta.costUsd,
      durationMs: meta.durationMs,
      status: meta.status,
    });
  }

  private async persistAndRefreshBudget(args: {
    jobId: string;
    stepOrder: number;
    stepName: Parameters<GenerationRepository['completeStep']>[0]['stepName'];
    locale?: 'en' | 'pt-BR' | 'es' | null;
    model: string;
    stepInput: Record<string, unknown>;
    stepOutput: Record<string, unknown>;
    tokensIn: number;
    tokensOut: number;
    costUsd: string;
    runId?: string;
    stepLabel: string;
    started: number;
  }): Promise<void> {
    await this.repo.completeStep({
      jobId: args.jobId,
      stepOrder: args.stepOrder,
      stepName: args.stepName,
      locale: args.locale ?? null,
      model: args.model,
      stepInput: args.stepInput,
      stepOutput: args.stepOutput,
      tokensInput: args.tokensIn,
      tokensOutput: args.tokensOut,
      costUsd: args.costUsd,
    });
    const job = await this.repo.requireJob(args.jobId);
    this.budget.assertWithinRunTokenBudget(job.totalTokens);
    this.logStep({
      jobId: args.jobId,
      ...(args.runId !== undefined ? { runId: args.runId } : {}),
      step: args.stepLabel,
      tokens: job.totalTokens,
      costUsd: job.totalCostUsd,
      durationMs: Date.now() - args.started,
      status: 'ok',
    });
  }

  async runStep1Research(
    jobId: string,
    runId?: string,
  ): Promise<Step1ResearchResponse> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    await this.budget.assertWithinDailyCeiling();
    const job = await this.repo.requireJob(jobId);
    await this.repo.markJobRunning(jobId);
    const built = buildStep1Research({ topicSeed: job.topic });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 1,
      stepName: 'topic_research',
      model: 'sonar-pro',
      stepInput: { phase: 'topic_research' },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '1-research',
      started,
    });
    return result.data;
  }

  async runStep2Competitor(
    jobId: string,
    research: Step1ResearchResponse,
    runId?: string,
  ): Promise<Step2CompetitorResponse> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const pick = pickBestResearchTopic(research);
    const built = buildStep2Competitor({
      primaryKeyword: pick.primaryLongTailKeyword,
      title: pick.suggestedTitle,
    });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 2,
      stepName: 'fact_check',
      model: 'sonar-pro',
      stepInput: { phase: 'competitor' },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '2-competitor',
      started,
    });
    return result.data;
  }

  async runStep3Outline(
    jobId: string,
    research: Step1ResearchResponse,
    competitor: Step2CompetitorResponse,
    runId?: string,
  ): Promise<Step3OutlineResponse> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const pick = pickBestResearchTopic(research);
    const built = buildStep3Outline({
      title: pick.suggestedTitle,
      primaryKeyword: pick.primaryLongTailKeyword,
      secondaryKeywords: pick.secondaryKeywords,
      competitor,
    });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 3,
      stepName: 'outline',
      model: 'sonar-pro',
      stepInput: { phase: 'outline' },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '3-outline',
      started,
    });
    return result.data;
  }

  async runStep4Write(
    jobId: string,
    outline: Step3OutlineResponse,
    runId?: string,
  ): Promise<{
    write: Step4WriteResponse;
    citations: ReturnType<typeof searchToCitations>;
  }> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const built = buildStep4Write({ outline });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    const citations = searchToCitations(
      normalizePerplexitySearchForCitations(result.searchResults),
    );
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 4,
      stepName: 'drafting',
      model: 'sonar-pro',
      stepInput: { phase: 'write' },
      stepOutput: {
        ...(result.data as unknown as Record<string, unknown>),
        _citations: citations,
      },
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '4-write',
      started,
    });
    return { write: result.data, citations };
  }

  async runStep5Humanize(
    jobId: string,
    draftMarkdown: string,
    runId?: string,
  ): Promise<{
    humanized: Step5HumanizeResponse;
    citations: ReturnType<typeof searchToCitations>;
  }> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const built = buildStep5Humanize({ draftMarkdown });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    const citations = searchToCitations(
      normalizePerplexitySearchForCitations(result.searchResults),
    );
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 5,
      stepName: 'quality_review',
      model: 'sonar-pro',
      stepInput: { phase: 'humanize' },
      stepOutput: {
        ...(result.data as unknown as Record<string, unknown>),
        _citations: citations,
      },
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '5-humanize',
      started,
    });
    return { humanized: result.data, citations };
  }

  async runStep6SeoAndDraftArticle(
    jobId: string,
    humanizedMarkdown: string,
    research: Step1ResearchResponse,
    runId?: string,
  ): Promise<{
    seo: Step6SeoResponse;
    articleId: string;
    enTranslationId: string;
  }> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const pick = pickBestResearchTopic(research);
    const excerpt = humanizedMarkdown.slice(0, 500);
    const built = buildStep6Seo({
      title: pick.suggestedTitle,
      primaryKeyword: pick.primaryLongTailKeyword,
      excerpt,
    });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    const seo = result.data;
    const slug = slugify(seo.slug);
    const words = wordCountFromMarkdown(humanizedMarkdown);
    const reading = readingMinutesFromWordCount(words);
    const bodyHtml = markdownToHtml(humanizedMarkdown);
    const w4Raw = await this.repo.getStepOutput(jobId, 4);
    const w4 = Step4WriteResponseSchema.safeParse(w4Raw);
    const tldr = w4.success ? w4.data.tldr : humanizedMarkdown.slice(0, 280);
    const keyTakeaways = w4.success ? w4.data.keyTakeaways : [];
    const { articleId, enTranslationId } = await this.repo.createDraftArticle({
      jobId,
      authorId: this.cfg.generationDefaultAuthorId,
      sourcePrompt: pick.suggestedTitle,
      bodyMarkdown: humanizedMarkdown,
      bodyHtml,
      slug,
      title: pick.suggestedTitle,
      subtitle: null,
      tldr,
      keyTakeaways,
      faq: seo.faq_schema,
      metaTitle: seo.meta_title,
      metaDescription: seo.meta_description,
      ogTitle: seo.og_title,
      ogDescription: seo.og_description,
      wordCount: words,
      readingTimeMinutes: reading,
    });
    const step4 = await this.repo.getStepOutput(jobId, 4);
    const step5 = await this.repo.getStepOutput(jobId, 5);
    const c4 = pickCitationsFromStepOutput(step4);
    const c5 = pickCitationsFromStepOutput(step5);
    const merged = [...c4, ...c5];
    const seen = new Set<string>();
    const uniq = merged.filter((c) => {
      if (seen.has(c.url)) {
        return false;
      }
      seen.add(c.url);
      return true;
    });
    await this.repo.replaceCitations(enTranslationId, uniq);
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 6,
      stepName: 'seo_meta',
      model: 'sonar-pro',
      stepInput: { phase: 'seo', articleId },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '6-seo',
      started,
    });
    const job = await this.repo.requireJob(jobId);
    await this.repo.updateArticleTokenTotal(articleId, job.totalTokens);
    return { seo, articleId, enTranslationId };
  }

  async runStep7TranslatePt(
    jobId: string,
    articleId: string,
    humanizedMarkdown: string,
    seo: Step6SeoResponse,
    runId?: string,
  ): Promise<Step7TranslatePtResponse> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const built = buildStep7TranslatePt({
      articleMarkdown: humanizedMarkdown,
      seo,
    });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    const tr = result.data;
    const words = wordCountFromMarkdown(tr.articleMarkdown);
    const reading = readingMinutesFromWordCount(words);
    const trId = await this.repo.upsertTranslation({
      articleId,
      locale: 'pt-BR',
      slug: slugify(tr.slug),
      title: tr.title,
      subtitle: tr.subtitle,
      tldr: tr.tldr,
      keyTakeaways: tr.keyTakeaways,
      bodyMarkdown: tr.articleMarkdown,
      bodyHtml: markdownToHtml(tr.articleMarkdown),
      faq: tr.faq,
      metaTitle: tr.meta_title,
      metaDescription: tr.meta_description,
      ogTitle: tr.og_title,
      ogDescription: tr.og_description,
      readingTimeMinutes: reading,
    });
    const enId = await this.repo.findTranslationId(articleId, 'en');
    if (enId) {
      const enCites = await this.repo.listCitationPayloads(enId);
      await this.repo.replaceCitations(trId, enCites);
    }
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 7,
      stepName: 'translation',
      locale: 'pt-BR',
      model: 'sonar-pro',
      stepInput: { phase: 'translate_pt' },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '7-translate-pt-br',
      started,
    });
    return tr;
  }

  async runStep8TranslateEs(
    jobId: string,
    articleId: string,
    humanizedMarkdown: string,
    seo: Step6SeoResponse,
    runId?: string,
  ): Promise<Step8TranslateEsResponse> {
    const started = Date.now();
    this.killSwitch.assertOpen();
    const built = buildStep8TranslateEs({
      articleMarkdown: humanizedMarkdown,
      seo,
    });
    const result = await this.perplexity.chat({
      system: built.system,
      user: built.user,
      params: built.params,
      responseSchema: built.responseSchema,
    });
    const tr = result.data;
    const words = wordCountFromMarkdown(tr.articleMarkdown);
    const reading = readingMinutesFromWordCount(words);
    const trId = await this.repo.upsertTranslation({
      articleId,
      locale: 'es',
      slug: slugify(tr.slug),
      title: tr.title,
      subtitle: tr.subtitle,
      tldr: tr.tldr,
      keyTakeaways: tr.keyTakeaways,
      bodyMarkdown: tr.articleMarkdown,
      bodyHtml: markdownToHtml(tr.articleMarkdown),
      faq: tr.faq,
      metaTitle: tr.meta_title,
      metaDescription: tr.meta_description,
      ogTitle: tr.og_title,
      ogDescription: tr.og_description,
      readingTimeMinutes: reading,
    });
    const enId = await this.repo.findTranslationId(articleId, 'en');
    if (enId) {
      const enCites = await this.repo.listCitationPayloads(enId);
      await this.repo.replaceCitations(trId, enCites);
    }
    await this.persistAndRefreshBudget({
      jobId,
      stepOrder: 8,
      stepName: 'translation',
      locale: 'es',
      model: 'sonar-pro',
      stepInput: { phase: 'translate_es' },
      stepOutput: result.data as unknown as Record<string, unknown>,
      tokensIn: result.promptTokens,
      tokensOut: result.completionTokens,
      costUsd: result.costUsd,
      ...(runId !== undefined ? { runId } : {}),
      stepLabel: '8-translate-es',
      started,
    });
    return tr;
  }

  async markFailed(
    jobId: string,
    err: unknown,
    inngestRunId?: string,
  ): Promise<void> {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'unknown';
    await this.repo.markJobFailed(jobId, message, {
      failureClass: 'non_retriable',
    });
    await this.repo.releaseReservedTopicForJob(jobId);
    if (err instanceof Error) {
      Sentry.captureException(err, {
        tags: {
          jobId,
          ...(inngestRunId ? { inngestRunId } : {}),
        },
      });
    }
  }

  async markSucceeded(jobId: string): Promise<void> {
    await this.repo.markJobSucceeded(jobId);
    const job = await this.repo.requireJob(jobId);
    if (job.articleId) {
      await this.repo.updateArticleTokenTotal(job.articleId, job.totalTokens);
    }
    if (job.autoPublish && job.articleId) {
      await this.repo.publishArticle(job.articleId);
      await this.repo.markTopicQueueConsumedForJob(jobId, job.articleId);
      await this.webIsr.revalidateAfterPublish(job.articleId);
    }
  }

  /** After Inngest exhausts retries for a retriable pipeline error. */
  async recordInngestExhaustedFailure(
    jobId: string,
    err: unknown,
  ): Promise<void> {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'unknown';
    const job = await this.repo.requireJob(jobId);
    const isScheduled = job.triggerKind === 'scheduled';
    await this.repo.markJobFailed(jobId, message.slice(0, 2000), {
      failureClass: isScheduled ? 'transient' : 'non_retriable',
      retryAfter: isScheduled ? new Date(Date.now() + 86_400_000) : null,
    });
    await this.repo.releaseReservedTopicForJob(jobId);
    if (err instanceof Error) {
      Sentry.captureException(err, {
        tags: { jobId, source: 'inngest_onFailure' },
      });
    }
  }

  mapToNonRetriable(err: unknown): boolean {
    return (
      err instanceof KillSwitchError ||
      err instanceof BudgetExceededError ||
      err instanceof PerplexityValidationError
    );
  }
}
