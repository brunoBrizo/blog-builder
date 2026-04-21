import { getTranslations } from 'next-intl/server';

import { Container } from '@blog-builder/ui';

export default async function HomePage() {
  const t = await getTranslations('common');

  return (
    <div className="py-16">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t('siteName')}
        </h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          Home placeholder — content arrives in later features. Shell is ready
          for i18n, theme, and SEO.
        </p>
      </Container>
    </div>
  );
}
