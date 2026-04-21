import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

import type { AppConfigService } from '../config/app-config.service';

/**
 * Helmet + CORS + gzip. Call after Nest app created; CORS needs resolved origins.
 */
export function applySecurityMiddleware(
  app: INestApplication,
  cfg: AppConfigService,
): void {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          connectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'none'"],
          formAction: ["'none'"],
        },
      },
    }),
  );

  const origins = [cfg.corsOriginWeb, cfg.supabaseCorsOrigin()].filter(
    (o) => o.length > 0,
  );

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-request-id',
      'x-cron-secret',
      'x-revalidate-secret',
    ],
  });

  app.use(compression());
}
