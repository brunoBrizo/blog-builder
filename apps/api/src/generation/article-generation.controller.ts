import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Inngest } from 'inngest';

import { CronAuthGuard } from '../core/auth/cron-auth.guard';
import { AppConfigService } from '../core/config/app-config.service';
import { PostInternalArticlesGenerateDto } from './dto/post-internal-articles-generate.dto';
import { GenerationRepository } from './generation.repository';
import { INNGEST_CLIENT } from './generation.tokens';

@SkipThrottle()
@Controller('internal/articles')
@UseGuards(CronAuthGuard)
export class ArticleGenerationController {
  constructor(
    @Inject(INNGEST_CLIENT) private readonly inngest: Inngest,
    private readonly repo: GenerationRepository,
    private readonly cfg: AppConfigService,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generate(
    @Body() body: PostInternalArticlesGenerateDto,
  ): Promise<{ jobId: string }> {
    const locales = body.locales ?? (['en', 'pt-BR', 'es'] as const);
    const jobId = await this.repo.createJob({
      topic: body.topicSeed,
      targetLocales: [...locales],
    });
    await this.inngest.send({
      name: 'article/generation.requested',
      data: {
        jobId,
        topicSeed: body.topicSeed,
        locales: [...locales],
        autoPublish: body.autoPublish ?? false,
      },
    });
    return { jobId };
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
