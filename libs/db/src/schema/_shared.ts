import { sql } from 'drizzle-orm';
import { timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Standard audit columns shared by every table.
 *
 * - `id`         uuid primary key, server-generated with gen_random_uuid().
 * - `created_at` timestamptz, defaults to now().
 * - `updated_at` timestamptz, defaults to now(); kept fresh by the
 *   `set_updated_at` trigger installed in the hand-written SQL migration.
 */
export const idColumn = () =>
  uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`);

export const createdAtColumn = () =>
  timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow();

export const updatedAtColumn = () =>
  timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow();

export const deletedAtColumn = () =>
  timestamp('deleted_at', { withTimezone: true, mode: 'date' });
