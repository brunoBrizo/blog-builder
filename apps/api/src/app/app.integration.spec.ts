import { DRIZZLE } from '@blog-builder/db';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from './app.module';

describe('AppModule (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DRIZZLE)
      .useValue({
        execute: async () => {
          throw new Error('unreachable');
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/ready returns 503 when DB execute fails', async () => {
    await request(app.getHttpServer())
      .get('/api/ready')
      .expect(HttpStatus.SERVICE_UNAVAILABLE);
  });
});

describe('AppModule guards and throttle', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/test/cron without secret returns 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/test/cron')
      .expect(HttpStatus.UNAUTHORIZED);
    expect(res.body?.error?.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/test/rate-limit returns 429 after limit', async () => {
    await request(app.getHttpServer()).post('/api/test/rate-limit').expect(201);
    await request(app.getHttpServer()).post('/api/test/rate-limit').expect(201);
    const res = await request(app.getHttpServer())
      .post('/api/test/rate-limit')
      .expect(HttpStatus.TOO_MANY_REQUESTS);
    expect(res.body?.error?.code).toBe('TOO_MANY_REQUESTS');
  });

  it('POST /api/revalidate without secret returns 401', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/revalidate')
      .send({ path: '/blog/hello' })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(res.body?.error?.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/revalidate with invalid path returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/revalidate')
      .set('x-revalidate-secret', 'revalidate-secret-test')
      .send({ path: '/other' })
      .expect(HttpStatus.BAD_REQUEST);
    expect(res.body?.error?.code).toBe('BAD_REQUEST');
  });

  it('POST /api/revalidate with valid body and secret returns 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/revalidate')
      .set('x-revalidate-secret', 'revalidate-secret-test')
      .send({ path: '/blog/hello' })
      .expect(HttpStatus.CREATED);
    expect(res.body?.ok).toBe(true);
    expect(res.body?.path).toBe('/blog/hello');
  });
});
