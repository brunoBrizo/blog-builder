import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type DatabaseSchema = typeof schema;

export type Database = ReturnType<typeof drizzle<DatabaseSchema>>;

export interface CreateDatabaseOptions {
  /** Full Postgres connection URL (pooled URL at runtime). */
  url: string;
  /**
   * Max pool size for the postgres.js client. Keep small in serverless /
   * scale-to-zero environments; the API runs on Fly.io with few workers.
   * Defaults to 10.
   */
  max?: number;
  /**
   * Whether to use prepared statements. Disabled by default because we go
   * through Supabase's transaction pooler in production.
   */
  prepare?: boolean;
}

/**
 * Create a Drizzle client backed by postgres.js.
 *
 * Use one instance per process. The NestJS `DrizzleModule` wires the singleton
 * via DI and handles connection lifecycle.
 */
export function createDatabase(options: CreateDatabaseOptions): {
  db: Database;
  sql: ReturnType<typeof postgres>;
} {
  const sql = postgres(options.url, {
    max: options.max ?? 10,
    prepare: options.prepare ?? false,
    ssl: options.url.includes('localhost') ? false : 'require',
  });

  const db = drizzle(sql, { schema, casing: 'snake_case' });

  return { db, sql };
}
