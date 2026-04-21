import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { index, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from './_shared';

export const authors = pgTable(
  'authors',
  {
    id: idColumn(),
    slug: text('slug').notNull(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    bio: text('bio').notNull(),
    photoUrl: text('photo_url'),
    expertise: jsonb('expertise').$type<string[]>().notNull().default([]),
    sameAs: jsonb('same_as').$type<string[]>().notNull().default([]),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => ({
    authorsSlugUnique: uniqueIndex('authors_slug_unique').on(table.slug),
    authorsEmailUnique: uniqueIndex('authors_email_unique').on(table.email),
    authorsDeletedAtIdx: index('authors_deleted_at_idx').on(table.deletedAt),
  }),
);

export const authorsRelations = relations(authors, () => ({}));

export type Author = InferSelectModel<typeof authors>;
export type AuthorInsert = InferInsertModel<typeof authors>;
