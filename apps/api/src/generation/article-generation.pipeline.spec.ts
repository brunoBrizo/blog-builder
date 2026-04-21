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
import { NonRetriableError } from 'inngest';

import { AppConfigService } from '../core/config/app-config.service';
import { ArticleGenerationOrchestratorService } from './article-generation.orchestrator';
import { BudgetExceededError, KillSwitchError } from './generation.errors';
import { executeArticleGenerationPipeline } from './article-generation.pipeline';
import { GenerationRepository } from './generation.repository';
import { BudgetService } from './budget.service';
import { KillSwitchService } from './kill-switch.service';
import { PerplexityClient } from './perplexity.client';
import { InMemoryGenerationRepository } from './testing/in-memory-generation.repository';
import {
  createCrashResumePerplexityStub,
  createStubPerplexityChat,
} from './testing/stub-perplexity.fixtures';

const authorId = 'b1111111-1111-4111-8111-111111111111';

const appConfigStub = {
  generationDefaultAuthorId: authorId,
  perplexityTimeoutMs: 30_000,
  perplexityUsdPerMtokensPrompt: 3,
  perplexityUsdPerMtokensCompletion: 15,
} as unknown as AppConfigService;

function createMemoizingStep(): {
  run: <T>(id: string, fn: () => Promise<T>) => Promise<T>;
} {
  const memo = new Map<string, unknown>();
  return {
    run: async <T>(id: string, fn: () => Promise<T>): Promise<T> => {
      if (memo.has(id)) {
        return memo.get(id) as T;
      }
      const v = await fn();
      memo.set(id, v);
      return v;
    },
  };
}

function noopBudget(): BudgetService {
  return {
    assertWithinDailyCeiling: jest.fn().mockResolvedValue(undefined),
    assertWithinRunTokenBudget: jest.fn(),
  } as unknown as BudgetService;
}

function cappedRunBudget(maxTokens: number): BudgetService {
  return {
    assertWithinDailyCeiling: jest.fn().mockResolvedValue(undefined),
    assertWithinRunTokenBudget: (tokens: number) => {
      if (tokens > maxTokens) {
        throw new BudgetExceededError(
          `Run token usage ${tokens} exceeds budget ${maxTokens}`,
        );
      }
    },
  } as unknown as BudgetService;
}

function killSwitchClosed(): KillSwitchService {
  return {
    assertOpen: () => {
      throw new KillSwitchError();
    },
  } as unknown as KillSwitchService;
}

function killSwitchOpen(): KillSwitchService {
  return { assertOpen: jest.fn() } as unknown as KillSwitchService;
}

async function createOrchestrator(
  repo: InMemoryGenerationRepository,
  perplexity: PerplexityClient,
  budget: BudgetService = noopBudget(),
  kill: KillSwitchService = killSwitchOpen(),
): Promise<ArticleGenerationOrchestratorService> {
  const moduleRef = await Test.createTestingModule({
    providers: [
      { provide: AppConfigService, useValue: appConfigStub },
      {
        provide: GenerationRepository,
        useValue: repo as unknown as GenerationRepository,
      },
      { provide: PerplexityClient, useValue: perplexity },
      { provide: BudgetService, useValue: budget },
      { provide: KillSwitchService, useValue: kill },
      ArticleGenerationOrchestratorService,
    ],
  }).compile();
  return moduleRef.get(ArticleGenerationOrchestratorService);
}

describe('executeArticleGenerationPipeline', () => {
  it('happy path: 8 Perplexity calls, job succeeded, 3 locales', async () => {
    const repo = new InMemoryGenerationRepository();
    const chat = createStubPerplexityChat();
    const perplexity = { chat } as unknown as PerplexityClient;
    const orchestrator = await createOrchestrator(repo, perplexity);
    const jobId = await repo.createJob({
      topic: 'AI tools',
      targetLocales: ['en', 'pt-BR', 'es'],
    });

    const out = await executeArticleGenerationPipeline(
      { jobId, step: createMemoizingStep(), runId: 'run-happy' },
      orchestrator,
    );

    expect(out.ok).toBe(true);
    expect(chat.mock.calls.length).toBe(8);
    const job = await repo.requireJob(jobId);
    expect(job.status).toBe('succeeded');
    expect(await repo.countSucceededSteps(jobId)).toBe(8);
    const locales = repo.listTranslationLocales(out.articleId).sort();
    expect(locales).toEqual(['en', 'es', 'pt-BR']);
  });

  it('crash-resume: memoized steps 1–3 do not re-call Perplexity after step 4 fails once', async () => {
    const repo = new InMemoryGenerationRepository();
    const chat = createCrashResumePerplexityStub();
    const perplexity = { chat } as unknown as PerplexityClient;
    const orchestrator = await createOrchestrator(repo, perplexity);
    const jobId = await repo.createJob({
      topic: 'AI tools',
      targetLocales: ['en', 'pt-BR', 'es'],
    });
    const step = createMemoizingStep();

    await expect(
      executeArticleGenerationPipeline({ jobId, step }, orchestrator),
    ).rejects.toThrow('crash before step 4');

    const perplexityCallsAfterFailure = chat.mock.calls.length;
    expect(perplexityCallsAfterFailure).toBe(4);
    expect(await repo.countSucceededSteps(jobId)).toBe(3);

    const out = await executeArticleGenerationPipeline(
      { jobId, step },
      orchestrator,
    );
    expect(out.ok).toBe(true);
    // Step 4 invoked twice (failed attempt + retry); steps 1–3 stay memoized (no extra calls).
    expect(chat.mock.calls.length - perplexityCallsAfterFailure).toBe(5);
    expect(await repo.countSucceededSteps(jobId)).toBe(8);
    const job = await repo.requireJob(jobId);
    expect(job.status).toBe('succeeded');
  });

  it('budget exhaustion: exceeds per-run token budget after first step (non-retriable)', async () => {
    const repo = new InMemoryGenerationRepository();
    const chat = createStubPerplexityChat({
      promptTokens: 400,
      completionTokens: 400,
    });
    const perplexity = { chat } as unknown as PerplexityClient;
    const budget = cappedRunBudget(500);
    const orchestrator = await createOrchestrator(repo, perplexity, budget);
    const jobId = await repo.createJob({
      topic: 'AI tools',
      targetLocales: ['en', 'pt-BR', 'es'],
    });

    await expect(
      executeArticleGenerationPipeline(
        { jobId, step: createMemoizingStep() },
        orchestrator,
      ),
    ).rejects.toThrow(NonRetriableError);

    expect(chat.mock.calls.length).toBe(1);
    const job = await repo.requireJob(jobId);
    expect(job.status).toBe('failed');
    expect(job.error).toContain('exceeds budget');
  });

  it('kill-switch: fails at research with KillSwitchError → NonRetriableError', async () => {
    const repo = new InMemoryGenerationRepository();
    const chat = createStubPerplexityChat();
    const perplexity = { chat } as unknown as PerplexityClient;
    const orchestrator = await createOrchestrator(
      repo,
      perplexity,
      noopBudget(),
      killSwitchClosed(),
    );
    const jobId = await repo.createJob({
      topic: 'AI tools',
      targetLocales: ['en', 'pt-BR', 'es'],
    });

    await expect(
      executeArticleGenerationPipeline(
        { jobId, step: createMemoizingStep() },
        orchestrator,
      ),
    ).rejects.toThrow(NonRetriableError);

    expect(chat.mock.calls.length).toBe(0);
    const job = await repo.requireJob(jobId);
    expect(job.status).toBe('failed');
  });
});
