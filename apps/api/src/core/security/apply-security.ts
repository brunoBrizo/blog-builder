import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import type { AppConfigService } from '../config/app-config.service';

function isInngestPath(req: Request, servePath: string): boolean {
  return req.path === servePath || req.path.startsWith(`${servePath}/`);
}

const inngestHelmet = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
});

/**
 * Helmet + CORS + gzip. Call after Nest app created; CORS needs resolved origins.
 * Inngest serve path skips strict CSP and uses permissive CORS (browser preflight;
 * Inngest also posts from servers without Origin).
 */
export function applySecurityMiddleware(
  app: INestApplication,
  cfg: AppConfigService,
): void {
  const servePath = cfg.inngestServePath;

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!isInngestPath(req, servePath)) {
      return next();
    }
    return inngestHelmet(req, res, next);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (isInngestPath(req, servePath)) {
      return next();
    }
    return helmet({
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
    })(req, res, next);
  });

  app.use(
    servePath,
    cors({
      origin: true,
      credentials: false,
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'User-Agent',
        'X-Inngest-Signature',
        'X-Inngest-Server-Timing',
      ],
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
