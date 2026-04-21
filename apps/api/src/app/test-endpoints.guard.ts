import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppConfigService } from '../core/config/app-config.service';

/**
 * Hides test-only routes unless ENABLE_TEST_ENDPOINTS or NODE_ENV=test.
 */
@Injectable()
export class TestEndpointsGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    void context;
    if (this.config.enableTestEndpoints) {
      return true;
    }
    if (this.config.nodeEnv === 'test') {
      return true;
    }
    throw new NotFoundException();
  }
}
