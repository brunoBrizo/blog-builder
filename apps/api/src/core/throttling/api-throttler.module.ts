import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';

/**
 * Single default bucket (public-read baseline). Stricter routes use
 * `@Throttle({ default: { limit, ttl } })` overrides (e.g. writes, admin).
 */
@Global()
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (cfg: AppConfigService) => {
        const r = cfg.throttlerPublicRead;
        return [
          {
            name: 'default',
            ttl: r.ttl,
            limit: r.limit,
          },
        ];
      },
    }),
  ],
  exports: [ThrottlerModule],
})
export class ApiThrottlerModule {}
