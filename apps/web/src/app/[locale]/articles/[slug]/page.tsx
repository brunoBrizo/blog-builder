import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ArticleDetailView } from '@/components/article-detail-view';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('placeholders');

  return {
    title: t('metadataArticle', { slug }),
  };
}

export default async function ArticleBySlugPage({ params }: Props) {
  const { slug } = await params;

  return <ArticleDetailView slug={slug} variant="article" />;
}
