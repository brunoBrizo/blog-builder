import { NonRetriableError } from 'inngest';

import { ArticleGenerationOrchestratorService } from './article-generation.orchestrator';

/**
 * Minimal step surface used by the generate-article Inngest function.
 * Tests pass a memoizing implementation to simulate Inngest `step.run` replay.
 */
export type ArticleGenerationStepTools = {
  run: <T>(stepId: string, fn: () => Promise<T>) => Promise<T>;
};

export async function executeArticleGenerationPipeline(
  args: {
    jobId: string;
    step: ArticleGenerationStepTools;
    runId?: string;
  },
  orchestrator: ArticleGenerationOrchestratorService,
): Promise<{ ok: true; jobId: string; articleId: string }> {
  const { jobId, step, runId: rid } = args;
  try {
    const research = await step.run('1-research', async () =>
      orchestrator.runStep1Research(jobId, rid),
    );
    const competitor = await step.run('2-competitor', async () =>
      orchestrator.runStep2Competitor(jobId, research, rid),
    );
    const outline = await step.run('3-outline', async () =>
      orchestrator.runStep3Outline(jobId, research, competitor, rid),
    );
    const wrote = await step.run('4-write', async () =>
      orchestrator.runStep4Write(jobId, outline, rid),
    );
    const humanized = await step.run('5-humanize', async () =>
      orchestrator.runStep5Humanize(jobId, wrote.write.articleMarkdown, rid),
    );
    const draft = await step.run('6-seo', async () =>
      orchestrator.runStep6SeoAndDraftArticle(
        jobId,
        humanized.humanized.articleMarkdown,
        research,
        rid,
      ),
    );
    await Promise.all([
      step.run('7-translate-pt-br', async () =>
        orchestrator.runStep7TranslatePt(
          jobId,
          draft.articleId,
          humanized.humanized.articleMarkdown,
          draft.seo,
          rid,
        ),
      ),
      step.run('8-translate-es', async () =>
        orchestrator.runStep8TranslateEs(
          jobId,
          draft.articleId,
          humanized.humanized.articleMarkdown,
          draft.seo,
          rid,
        ),
      ),
    ]);
    await orchestrator.markSucceeded(jobId);
    return { ok: true as const, jobId, articleId: draft.articleId };
  } catch (e) {
    if (orchestrator.mapToNonRetriable(e)) {
      await orchestrator.markFailed(jobId, e, rid);
      throw new NonRetriableError(
        e instanceof Error ? e.message : 'non-retriable generation error',
      );
    }
    throw e;
  }
}
