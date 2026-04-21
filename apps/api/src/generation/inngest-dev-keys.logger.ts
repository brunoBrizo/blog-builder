import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { AppConfigService } from '../core/config/app-config.service';

@Injectable()
export class InngestDevKeysLogger implements OnModuleInit {
  private readonly logger = new Logger(InngestDevKeysLogger.name);

  constructor(private readonly cfg: AppConfigService) {}

  onModuleInit(): void {
    if (this.cfg.inngestKeysOptional) {
      this.logger.warn(
        'Inngest Cloud keys missing; use `npx inngest-cli@latest dev` (http://127.0.0.1:8288) or set INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY.',
      );
    }
  }
}
