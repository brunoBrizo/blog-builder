import { getTranslations } from 'next-intl/server';

type Variant = 'article' | 'news';

interface ArticleDetailViewProps {
  slug: string;
  variant: Variant;
}

export async function ArticleDetailView({
  slug,
  variant,
}: ArticleDetailViewProps) {
  const t = await getTranslations('placeholders');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      <p className="text-sm font-medium text-zinc-400 mb-2">
        {variant === 'news' ? t('aiNews') : t('articleLabel')}
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 mb-4">
        {t('detailTitle', { slug })}
      </h1>
      <p className="text-sm font-light text-zinc-500 max-w-2xl">
        {t('detailDescription')}
      </p>
    </div>
  );
}
