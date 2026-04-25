import {
  PublicArticleDetailSchema,
  PublicArticleListResponseSchema,
  type PublicArticleDetail,
  type PublicArticleListResponse,
} from '@blog-builder/shared-types';

import { ApiError } from './api-error';
import { apiFetch } from './api-fetch';

export async function getArticleBySlug(
  locale: string,
  slug: string,
): Promise<PublicArticleDetail | null> {
  try {
    const data = await apiFetch<unknown>({
      path: `articles/${encodeURIComponent(locale)}/${encodeURIComponent(slug)}`,
    });
    return PublicArticleDetailSchema.parse(data);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      return null;
    }
    throw err;
  }
}

export async function listArticleSummaries(
  locale: string,
  limit: number,
  cursor?: { publishedAt: string; id: string },
): Promise<PublicArticleListResponse> {
  const params = new URLSearchParams();
  params.set('locale', locale);
  params.set('limit', String(limit));
  if (cursor) {
    params.set('cursor', JSON.stringify(cursor));
  }
  const data = await apiFetch<unknown>({
    path: `articles?${params.toString()}`,
  });
  return PublicArticleListResponseSchema.parse(data);
}

export async function listTopSlugs(
  locale: string,
  limit: number,
): Promise<{ slug: string }[]> {
  const summaries = await listArticleSummaries(locale, limit);
  return summaries.items.map((item) => ({ slug: item.slug }));
}
