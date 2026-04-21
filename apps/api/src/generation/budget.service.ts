import { Inject, Injectable } from '@nestjs/common';
import { and, gte, isNotNull, sql } from 'drizzle-orm';

import { DRIZZLE, type Database } from '@blog-builder/db';
import { generationJobs } from '@blog-builder/db';

import { AppConfigService } from '../core/config/app-config.service';
import { BudgetExceededError } from './generation.errors';

function startOfUtcDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

@Injectable()
export class BudgetService {
  constructor(
    private readonly cfg: AppConfigService,
    @Inject(DRIZZLE) private readonly db: Database,
  ) {}

  async assertWithinDailyCeiling(): Promise<void> {
    const ceiling = this.cfg.generationDailyUsdCeiling;
    const start = startOfUtcDay(new Date());
    const row = await this.db
      .select({
        sum: sql<string>`coalesce(sum(${generationJobs.totalCostUsd}::numeric), 0)`,
      })
      .from(generationJobs)
      .where(
        and(
          isNotNull(generationJobs.completedAt),
          gte(generationJobs.completedAt, start),
        ),
      );
    const spent = Number(row[0]?.sum ?? 0);
    if (spent >= ceiling) {
      throw new BudgetExceededError(
        `Daily generation spend ${spent.toFixed(4)} USD exceeds ceiling ${ceiling}`,
      );
    }
  }

  assertWithinRunTokenBudget(tokensUsedInRun: number): void {
    const budget = this.cfg.generationPerRunTokenBudget;
    if (tokensUsedInRun > budget) {
      throw new BudgetExceededError(
        `Run token usage ${tokensUsedInRun} exceeds budget ${budget}`,
      );
    }
  }
}
