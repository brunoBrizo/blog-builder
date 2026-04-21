'use client';

import { useTranslations } from 'next-intl';

export function SkipToContent() {
  const t = useTranslations('layout');
  return (
    <a
      href="#main"
      className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2"
    >
      {t('skipToContent')}
    </a>
  );
}
