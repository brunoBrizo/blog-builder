import { Module } from '@nestjs/common';
import { Inngest } from 'inngest';
import { serve } from 'inngest/express';

import { AppConfigModule } from '../core/config/app-config.module';
import { AppConfigService } from '../core/config/app-config.service';
import { ArticleGenerationController } from './article-generation.controller';
import { ArticleGenerationOrchestratorService } from './article-generation.orchestrator';
import { BudgetService } from './budget.service';
import { createGenerateArticleFunction } from './generate-article.function';
import { GenerationRepository } from './generation.repository';
import {
  INNGEST_CLIENT,
  INNGEST_EXPRESS_MIDDLEWARE,
} from './generation.tokens';
import { InngestDevKeysLogger } from './inngest-dev-keys.logger';
import { KillSwitchService } from './kill-switch.service';
import { PerplexityClient } from './perplexity.client';
import { TopicQueueService } from './topic-queue.service';
import { WebIsrRevalidationService } from './web-isr-revalidation.service';

@Module({
  imports: [AppConfigModule],
  controllers: [ArticleGenerationController],
  providers: [
    PerplexityClient,
    GenerationRepository,
    WebIsrRevalidationService,
    TopicQueueService,
    BudgetService,
    KillSwitchService,
    ArticleGenerationOrchestratorService,
    InngestDevKeysLogger,
    {
      provide: INNGEST_CLIENT,
      useFactory: (cfg: AppConfigService) =>
        new Inngest({
          id: 'blog-builder-api',
          ...(cfg.inngestEventKey.length > 0
            ? { eventKey: cfg.inngestEventKey }
            : {}),
          ...(cfg.inngestSigningKey.length > 0
            ? { signingKey: cfg.inngestSigningKey }
            : {}),
        }),
      inject: [AppConfigService],
    },
    {
      provide: INNGEST_EXPRESS_MIDDLEWARE,
      useFactory: (
        client: Inngest,
        orchestrator: ArticleGenerationOrchestratorService,
      ) => {
        const fn = createGenerateArticleFunction(client, orchestrator);
        return serve({
          client,
          functions: [fn],
        });
      },
      inject: [INNGEST_CLIENT, ArticleGenerationOrchestratorService],
    },
  ],
  exports: [INNGEST_CLIENT, INNGEST_EXPRESS_MIDDLEWARE, GenerationRepository],
})
export class GenerationModule {}
