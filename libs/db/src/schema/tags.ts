import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from './_shared';
import { localeEnum } from './enums';

export const tags = pgTable(
  'tags',
  {
    id: idColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => ({
    tagsDeletedAtIdx: index('tags_deleted_at_idx').on(table.deletedAt),
  }),
);

export const tagTranslations = pgTable(
  'tag_translations',
  {
    id: idColumn(),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    locale: localeEnum('locale').notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    tagTranslationsTagLocaleUnique: uniqueIndex(
      'tag_translations_tag_locale_unique',
    ).on(table.tagId, table.locale),
    tagTranslationsSlugLocaleUnique: uniqueIndex(
      'tag_translations_slug_locale_unique',
    ).on(table.locale, table.slug),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  translations: many(tagTranslations),
}));

export const tagTranslationsRelations = relations(
  tagTranslations,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagTranslations.tagId],
      references: [tags.id],
    }),
  }),
);

export type Tag = InferSelectModel<typeof tags>;
export type TagInsert = InferInsertModel<typeof tags>;
export type TagTranslation = InferSelectModel<typeof tagTranslations>;
export type TagTranslationInsert = InferInsertModel<typeof tagTranslations>;
