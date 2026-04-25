import { Injectable } from '@nestjs/common';

import {
  PublicArticleDetailSchema,
  PublicArticleListResponseSchema,
  type PublicArticleDetail,
  type PublicArticleListResponse,
  type Locale,
} from '@blog-builder/shared-types';

import { ArticlesRepository } from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(private readonly repo: ArticlesRepository) {}

  async findPublishedBySlug(
    locale: Locale,
    slug: string,
  ): Promise<PublicArticleDetail> {
    const raw = await this.repo.findPublishedBySlug(locale, slug);

    if (!raw.publishedAt) {
      throw new Error('Published article has no publishedAt date');
    }

    const neighborIds = await this.repo.findNeighborIds(
      raw.articleId,
      raw.categoryId,
      raw.publishedAt,
    );

    const neighborArticleIds = [
      neighborIds.previousId,
      neighborIds.nextId,
    ].filter((id): id is string => id !== null);

    const neighborSummaries =
      neighborArticleIds.length > 0
        ? await this.repo.findSummariesByIds(neighborArticleIds, locale)
        : [];

    const previous =
      neighborIds.previousId != null
        ? neighborSummaries.find((s) => s.articleId === neighborIds.previousId)
        : undefined;

    const next =
      neighborIds.nextId != null
        ? neighborSummaries.find((s) => s.articleId === neighborIds.nextId)
        : undefined;

    const payload = {
      id: raw.articleId,
      locale: raw.locale,
      status: raw.status,
      publishedAt: raw.publishedAt,
      slug: raw.slug,
      title: raw.title,
      subtitle: raw.subtitle,
      tldr: raw.tldr,
      keyTakeaways: raw.keyTakeaways,
      bodyHtml: raw.bodyHtml,
      faq: raw.faq,
      metaTitle: raw.metaTitle,
      metaDescription: raw.metaDescription,
      ogTitle: raw.ogTitle,
      ogDescription: raw.ogDescription,
      coverImageUrl: raw.coverImageUrl,
      ogImageUrl: raw.ogImageUrl,
      readingTimeMinutes: raw.readingTimeMinutes,
      wordCountActual: raw.wordCountActual,
      author: {
        id: raw.authorId,
        slug: raw.authorSlug,
        fullName: raw.authorFullName,
        bio: raw.authorBio,
        photoUrl: raw.authorPhotoUrl,
        expertise: raw.authorExpertise,
        sameAs: raw.authorSameAs,
      },
      category:
        raw.categoryId &&
        raw.categoryLocale &&
        raw.categoryName &&
        raw.categorySlug
          ? {
              id: raw.categoryId,
              locale: raw.categoryLocale,
              name: raw.categoryName,
              slug: raw.categorySlug,
              description: raw.categoryDescription,
            }
          : null,
      tags: raw.tags.map((t) => ({
        id: t.tagId,
        locale: t.tagLocale,
        name: t.tagName,
        slug: t.tagSlug,
      })),
      citations: raw.citations.map((c) => ({
        url: c.url,
        title: c.title,
        snippet: c.snippet,
        publisher: c.publisher,
        publishedAt: c.publishedAt,
      })),
      translations: raw.translations,
      neighbors: {
        previous: previous
          ? { slug: previous.slug, title: previous.title }
          : null,
        next: next ? { slug: next.slug, title: next.title } : null,
      },
    };

    const parsed = PublicArticleDetailSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(
        `PublicArticleDetail validation failed: ${parsed.error.message}`,
      );
    }

    return parsed.data;
  }

  async listPublishedSummaries(
    locale: Locale,
    limit: number,
    cursor?: { publishedAt: Date; id: string },
  ): Promise<PublicArticleListResponse> {
    const { items: rawItems, nextCursor: rawNextCursor } =
      await this.repo.listPublishedSummaries(locale, limit, cursor);

    const articleIds = rawItems.map((i) => i.articleId);
    const tagRows =
      articleIds.length > 0
        ? await this.repo.findTagsForArticleIds(articleIds, locale)
        : [];

    const tagsByArticle = new Map<
      string,
      { id: string; locale: Locale; name: string; slug: string }[]
    >();
    for (const t of tagRows) {
      const list = tagsByArticle.get(t.articleId) ?? [];
      list.push({
        id: t.tagId,
        locale: t.tagLocale,
        name: t.tagName,
        slug: t.tagSlug,
      });
      tagsByArticle.set(t.articleId, list);
    }

    const mappedItems = rawItems.map((row) => ({
      id: row.articleId,
      locale: row.locale,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      tldr: row.tldr,
      coverImageUrl: row.coverImageUrl,
      publishedAt: row.publishedAt,
      readingTimeMinutes: row.readingTimeMinutes,
      author: {
        id: row.authorId,
        slug: row.authorSlug,
        fullName: row.authorFullName,
        bio: row.authorBio,
        photoUrl: row.authorPhotoUrl,
        expertise: row.authorExpertise,
        sameAs: row.authorSameAs,
      },
      category:
        row.categoryId &&
        row.categoryLocale &&
        row.categoryName &&
        row.categorySlug
          ? {
              id: row.categoryId,
              locale: row.categoryLocale,
              name: row.categoryName,
              slug: row.categorySlug,
              description: row.categoryDescription,
            }
          : null,
      tags: tagsByArticle.get(row.articleId) ?? [],
    }));

    const payload = {
      items: mappedItems,
      nextCursor: rawNextCursor,
    };

    const parsed = PublicArticleListResponseSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(
        `PublicArticleListResponse validation failed: ${parsed.error.message}`,
      );
    }

    return parsed.data;
  }
}
