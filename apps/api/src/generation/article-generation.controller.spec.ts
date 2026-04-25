import { Test } from '@nestjs/testing';
import { Inngest } from 'inngest';

jest.mock('../core/auth/cron-auth.guard', () => {
  return {
    CronAuthGuard: class {
      canActivate() {
        return true;
      }
    },
  };
});

import { ArticleGenerationController } from './article-generation.controller';
import { GenerationRepository } from './generation.repository';
import { TopicQueueService } from './topic-queue.service';
import { AppConfigService } from '../core/config/app-config.service';
import { INNGEST_CLIENT } from './generation.tokens';
import { InMemoryGenerationRepository } from './testing/in-memory-generation.repository';

const appConfigStub = {
  generationTopicQueueMinDepth: 3,
  generationSchedulerTopicSeed: 'test seed',
} as unknown as AppConfigService;

const inngestStub = {
  send: jest.fn().mockResolvedValue(undefined),
} as unknown as Inngest;

const topicQueueStub = {
  ensureMinDepth: jest.fn().mockResolvedValue(undefined),
} as unknown as TopicQueueService;

async function createController(
  repo: InMemoryGenerationRepository,
): Promise<ArticleGenerationController> {
  const moduleRef = await Test.createTestingModule({
    controllers: [ArticleGenerationController],
    providers: [
      { provide: AppConfigService, useValue: appConfigStub },
      {
        provide: GenerationRepository,
        useValue: repo as unknown as GenerationRepository,
      },
      { provide: TopicQueueService, useValue: topicQueueStub },
      { provide: INNGEST_CLIENT, useValue: inngestStub },
    ],
  }).compile();
  return moduleRef.get(ArticleGenerationController);
}

describe('ArticleGenerationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST generate', () => {
    it('manual seed creates manual job with autoPublish=false by default', async () => {
      const repo = new InMemoryGenerationRepository();
      const controller = await createController(repo);

      const out = await controller.generate({
        topicSeed: 'AI trends',
        locales: ['en', 'pt-BR', 'es'],
      });

      const job = await repo.requireJob(out.jobId);
      expect(job.triggerKind).toBe('manual');
      expect(job.autoPublish).toBe(false);
      expect(job.topic).toBe('AI trends');
      expect(inngestStub.send).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'article/generation.requested',
          data: expect.objectContaining({
            jobId: out.jobId,
            topicSeed: 'AI trends',
            autoPublish: false,
          }),
        }),
      );
    });

    it('scheduled mode (no seed) uses topic queue and sets autoPublish=true', async () => {
      const repo = new InMemoryGenerationRepository();
      // Seed a topic so reserveScheduledTopicAndCreateJob has something to pick
      // Since the in-memory stub returns null, we need to override the method
      const controller = await createController(repo);
      jest
        .spyOn(
          repo as InMemoryGenerationRepository,
          'reserveScheduledTopicAndCreateJob',
        )
        .mockResolvedValueOnce('queued-job-id');
      jest
        .spyOn(repo as InMemoryGenerationRepository, 'requireJob')
        .mockResolvedValueOnce({
          id: 'queued-job-id',
          topic: 'Queued Topic',
          targetLocales: ['en', 'pt-BR', 'es'],
          triggerKind: 'scheduled',
          autoPublish: true,
          failureClass: null,
          retryAfter: null,
          retryAttempt: 0,
          status: 'pending',
          totalTokens: 0,
          totalCostUsd: '0',
          articleId: null,
          startedAt: null,
          completedAt: null,
          error: null,
        } as unknown as ReturnType<InMemoryGenerationRepository['requireJob']>);

      const out = await controller.generate({
        locales: ['en', 'pt-BR', 'es'],
      });

      expect(out.jobId).toBe('queued-job-id');
      expect(topicQueueStub.ensureMinDepth).toHaveBeenCalledWith(3);
      expect(inngestStub.send).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'article/generation.requested',
          data: expect.objectContaining({
            jobId: 'queued-job-id',
            topicSeed: 'Queued Topic',
            autoPublish: true,
          }),
        }),
      );
    });
  });

  describe('POST generation/retry', () => {
    it('retries only scheduled transient failed jobs', async () => {
      const repo = new InMemoryGenerationRepository();
      const controller = await createController(repo);

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

      const result = await controller.retryFailed({ limit: 10 });

      expect(result.retried).toBe(1);
      expect(result.jobIds).toContain(scheduledId);
      expect(result.jobIds).not.toContain(manualId);
    });
  });
});
