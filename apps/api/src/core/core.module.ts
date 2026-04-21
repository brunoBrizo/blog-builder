import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { createZodValidationPipe } from 'nestjs-zod';

import { ApiAuthModule } from './auth/api-auth.module';
import { AppConfigModule } from './config/app-config.module';
import { HttpExceptionFilter } from './errors/http-exception.filter';
import { ApiLoggingModule } from './logging/api-logging.module';
import { SentryHttpBreadcrumbInterceptor } from './logging/sentry-breadcrumb.interceptor';
import { ApiThrottlerModule } from './throttling/api-throttler.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    ApiLoggingModule,
    ApiAuthModule,
    ApiThrottlerModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: SentryHttpBreadcrumbInterceptor },
    {
      provide: APP_PIPE,
      useFactory: () => {
        const Pipe = createZodValidationPipe({
          strictSchemaDeclaration: false,
        });
        return new Pipe();
      },
    },
  ],
})
export class CoreModule {}
