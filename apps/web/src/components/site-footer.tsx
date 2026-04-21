import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import { Container } from '@blog-builder/ui';

export async function SiteFooter() {
  const t = await getTranslations('layout.footer');
  const c = await getTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-10">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {c('siteName')}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t('newsletterCompliance')}
            </p>
          </div>
          <nav aria-label={t('legal')} className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('terms')}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year })}
          </p>
          <div
            aria-label={t('socialAria')}
            className="flex gap-3 text-sm text-muted-foreground"
          >
            <span className="italic">Social links — coming soon</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
