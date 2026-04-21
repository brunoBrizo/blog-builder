import { Injectable } from '@nestjs/common';

import { AppConfigService } from '../core/config/app-config.service';
import { KillSwitchError } from './generation.errors';

@Injectable()
export class KillSwitchService {
  constructor(private readonly cfg: AppConfigService) {}

  assertOpen(): void {
    if (this.cfg.generationKillSwitch) {
      throw new KillSwitchError();
    }
  }
}
