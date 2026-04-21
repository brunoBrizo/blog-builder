import {
  Global,
  Inject,
  Logger,
  Module,
  type DynamicModule,
  type FactoryProvider,
  type OnModuleDestroy,
  type Provider,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { Database } from './client';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');
export const POSTGRES_JS_CLIENT = Symbol('POSTGRES_JS_CLIENT');

export interface DrizzleModuleOptions {
  url: string;
  max?: number;
  prepare?: boolean;
}

/**
 * Injectable access to the Drizzle client. Consumers do:
 *
 * ```ts
 * constructor(@Inject(DRIZZLE) private readonly db: Database) {}
 * ```
 */
@Global()
@Module({})
export class DrizzleModule implements OnModuleDestroy {
  private static readonly logger = new Logger(DrizzleModule.name);

  constructor(
    @Inject(POSTGRES_JS_CLIENT)
    private readonly sql: ReturnType<typeof postgres>,
  ) {}

  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: POSTGRES_JS_CLIENT,
        useFactory: () =>
          postgres(options.url, {
            max: options.max ?? 10,
            prepare: options.prepare ?? false,
            ssl: options.url.includes('localhost') ? false : 'require',
          }),
      },
      {
        provide: DRIZZLE,
        inject: [POSTGRES_JS_CLIENT],
        useFactory: (sql: ReturnType<typeof postgres>): Database =>
          drizzle(sql, { schema, casing: 'snake_case' }),
      },
    ];

    return {
      module: DrizzleModule,
      providers,
      exports: [DRIZZLE, POSTGRES_JS_CLIENT],
    };
  }

  static forRootAsync(options: {
    imports?: DynamicModule['imports'];
    inject?: FactoryProvider['inject'];
    /** Injected deps match `inject`; typed as `any[]` for Nest factory assignability. */
    useFactory: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nest useFactory must accept injected provider instances
      ...args: any[]
    ) => DrizzleModuleOptions | Promise<DrizzleModuleOptions>;
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: POSTGRES_JS_CLIENT,
        inject: options.inject ?? [],
        useFactory: async (...args: unknown[]) => {
          const opts = await options.useFactory(...args);
          return postgres(opts.url, {
            max: opts.max ?? 10,
            prepare: opts.prepare ?? false,
            ssl: opts.url.includes('localhost') ? false : 'require',
          });
        },
      },
      {
        provide: DRIZZLE,
        inject: [POSTGRES_JS_CLIENT],
        useFactory: (sql: ReturnType<typeof postgres>): Database =>
          drizzle(sql, { schema, casing: 'snake_case' }),
      },
    ];

    return {
      module: DrizzleModule,
      imports: options.imports ?? [],
      providers,
      exports: [DRIZZLE, POSTGRES_JS_CLIENT],
    };
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.sql.end({ timeout: 5 });
    } catch (error) {
      DrizzleModule.logger.warn(
        `Failed to close postgres pool cleanly: ${(error as Error).message}`,
      );
    }
  }
}
