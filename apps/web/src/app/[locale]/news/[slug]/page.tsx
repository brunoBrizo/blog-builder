import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetailView } from '@/components/article-detail-view';
import { getArticleBySlug } from '@/mocks/articles';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: 'Not found' };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsBySlugPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
