import { DrizzleModule } from '@blog-builder/db';
import { Module } from '@nestjs/common';

import { AppConfigModule } from '../core/config/app-config.module';
import { AppConfigService } from '../core/config/app-config.service';
import { CoreModule } from '../core/core.module';
import { ApiObservabilityModule } from '../core/observability/api-observability.module';
import { GenerationModule } from '../generation/generation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RevalidateController } from './revalidate.controller';
import { TestEndpointsController } from './test-endpoints.controller';
import { TestEndpointsGuard } from './test-endpoints.guard';

@Module({
  imports: [
    CoreModule,
    GenerationModule,
    DrizzleModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (cfg: AppConfigService) => ({
        url: cfg.databaseUrl,
        max: cfg.databasePoolMax,
      }),
    }),
    ApiObservabilityModule,
  ],
  controllers: [AppController, TestEndpointsController, RevalidateController],
  providers: [AppService, TestEndpointsGuard],
})
export class AppModule {}
