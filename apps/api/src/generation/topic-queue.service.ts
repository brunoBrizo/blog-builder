import { Injectable } from '@nestjs/common';

import { buildStep1Research } from '@blog-builder/prompts';

import { AppConfigService } from '../core/config/app-config.service';
import { BudgetService } from './budget.service';
import { GenerationRepository } from './generation.repository';
import { KillSwitchService } from './kill-switch.service';
import { PerplexityClient } from './perplexity.client';

/**
 * Refills `topic_queue` from Perplexity (step-1 style) and supports scheduled dequeue.
 */
@Injectable()
export class TopicQueueService {
  constructor(
    private readonly repo: GenerationRepository,
    private readonly perplexity: PerplexityClient,
    private readonly cfg: AppConfigService,
    private readonly budget: BudgetService,
    private readonly killSwitch: KillSwitchService,
  ) {}

  /**
   * Ensures at least `min` rows with status=available (bounded refill attempts).
   */
  async ensureMinDepth(min: number): Promise<void> {
    let attempts = 0;
    while ((await this.repo.countAvailableTopics()) < min) {
      this.killSwitch.assertOpen();
      await this.budget.assertWithinDailyCeiling();
      const built = buildStep1Research({
        topicSeed: this.cfg.generationSchedulerTopicSeed,
      });
      const result = await this.perplexity.chat({
        system: built.system,
        user: built.user,
        params: built.params,
        responseSchema: built.responseSchema,
      });
      const inserted = await this.repo.insertTopicQueueCandidates(
        result.data.topics.map((t) => {
          const row: {
            primaryLongTailKeyword: string;
            suggestedTitle: string;
            score?: number;
          } = {
            primaryLongTailKeyword: t.primaryLongTailKeyword,
            suggestedTitle: t.suggestedTitle,
          };
          if (t.score !== undefined) {
            row.score = t.score;
          }
          return row;
        }),
      );
      attempts += 1;
      if (attempts > 6 || inserted === 0) {
        break;
      }
    }
  }
}
