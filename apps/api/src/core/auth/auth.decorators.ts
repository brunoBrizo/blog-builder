import { applyDecorators, UseGuards } from '@nestjs/common';

import { CronAuthGuard } from './cron-auth.guard';
import { RevalidateAuthGuard } from './revalidate-auth.guard';

export function UseCronAuth(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(CronAuthGuard));
}

export function UseRevalidateAuth(): ReturnType<typeof applyDecorators> {
  return applyDecorators(UseGuards(RevalidateAuthGuard));
}
