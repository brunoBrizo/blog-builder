import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, expect, test } from 'vitest';

import { createDatabase } from '../../src/index';

const url = process.env['TEST_DATABASE_URL'];

let poolSql: ReturnType<typeof createDatabase>['sql'] | undefined;

beforeAll(() => {
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set (globalSetup failed?)');
  }
});

afterAll(async () => {
  await poolSql?.end({ timeout: 5 });
});

test('createDatabase + first round-trip stays within budget', async () => {
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set');
  }
  const t0 = performance.now();
  const { db, sql: s } = createDatabase({ url, max: 3 });
  poolSql = s;
  await db.execute(sql`select 1 as ok`);
  const ms = performance.now() - t0;

  // Acceptance target in feature 02: <100ms on Fly shared-cpu-1x. CI and
  // Testcontainers are noisier — keep a higher ceiling and record the sample.
  expect(ms).toBeLessThan(750);
  console.log(`[pool.spec] drizzle init + select 1: ${ms.toFixed(1)}ms`);
});
