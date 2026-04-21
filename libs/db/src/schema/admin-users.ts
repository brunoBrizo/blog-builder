import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from './_shared';
import { adminRoleEnum } from './enums';

/**
 * Mirror of Supabase Auth users allowed into `/admin`. `auth_user_id`
 * references `auth.users(id)` — kept as a plain uuid column (no FK) because
 * Drizzle does not manage the `auth` schema.
 */
export const adminUsers = pgTable(
  'admin_users',
  {
    id: idColumn(),
    authUserId: uuid('auth_user_id').notNull(),
    email: text('email').notNull(),
    displayName: text('display_name'),
    role: adminRoleEnum('role').notNull().default('editor'),
    lastSignInAt: timestamp('last_sign_in_at', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => ({
    adminUsersAuthUserIdUnique: uniqueIndex(
      'admin_users_auth_user_id_unique',
    ).on(table.authUserId),
    adminUsersEmailUnique: uniqueIndex('admin_users_email_unique').on(
      table.email,
    ),
    adminUsersRoleIdx: index('admin_users_role_idx').on(table.role),
  }),
);

export type AdminUser = InferSelectModel<typeof adminUsers>;
export type AdminUserInsert = InferInsertModel<typeof adminUsers>;
