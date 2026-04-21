import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { SharedSecretService } from './shared-secret.service';

@Injectable()
export class CronAuthGuard implements CanActivate {
  constructor(private readonly secrets: SharedSecretService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!this.secrets.validateCron(req)) {
      throw new UnauthorizedException('Invalid or missing cron credentials');
    }
    return true;
  }
}
