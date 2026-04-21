import 'dotenv/config';

import * as Sentry from '@sentry/nestjs';
import { Logger } from 'nestjs-pino';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfigService } from './core/config/app-config.service';
import {
  effectiveSentryTracesSampleRate,
  parseEnv,
} from './core/config/env.schema';
import { applySecurityMiddleware } from './core/security/apply-security';
import { AppModule } from './app/app.module';

function initSentry(): void {
  const env = parseEnv(process.env);
  const dsn = env.SENTRY_DSN;
  if (!dsn || dsn.length === 0) {
    return;
  }
  Sentry.init({
    dsn,
    environment: env.NODE_ENV,
    sendDefaultPii: false,
    tracesSampleRate: effectiveSentryTracesSampleRate(env),
    integrations: [Sentry.nestIntegration()],
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['x-cron-secret'];
        delete event.request.headers['x-revalidate-secret'];
      }
      return event;
    },
  });
}

async function bootstrap(): Promise<void> {
  initSentry();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const cfg = app.get(AppConfigService);
  app.useLogger(app.get(Logger));

  if (cfg.trustProxy) {
    app.set('trust proxy', true);
  }

  applySecurityMiddleware(app, cfg);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();

  const port = cfg.port;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Listening ${port} env=${cfg.nodeEnv} prefix=/${globalPrefix}`);
}

bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
