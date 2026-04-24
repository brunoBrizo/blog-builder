import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('placeholders');

  return {
    title: t('metadataTutorial', { slug }),
  };
}

export default async function TutorialBySlugPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('placeholders');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <p className="text-sm font-medium text-zinc-400 mb-2">{t('tutorial')}</p>
      <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 mb-4">
        {t('detailTitle', { slug })}
      </h1>
      <p className="text-sm font-light text-zinc-500 max-w-2xl">
        {t('detailDescription')}
      </p>
    </div>
  );
}
