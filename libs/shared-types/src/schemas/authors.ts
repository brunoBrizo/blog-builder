import { z } from 'zod';

import {
  EmailSchema,
  NameSchema,
  ShortTextSchema,
  SlugSchema,
  TimestampSchema,
  UrlSchema,
  UuidSchema,
} from './common';

/**
 * Row schema — mirrors `InferSelectModel<typeof authors>` exactly so we can
 * assert drift at compile time in `libs/db/src/__drift__.ts`. Prefer the
 * business-facing Create/Update schemas when validating user input; this
 * schema is only for "parse what we read from Postgres" flows (e.g. hardened
 * repository reads, fixture loading, seed validation).
 */
export const AuthorRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  fullName: z.string(),
  email: z.string(),
  bio: z.string(),
  photoUrl: z.string().nullable(),
  expertise: z.array(z.string()),
  sameAs: z.array(z.string()),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.nullable(),
});
export type AuthorRow = z.infer<typeof AuthorRowSchema>;

/** Create DTO — hard validation of every business rule. */
export const AuthorCreateSchema = z.object({
  slug: SlugSchema,
  fullName: NameSchema,
  email: EmailSchema,
  bio: ShortTextSchema,
  photoUrl: UrlSchema.nullish(),
  expertise: z.array(NameSchema).max(32).default([]),
  sameAs: z.array(UrlSchema).max(32).default([]),
});
export type AuthorCreate = z.infer<typeof AuthorCreateSchema>;

/** Update DTO — every field optional, at least one required at the route level. */
export const AuthorUpdateSchema = AuthorCreateSchema.partial();
export type AuthorUpdate = z.infer<typeof AuthorUpdateSchema>;

/**
 * Public read shape — what we serialise to unauthenticated clients (website,
 * RSS, sitemaps). Strips PII (`email`, audit timestamps) and the soft-delete
 * marker.
 */
export const PublicAuthorSchema = z.object({
  id: UuidSchema,
  slug: SlugSchema,
  fullName: z.string(),
  bio: z.string(),
  photoUrl: z.string().nullable(),
  expertise: z.array(z.string()),
  sameAs: z.array(z.string()),
});
export type PublicAuthor = z.infer<typeof PublicAuthorSchema>;
