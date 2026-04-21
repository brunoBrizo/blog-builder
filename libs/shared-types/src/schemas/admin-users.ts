import { z } from 'zod';

import { AdminRoleSchema } from './enums';
import { EmailSchema, NameSchema, TimestampSchema, UuidSchema } from './common';

/** Row mirror of `admin_users`. */
export const AdminUserRowSchema = z.object({
  id: z.string().uuid(),
  authUserId: z.string().uuid(),
  email: z.string(),
  displayName: z.string().nullable(),
  role: AdminRoleSchema,
  lastSignInAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.nullable(),
});
export type AdminUserRow = z.infer<typeof AdminUserRowSchema>;

export const AdminUserCreateSchema = z.object({
  authUserId: UuidSchema,
  email: EmailSchema,
  displayName: NameSchema.nullish(),
  role: AdminRoleSchema.default('editor'),
});
export type AdminUserCreate = z.infer<typeof AdminUserCreateSchema>;

export const AdminUserUpdateSchema = z
  .object({
    displayName: NameSchema.nullish(),
    role: AdminRoleSchema,
    lastSignInAt: z.coerce.date().nullish(),
  })
  .partial();
export type AdminUserUpdate = z.infer<typeof AdminUserUpdateSchema>;
