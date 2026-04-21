import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import request from 'supertest';

import { AppModule } from '../app/app.module';
import { AppConfigService } from '../core/config/app-config.service';
import { applySecurityMiddleware } from '../core/security/apply-security';
import { INNGEST_EXPRESS_MIDDLEWARE } from './generation.tokens';

/**
 * Boots like `main.ts` (`NestFactory` + `rawBody: true`) so Inngest can read the
 * raw request body for signature verification.
 */
describe('Inngest serve route (integration)', () => {
  let app: NestExpressApplication;
  let prevEventKey: string | undefined;
  let prevSigningKey: string | undefined;

  beforeAll(async () => {
    prevEventKey = process.env.INNGEST_EVENT_KEY;
    prevSigningKey = process.env.INNGEST_SIGNING_KEY;
    process.env.INNGEST_EVENT_KEY = 'test-inngest-event-key';
    process.env.INNGEST_SIGNING_KEY = 'signkey-test-' + 'a'.repeat(40);

    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
      rawBody: true,
    });
    const cfg = app.get(AppConfigService);
    applySecurityMiddleware(app, cfg);
    app.setGlobalPrefix('api');
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(
      cfg.inngestServePath,
      express.json({ limit: '1mb' }),
      app.get(INNGEST_EXPRESS_MIDDLEWARE),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (prevEventKey === undefined) {
      delete process.env.INNGEST_EVENT_KEY;
    } else {
      process.env.INNGEST_EVENT_KEY = prevEventKey;
    }
    if (prevSigningKey === undefined) {
      delete process.env.INNGEST_SIGNING_KEY;
    } else {
      process.env.INNGEST_SIGNING_KEY = prevSigningKey;
    }
  });

  it('rejects POST without Inngest signature when signing key is configured', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/inngest')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.status).toBe(401);
  });
});
