jest.mock('@sentry/nestjs', () => {
  const actual = jest.requireActual('@sentry/nestjs') as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    captureException: jest.fn(),
  };
});

import { Test } from '@nestjs/testing';

import { AppConfigService } from '../core/config/app-config.service';
import { ArticleGenerationOrchestratorService } from './article-generation.orchestrator';
import { GenerationRepository } from './generation.repository';
import { BudgetService } from './budget.service';
import { KillSwitchService } from './kill-switch.service';
import { PerplexityClient } from './perplexity.client';
import { WebIsrRevalidationService } from './web-isr-revalidation.service';
import { InMemoryGenerationRepository } from './testing/in-memory-generation.repository';

const authorId = 'b1111111-1111-4111-8111-111111111111';

const appConfigStub = {
  generationDefaultAuthorId: authorId,
  perplexityTimeoutMs: 30_000,
  perplexityUsdPerMtokensPrompt: 3,
  perplexityUsdPerMtokensCompletion: 15,
} as unknown as AppConfigService;

const webIsrStub = {
  revalidateAfterPublish: jest.fn().mockResolvedValue(undefined),
} as unknown as WebIsrRevalidationService;

function noopBudget(): BudgetService {
  return {
    assertWithinDailyCeiling: jest.fn().mockResolvedValue(undefined),
    assertWithinRunTokenBudget: jest.fn(),
  } as unknown as BudgetService;
}

function killSwitchOpen(): KillSwitchService {
  return { assertOpen: jest.fn() } as unknown as KillSwitchService;
}

async function createOrchestrator(
  repo: InMemoryGenerationRepository,
): Promise<ArticleGenerationOrchestratorService> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      { provide: AppConfigService, useValue: appConfigStub },
      {
        provide: GenerationRepository,
        useValue: repo as unknown as GenerationRepository,
      },
      { provide: PerplexityClient, useValue: { chat: jest.fn() } },
      { provide: BudgetService, useValue: noopBudget() },
      { provide: KillSwitchService, useValue: killSwitchOpen() },
      { provide: WebIsrRevalidationService, useValue: webIsrStub },
      ArticleGenerationOrchestratorService,
    ],
  }).compile();
  return moduleRef.get(ArticleGenerationOrchestratorService);
}

describe('ArticleGenerationOrchestratorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordInngestExhaustedFailure', () => {
    it('marks scheduled jobs as transient with retryAfter', async () => {
      const repo = new InMemoryGenerationRepository();
      const orchestrator = await createOrchestrator(repo);
      const jobId = await repo.createJob({
        topic: 'AI tools',
        targetLocales: ['en'],
        triggerKind: 'scheduled',
        autoPublish: true,
      });

      await orchestrator.recordInngestExhaustedFailure(
        jobId,
        new Error('perplexity down'),
      );

      const job = await repo.requireJob(jobId);
      expect(job.status).toBe('failed');
      expect(job.failureClass).toBe('transient');
      expect(job.retryAfter).toBeInstanceOf(Date);
    });

    it('marks manual jobs as non_retriable without retryAfter', async () => {
      const repo = new InMemoryGenerationRepository();
      const orchestrator = await createOrchestrator(repo);
      const jobId = await repo.createJob({
        topic: 'AI tools',
        targetLocales: ['en'],
        triggerKind: 'manual',
        autoPublish: false,
      });

      await orchestrator.recordInngestExhaustedFailure(
        jobId,
        new Error('perplexity down'),
      );

      const job = await repo.requireJob(jobId);
      expect(job.status).toBe('failed');
      expect(job.failureClass).toBe('non_retriable');
      expect(job.retryAfter).toBeNull();
    });
  });

  describe('listRetryableFailedJobs (via repository)', () => {
    it('returns only scheduled transient failed jobs', async () => {
      const repo = new InMemoryGenerationRepository();

      const scheduledId = await repo.createJob({
        topic: 's1',
        targetLocales: ['en'],
        triggerKind: 'scheduled',
      });
      await repo.markJobFailed(scheduledId, 'fail', {
        failureClass: 'transient',
        retryAfter: new Date(Date.now() - 1),
      });

      const manualId = await repo.createJob({
        topic: 's2',
        targetLocales: ['en'],
        triggerKind: 'manual',
      });
      await repo.markJobFailed(manualId, 'fail', {
        failureClass: 'transient',
        retryAfter: new Date(Date.now() - 1),
      });

      const retryable = await repo.listRetryableFailedJobs(10);
      expect(retryable).toContain(scheduledId);
      expect(retryable).not.toContain(manualId);
    });
  });
});
