import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { effectiveSentryTracesSampleRate, type Env } from './env.schema';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get nodeEnv(): Env['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get logLevel(): string {
    return this.config.get('LOG_LEVEL', { infer: true });
  }

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  get databasePoolMax(): number {
    return this.config.get('DATABASE_POOL_MAX', { infer: true });
  }

  get perplexityApiKey(): string {
    return this.config.get('PERPLEXITY_API_KEY', { infer: true });
  }

  get supabaseUrl(): string {
    return this.config.get('SUPABASE_URL', { infer: true });
  }

  get supabaseSecretKey(): string {
    return this.config.get('SUPABASE_SECRET_KEY', { infer: true });
  }

  get resendApiKey(): string {
    return this.config.get('RESEND_API_KEY', { infer: true });
  }

  get cronSharedSecret(): string {
    return this.config.get('CRON_SHARED_SECRET', { infer: true });
  }

  get revalidateSharedSecret(): string {
    return this.config.get('REVALIDATE_SHARED_SECRET', { infer: true });
  }

  get sentryDsn(): string | undefined {
    const d = this.config.get('SENTRY_DSN', { infer: true });
    return d && d.length > 0 ? d : undefined;
  }

  get sentryTracesSampleRate(): number {
    return effectiveSentryTracesSampleRate({
      NODE_ENV: this.nodeEnv,
      SENTRY_TRACES_SAMPLE_RATE: this.config.get('SENTRY_TRACES_SAMPLE_RATE', {
        infer: true,
      }),
    });
  }

  /** Effective web origin for CORS (dev default localhost:3000). */
  get corsOriginWeb(): string {
    const explicit = this.config.get('CORS_ORIGIN_WEB', { infer: true });
    if (explicit && explicit.length > 0) {
      return explicit;
    }
    if (this.nodeEnv === 'development') {
      return 'http://localhost:3000';
    }
    return explicit ?? '';
  }

  get cronIpAllowlistRaw(): string {
    return this.config.get('CRON_IP_ALLOWLIST', { infer: true }) ?? '';
  }

  get trustProxy(): boolean {
    return this.config.get('TRUST_PROXY', { infer: true }) ?? false;
  }

  get gitSha(): string {
    return this.config.get('GIT_SHA', { infer: true }) ?? '';
  }

  get releaseTag(): string {
    return this.config.get('RELEASE_TAG', { infer: true }) ?? '';
  }

  get builtAt(): string {
    return this.config.get('BUILT_AT', { infer: true }) ?? '';
  }

  get throttlerPublicRead(): { limit: number; ttl: number } {
    return {
      limit: this.config.get('THROTTLE_PUBLIC_READ_LIMIT', { infer: true }),
      ttl: this.config.get('THROTTLE_PUBLIC_READ_TTL_MS', { infer: true }),
    };
  }

  get throttlerPublicWrite(): { limit: number; ttl: number } {
    return {
      limit: this.config.get('THROTTLE_PUBLIC_WRITE_LIMIT', { infer: true }),
      ttl: this.config.get('THROTTLE_PUBLIC_WRITE_TTL_MS', { infer: true }),
    };
  }

  get throttlerAdmin(): { limit: number; ttl: number } {
    return {
      limit: this.config.get('THROTTLE_ADMIN_LIMIT', { infer: true }),
      ttl: this.config.get('THROTTLE_ADMIN_TTL_MS', { infer: true }),
    };
  }

  get enableTestEndpoints(): boolean {
    return this.config.get('ENABLE_TEST_ENDPOINTS', { infer: true }) ?? false;
  }

  /** Supabase project host for CORS connect-src (derived from SUPABASE_URL). */
  supabaseCorsOrigin(): string {
    try {
      return new URL(this.supabaseUrl).origin;
    } catch {
      return '';
    }
  }
}
