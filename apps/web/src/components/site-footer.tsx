import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import { PrivacyPolicyDialog } from '@/components/privacy-policy-dialog';
import { routes } from '@/lib/routes';

export async function SiteFooter() {
  const t = await getTranslations('layout.footer');
  const c = await getTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="font-display text-sm font-medium tracking-tighter uppercase text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm flex items-center gap-1.5"
            >
              <span className="size-1.5 rounded-full bg-indigo-500"></span>
              {c('siteName')}
            </Link>
            <p className="text-sm font-light text-zinc-500">
              {t('copyright', { year })}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href={routes.about}
              className="text-xs font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
            >
              {t('about')}
            </Link>
            <Link
              href="#"
              className="text-xs font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
            >
              {t('contact')}
            </Link>
            <PrivacyPolicyDialog />
            <Link
              href={routes.terms}
              className="text-xs font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
            >
              {t('terms')}
            </Link>
            <Link
              href={routes.disclaimer}
              className="text-xs font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
            >
              {t('disclaimer')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
