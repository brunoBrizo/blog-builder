/**
 * Jest loads this before any test file. Provides minimal valid env for
 * `parseEnv` / ConfigModule (same keys as [.env.example](/.env.example)).
 */
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL = 'postgresql://127.0.0.1:5432/postgres';
process.env.DATABASE_POOL_MAX = '5';
process.env.PERPLEXITY_API_KEY = 'test-perplexity';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
process.env.RESEND_API_KEY = 're_test';
process.env.CRON_SHARED_SECRET = 'cron-secret-test';
process.env.REVALIDATE_SHARED_SECRET = 'revalidate-secret-test';
process.env.CORS_ORIGIN_WEB = 'http://localhost:3000';
