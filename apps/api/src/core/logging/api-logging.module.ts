import { randomUUID } from 'node:crypto';

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (cfg: AppConfigService) => ({
        pinoHttp: {
          level: cfg.logLevel,
          genReqId: (req, res) => {
            const incoming = req.headers['x-request-id'];
            const id =
              typeof incoming === 'string' && incoming.length > 0
                ? incoming
                : randomUUID();
            res.setHeader('x-request-id', id);
            return id;
          },
          customProps: (req) => ({
            reqId: String((req as { id?: string }).id ?? ''),
          }),
          serializers: {
            req: (req: {
              id?: string;
              method?: string;
              url?: string;
              headers?: Record<string, unknown>;
            }) => ({
              id: req.id,
              method: req.method,
              url: req.url,
            }),
          },
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers["x-cron-secret"]',
              'req.headers["x-revalidate-secret"]',
            ],
            remove: true,
          },
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class ApiLoggingModule {}
