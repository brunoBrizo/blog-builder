import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '../config/app-config.module';
import { CronAuthGuard } from './cron-auth.guard';
import { RevalidateAuthGuard } from './revalidate-auth.guard';
import { SharedSecretService } from './shared-secret.service';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [SharedSecretService, CronAuthGuard, RevalidateAuthGuard],
  exports: [SharedSecretService, CronAuthGuard, RevalidateAuthGuard],
})
export class ApiAuthModule {}
