import { parseEnv } from './env.schema';

describe('parseEnv', () => {
  it('accepts a minimal valid payload', () => {
    const env = parseEnv({
      NODE_ENV: 'test',
      PORT: '3001',
      LOG_LEVEL: 'silent',
      DATABASE_URL: 'postgresql://127.0.0.1:5432/postgres',
      DATABASE_POOL_MAX: '5',
      PERPLEXITY_API_KEY: 'k',
      SUPABASE_URL: 'https://x.supabase.co',
      SUPABASE_SECRET_KEY: 'sb_secret_x',
      RESEND_API_KEY: 're_x',
      CRON_SHARED_SECRET: 'a',
      REVALIDATE_SHARED_SECRET: 'b',
      CORS_ORIGIN_WEB: 'http://localhost:3000',
    } as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(3001);
  });

  it('lists all invalid keys when multiple fail', () => {
    expect(() =>
      parseEnv({
        NODE_ENV: 'test',
      } as NodeJS.ProcessEnv),
    ).toThrow(/Invalid environment/);
  });
});
