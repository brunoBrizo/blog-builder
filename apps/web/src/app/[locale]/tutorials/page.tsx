import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('placeholders');

  return {
    title: t('tutorialsListTitle'),
  };
}

export default async function TutorialsListPage() {
  const t = await getTranslations('placeholders');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
        {t('tutorialsHeading')}
      </h1>
      <p className="text-base font-light text-zinc-500 max-w-2xl">
        {t('listDescription')}
      </p>
    </div>
  );
}
