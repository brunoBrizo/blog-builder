'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { Button, Container } from '@blog-builder/ui';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.500');

  return (
    <div className="py-24">
      <Container className="text-center">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
        <p
          className="mt-2 text-xs text-muted-foreground"
          data-digest={error.digest}
        >
          {error.message}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button type="button" onClick={() => reset()}>
            {t('retry')}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{t('homeLink')}</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
