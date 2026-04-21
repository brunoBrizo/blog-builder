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

export const categories = pgTable(
  'categories',
  {
    id: idColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => ({
    categoriesDeletedAtIdx: index('categories_deleted_at_idx').on(
      table.deletedAt,
    ),
  }),
);

export const categoryTranslations = pgTable(
  'category_translations',
  {
    id: idColumn(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    locale: localeEnum('locale').notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    categoryTranslationsLocaleUnique: uniqueIndex(
      'category_translations_category_locale_unique',
    ).on(table.categoryId, table.locale),
    categoryTranslationsSlugLocaleUnique: uniqueIndex(
      'category_translations_slug_locale_unique',
    ).on(table.locale, table.slug),
  }),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  translations: many(categoryTranslations),
}));

export const categoryTranslationsRelations = relations(
  categoryTranslations,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryTranslations.categoryId],
      references: [categories.id],
    }),
  }),
);

export type Category = InferSelectModel<typeof categories>;
export type CategoryInsert = InferInsertModel<typeof categories>;
export type CategoryTranslation = InferSelectModel<typeof categoryTranslations>;
export type CategoryTranslationInsert = InferInsertModel<
  typeof categoryTranslations
>;
