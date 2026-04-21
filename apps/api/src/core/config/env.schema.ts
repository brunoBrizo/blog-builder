import { z } from 'zod';

const nonEmpty = z.string().trim().min(1);

/**
 * Validates process.env at boot. All keys listed in failing message when invalid.
 */
export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().int().positive().default(3000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),

    DATABASE_URL: nonEmpty,
    DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),

    PERPLEXITY_API_KEY: nonEmpty,
    SUPABASE_URL: z.string().url(),
    /** Server-side Supabase secret (sb_secret_…). */
    SUPABASE_SECRET_KEY: nonEmpty,
    RESEND_API_KEY: nonEmpty,

    CRON_SHARED_SECRET: nonEmpty,
    REVALIDATE_SHARED_SECRET: nonEmpty,

    /** Optional; API boots without Sentry when unset. */
    SENTRY_DSN: z.string().url().optional().or(z.literal('')),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),

    /** Comma-separated origins for apps/web; defaults in dev. */
    CORS_ORIGIN_WEB: z.string().url().optional().or(z.literal('')),

    /** Comma-separated CIDRs; empty = no IP restriction for cron. */
    CRON_IP_ALLOWLIST: z.string().optional().default(''),

    /** When true, trust `Fly-Client-IP` / `X-Forwarded-For` for allowlist. */
    TRUST_PROXY: z
      .enum(['true', 'false', '1', '0'])
      .optional()
      .transform((v) => (v === undefined ? false : v === 'true' || v === '1')),

    GIT_SHA: z.string().optional().default(''),
    RELEASE_TAG: z.string().optional().default(''),
    BUILT_AT: z.string().optional().default(''),

    /** Low limits for integration tests (optional). */
    THROTTLE_PUBLIC_READ_LIMIT: z.coerce.number().int().positive().default(120),
    THROTTLE_PUBLIC_READ_TTL_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    THROTTLE_PUBLIC_WRITE_LIMIT: z.coerce.number().int().positive().default(30),
    THROTTLE_PUBLIC_WRITE_TTL_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    THROTTLE_ADMIN_LIMIT: z.coerce.number().int().positive().default(60),
    THROTTLE_ADMIN_TTL_MS: z.coerce.number().int().positive().default(60_000),

    ENABLE_TEST_ENDPOINTS: z
      .enum(['true', 'false', '1', '0'])
      .optional()
      .transform((v) => v === 'true' || v === '1'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production' && !data.CORS_ORIGIN_WEB) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CORS_ORIGIN_WEB is required when NODE_ENV=production',
        path: ['CORS_ORIGIN_WEB'],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Same semantics as AppConfigService.sentryTracesSampleRate (prod capped at 0.1). */
export function effectiveSentryTracesSampleRate(
  env: Pick<Env, 'NODE_ENV' | 'SENTRY_TRACES_SAMPLE_RATE'>,
): number {
  const isProd = env.NODE_ENV === 'production';
  const configured = env.SENTRY_TRACES_SAMPLE_RATE;
  return isProd ? Math.min(configured, 0.1) : configured;
}

export function parseEnv(raw: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map(
      (i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`,
    );
    throw new Error(
      `Invalid environment:\n${lines.join('\n')}\nFix .env / secrets and restart.`,
    );
  }
  return result.data;
}
