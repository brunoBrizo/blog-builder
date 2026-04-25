import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Inngest } from 'inngest';

import { CronAuthGuard } from '../core/auth/cron-auth.guard';
import { AppConfigService } from '../core/config/app-config.service';
import { PostInternalArticlesGenerateDto } from './dto/post-internal-articles-generate.dto';
import { PostInternalArticlesRetryDto } from './dto/post-internal-articles-retry.dto';
import { GenerationRepository } from './generation.repository';
import { INNGEST_CLIENT } from './generation.tokens';
import { TopicQueueService } from './topic-queue.service';

@SkipThrottle()
@Controller('internal/articles')
@UseGuards(CronAuthGuard)
export class ArticleGenerationController {
  constructor(
    @Inject(INNGEST_CLIENT) private readonly inngest: Inngest,
    private readonly repo: GenerationRepository,
    private readonly cfg: AppConfigService,
    private readonly topicQueue: TopicQueueService,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generate(
    @Body() body: PostInternalArticlesGenerateDto,
  ): Promise<{ jobId: string }> {
    const locales = body.locales ?? (['en', 'pt-BR', 'es'] as const);
    const seed = body.topicSeed?.trim();
    const isScheduled = seed === undefined || seed.length === 0;
    const autoPublish = body.autoPublish ?? (isScheduled ? true : false);

    let jobId: string;
    if (isScheduled) {
      await this.topicQueue.ensureMinDepth(
        this.cfg.generationTopicQueueMinDepth,
      );
      const first = await this.repo.reserveScheduledTopicAndCreateJob({
        targetLocales: [...locales],
        autoPublish,
      });
      if (first) {
        jobId = first;
      } else {
        await this.topicQueue.ensureMinDepth(
          this.cfg.generationTopicQueueMinDepth,
        );
        const second = await this.repo.reserveScheduledTopicAndCreateJob({
          targetLocales: [...locales],
          autoPublish,
        });
        if (!second) {
          throw new ServiceUnavailableException(
            'No topics available in topic_queue after refill',
          );
        }
        jobId = second;
      }
    } else {
      jobId = await this.repo.createJob({
        topic: seed,
        targetLocales: [...locales],
        triggerKind: 'manual',
        autoPublish,
      });
    }

    const job = await this.repo.requireJob(jobId);
    await this.inngest.send({
      name: 'article/generation.requested',
      data: {
        jobId,
        topicSeed: job.topic,
        locales: [...locales],
        autoPublish: job.autoPublish,
      },
    });
    return { jobId };
  }

  @Post('generation/retry')
  @HttpCode(HttpStatus.ACCEPTED)
  async retryFailed(
    @Body() body: PostInternalArticlesRetryDto,
  ): Promise<{ retried: number; jobIds: string[] }> {
    const limit = body.limit ?? 5;
    const jobIds = await this.repo.listRetryableFailedJobs(limit);
    for (const id of jobIds) {
      await this.repo.resetJobToPendingForRetry(id);
      const job = await this.repo.requireJob(id);
      await this.inngest.send({
        name: 'article/generation.requested',
        data: {
          jobId: id,
          topicSeed: job.topic,
          locales: job.targetLocales,
          autoPublish: job.autoPublish,
        },
      });
    }
    return { retried: jobIds.length, jobIds };
  }

  @Get('generation/monthly-spend')
  async monthlySpend(): Promise<{
    year: number;
    month: number;
    monthSpendUsd: string;
    succeededJobs: number;
    generationKillSwitch: boolean;
  }> {
    const now = new Date();
    const agg = await this.repo.monthlySpendUtc(
      now.getUTCFullYear(),
      now.getUTCMonth(),
    );
    return {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
      monthSpendUsd: agg.monthSpendUsd,
      succeededJobs: agg.jobCount,
      generationKillSwitch: this.cfg.generationKillSwitch,
    };
  }
}
