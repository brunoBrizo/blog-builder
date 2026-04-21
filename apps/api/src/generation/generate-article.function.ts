import { Inngest } from 'inngest';

import { ArticleGenerationOrchestratorService } from './article-generation.orchestrator';
import { executeArticleGenerationPipeline } from './article-generation.pipeline';

export function createGenerateArticleFunction(
  inngest: Inngest,
  orchestrator: ArticleGenerationOrchestratorService,
): ReturnType<Inngest['createFunction']> {
  return inngest.createFunction(
    {
      id: 'generate-article',
      name: 'Generate article (Perplexity pipeline)',
      retries: 3,
      concurrency: { limit: 3 },
      throttle: { limit: 10, period: '1m' },
      triggers: [{ event: 'article/generation.requested' }],
    },
    async ({ event, step, runId }) => {
      const { jobId } = event.data as {
        jobId: string;
        topicSeed: string;
        locales: ('en' | 'pt-BR' | 'es')[];
        autoPublish?: boolean;
      };
      const rid = typeof runId === 'string' ? runId : undefined;
      const args =
        rid !== undefined ? { jobId, step, runId: rid } : { jobId, step };
      return executeArticleGenerationPipeline(args, orchestrator);
    },
  );
}
