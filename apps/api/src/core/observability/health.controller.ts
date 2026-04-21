import { DRIZZLE, type Database } from '@blog-builder/db';
import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { sql } from 'drizzle-orm';

import { AppConfigService } from '../config/app-config.service';

@Controller()
export class HealthController {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly config: AppConfigService,
  ) {}

  @Get('health')
  @SkipThrottle()
  health(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @SkipThrottle()
  async ready(): Promise<{ ready: boolean }> {
    try {
      await this.db.execute(sql`select 1`);
      return { ready: true };
    } catch {
      throw new ServiceUnavailableException('Database unreachable');
    }
  }

  @Get('version')
  @SkipThrottle()
  version(): { gitSha: string; releaseTag: string; builtAt: string } {
    return {
      gitSha: this.config.gitSha,
      releaseTag: this.config.releaseTag,
      builtAt: this.config.builtAt,
    };
  }
}
