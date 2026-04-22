import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function SiteFooter() {
  const t = await getTranslations('layout.footer');
  const c = await getTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-zinc-50/50 mt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-base font-medium tracking-tighter uppercase text-zinc-900 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              {c('siteName')}
            </Link>
            <p className="text-xs text-zinc-500">{t('copyright', { year })}</p>
          </div>

          <nav
            aria-label={t('legal')}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            <Link
              href="#"
              className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="#"
              className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              {t('contact')}
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href="#"
              className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              {t('disclaimer')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
