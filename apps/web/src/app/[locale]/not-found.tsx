import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import { Button, Container } from '@blog-builder/ui';

export default async function NotFoundPage() {
  const t = await getTranslations('errors.404');

  return (
    <div className="py-24">
      <Container className="text-center">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t('homeLink')}</Link>
        </Button>
      </Container>
    </div>
  );
}
