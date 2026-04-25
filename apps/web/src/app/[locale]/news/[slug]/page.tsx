import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetailView } from '@/components/article-detail-view';
import { getArticleBySlug } from '@/lib/api-client/articles';
import { extractTocFromHtml } from '@/lib/article-toc';
import { injectCitationLinks } from '@/lib/article-citations';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);
  if (!article) {
    return { title: 'Not found' };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.tldr,
  };
}

export default async function NewsBySlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);
  if (!article) {
    notFound();
  }

  const toc = extractTocFromHtml(article.bodyHtml);
  const bodyHtml = injectCitationLinks(
    article.bodyHtml,
    article.citations.length,
  );

  return <ArticleDetailView article={article} toc={toc} bodyHtml={bodyHtml} />;
}
