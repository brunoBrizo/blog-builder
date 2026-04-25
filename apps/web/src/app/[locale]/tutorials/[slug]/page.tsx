import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetailView } from '@/components/article-detail-view';
import { getTutorialBySlug } from '@/mocks/tutorials';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial) {
    return { title: 'Not found' };
  }

  return {
    title: tutorial.title,
    description: tutorial.excerpt,
  };
}

export default async function TutorialBySlugPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial) {
    notFound();
  }

  return <ArticleDetailView article={tutorial} />;
}
