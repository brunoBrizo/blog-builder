import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, gt, inArray, isNull, lt, or } from 'drizzle-orm';

import {
  DRIZZLE,
  type Database,
  articleCitations,
  articleTags,
  articleTranslations,
  articles,
  authors,
  categories,
  categoryTranslations,
  tagTranslations,
  tags,
} from '@blog-builder/db';

type Locale = 'en' | 'pt-BR' | 'es';

@Injectable()
export class ArticlesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findPublishedBySlug(locale: Locale, slug: string) {
    const rows = await this.db
      .select({
        articleId: articles.id,
        status: articles.status,
        publishedAt: articles.publishedAt,
        coverImageUrl: articles.coverImageUrl,
        ogImageUrl: articles.ogImageUrl,
        wordCountActual: articles.wordCountActual,
        translationId: articleTranslations.id,
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
        title: articleTranslations.title,
        subtitle: articleTranslations.subtitle,
        tldr: articleTranslations.tldr,
        keyTakeaways: articleTranslations.keyTakeaways,
        bodyHtml: articleTranslations.bodyHtml,
        faq: articleTranslations.faq,
        metaTitle: articleTranslations.metaTitle,
        metaDescription: articleTranslations.metaDescription,
        ogTitle: articleTranslations.ogTitle,
        ogDescription: articleTranslations.ogDescription,
        readingTimeMinutes: articleTranslations.readingTimeMinutes,
        authorId: authors.id,
        authorSlug: authors.slug,
        authorFullName: authors.fullName,
        authorBio: authors.bio,
        authorPhotoUrl: authors.photoUrl,
        authorExpertise: authors.expertise,
        authorSameAs: authors.sameAs,
        categoryId: categories.id,
        categoryLocale: categoryTranslations.locale,
        categoryName: categoryTranslations.name,
        categorySlug: categoryTranslations.slug,
        categoryDescription: categoryTranslations.description,
      })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(
          eq(articleTranslations.articleId, articles.id),
          eq(articleTranslations.locale, locale),
          eq(articleTranslations.slug, slug),
        ),
      )
      .innerJoin(authors, eq(authors.id, articles.authorId))
      .leftJoin(categories, eq(categories.id, articles.categoryId))
      .leftJoin(
        categoryTranslations,
        and(
          eq(categoryTranslations.categoryId, categories.id),
          eq(categoryTranslations.locale, locale),
        ),
      )
      .where(and(eq(articles.status, 'published'), isNull(articles.deletedAt)))
      .limit(1);

    const row = rows[0];
    if (!row) {
      throw new NotFoundException('Article not found');
    }

    const [tagRows, citationRows, translationRows] = await Promise.all([
      this.db
        .select({
          tagId: tags.id,
          tagLocale: tagTranslations.locale,
          tagName: tagTranslations.name,
          tagSlug: tagTranslations.slug,
        })
        .from(articleTags)
        .innerJoin(tags, eq(tags.id, articleTags.tagId))
        .innerJoin(
          tagTranslations,
          and(
            eq(tagTranslations.tagId, tags.id),
            eq(tagTranslations.locale, locale),
          ),
        )
        .where(eq(articleTags.articleId, row.articleId)),

      this.db
        .select({
          citationId: articleCitations.id,
          url: articleCitations.url,
          title: articleCitations.title,
          snippet: articleCitations.snippet,
          publisher: articleCitations.publisher,
          publishedAt: articleCitations.publishedAt,
        })
        .from(articleCitations)
        .where(eq(articleCitations.articleTranslationId, row.translationId))
        .orderBy(articleCitations.orderIndex),

      this.db
        .select({
          locale: articleTranslations.locale,
          slug: articleTranslations.slug,
        })
        .from(articleTranslations)
        .where(eq(articleTranslations.articleId, row.articleId)),
    ]);

    return {
      ...row,
      tags: tagRows,
      citations: citationRows,
      translations: translationRows,
    };
  }

  async findNeighborIds(
    articleId: string,
    categoryId: string | null,
    publishedAt: Date,
  ): Promise<{ previousId: string | null; nextId: string | null }> {
    const baseFilter = and(
      eq(articles.status, 'published'),
      isNull(articles.deletedAt),
    );

    const categoryFilter = categoryId
      ? eq(articles.categoryId, categoryId)
      : isNull(articles.categoryId);

    const [previousRows, nextRows] = await Promise.all([
      this.db
        .select({ articleId: articles.id })
        .from(articles)
        .where(
          and(
            baseFilter,
            categoryFilter,
            lt(articles.publishedAt, publishedAt),
          ),
        )
        .orderBy(desc(articles.publishedAt))
        .limit(1),

      this.db
        .select({ articleId: articles.id })
        .from(articles)
        .where(
          and(
            baseFilter,
            categoryFilter,
            gt(articles.publishedAt, publishedAt),
          ),
        )
        .orderBy(articles.publishedAt)
        .limit(1),
    ]);

    return {
      previousId: previousRows[0]?.articleId ?? null,
      nextId: nextRows[0]?.articleId ?? null,
    };
  }

  async findSummariesByIds(
    articleIds: string[],
    locale: Locale,
  ): Promise<
    {
      articleId: string;
      locale: Locale;
      slug: string;
      title: string;
      subtitle: string | null;
      tldr: string;
      coverImageUrl: string | null;
      publishedAt: Date | null;
      readingTimeMinutes: number;
      authorId: string;
      authorSlug: string;
      authorFullName: string;
      authorBio: string;
      authorPhotoUrl: string | null;
      authorExpertise: string[];
      authorSameAs: string[];
      categoryId: string | null;
      categoryLocale: Locale | null;
      categoryName: string | null;
      categorySlug: string | null;
      categoryDescription: string | null;
    }[]
  > {
    if (articleIds.length === 0) return [];

    return this.db
      .select({
        articleId: articles.id,
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
        title: articleTranslations.title,
        subtitle: articleTranslations.subtitle,
        tldr: articleTranslations.tldr,
        coverImageUrl: articles.coverImageUrl,
        publishedAt: articles.publishedAt,
        readingTimeMinutes: articleTranslations.readingTimeMinutes,
        authorId: authors.id,
        authorSlug: authors.slug,
        authorFullName: authors.fullName,
        authorBio: authors.bio,
        authorPhotoUrl: authors.photoUrl,
        authorExpertise: authors.expertise,
        authorSameAs: authors.sameAs,
        categoryId: categories.id,
        categoryLocale: categoryTranslations.locale,
        categoryName: categoryTranslations.name,
        categorySlug: categoryTranslations.slug,
        categoryDescription: categoryTranslations.description,
      })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(
          eq(articleTranslations.articleId, articles.id),
          eq(articleTranslations.locale, locale),
        ),
      )
      .innerJoin(authors, eq(authors.id, articles.authorId))
      .leftJoin(categories, eq(categories.id, articles.categoryId))
      .leftJoin(
        categoryTranslations,
        and(
          eq(categoryTranslations.categoryId, categories.id),
          eq(categoryTranslations.locale, locale),
        ),
      )
      .where(
        and(
          eq(articles.status, 'published'),
          isNull(articles.deletedAt),
          inArray(articles.id, articleIds),
        ),
      );
  }

  async listPublishedSummaries(
    locale: Locale,
    limit: number,
    cursor?: { publishedAt: Date; id: string },
  ) {
    const baseFilter = and(
      eq(articles.status, 'published'),
      isNull(articles.deletedAt),
    );

    const cursorFilter = cursor
      ? or(
          lt(articles.publishedAt, cursor.publishedAt),
          and(
            eq(articles.publishedAt, cursor.publishedAt),
            lt(articles.id, cursor.id),
          ),
        )
      : undefined;

    const rows = await this.db
      .select({
        articleId: articles.id,
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
        title: articleTranslations.title,
        subtitle: articleTranslations.subtitle,
        tldr: articleTranslations.tldr,
        coverImageUrl: articles.coverImageUrl,
        publishedAt: articles.publishedAt,
        readingTimeMinutes: articleTranslations.readingTimeMinutes,
        authorId: authors.id,
        authorSlug: authors.slug,
        authorFullName: authors.fullName,
        authorBio: authors.bio,
        authorPhotoUrl: authors.photoUrl,
        authorExpertise: authors.expertise,
        authorSameAs: authors.sameAs,
        categoryId: categories.id,
        categoryLocale: categoryTranslations.locale,
        categoryName: categoryTranslations.name,
        categorySlug: categoryTranslations.slug,
        categoryDescription: categoryTranslations.description,
      })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(
          eq(articleTranslations.articleId, articles.id),
          eq(articleTranslations.locale, locale),
        ),
      )
      .innerJoin(authors, eq(authors.id, articles.authorId))
      .leftJoin(categories, eq(categories.id, articles.categoryId))
      .leftJoin(
        categoryTranslations,
        and(
          eq(categoryTranslations.categoryId, categories.id),
          eq(categoryTranslations.locale, locale),
        ),
      )
      .where(cursorFilter ? and(baseFilter, cursorFilter) : baseFilter)
      .orderBy(desc(articles.publishedAt), desc(articles.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];

    return {
      items,
      nextCursor:
        hasMore && last
          ? {
              publishedAt: last.publishedAt,
              id: last.articleId,
            }
          : null,
    };
  }

  async listTopSlugsByLocale(locale: Locale, limit: number) {
    return this.db
      .select({
        slug: articleTranslations.slug,
      })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(
          eq(articleTranslations.articleId, articles.id),
          eq(articleTranslations.locale, locale),
        ),
      )
      .where(and(eq(articles.status, 'published'), isNull(articles.deletedAt)))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async findTagsForArticleIds(
    articleIds: string[],
    locale: Locale,
  ): Promise<
    {
      articleId: string;
      tagId: string;
      tagLocale: Locale;
      tagName: string;
      tagSlug: string;
    }[]
  > {
    if (articleIds.length === 0) return [];
    return this.db
      .select({
        articleId: articleTags.articleId,
        tagId: tags.id,
        tagLocale: tagTranslations.locale,
        tagName: tagTranslations.name,
        tagSlug: tagTranslations.slug,
      })
      .from(articleTags)
      .innerJoin(tags, eq(tags.id, articleTags.tagId))
      .innerJoin(
        tagTranslations,
        and(
          eq(tagTranslations.tagId, tags.id),
          eq(tagTranslations.locale, locale),
        ),
      )
      .where(inArray(articleTags.articleId, articleIds));
  }
}
