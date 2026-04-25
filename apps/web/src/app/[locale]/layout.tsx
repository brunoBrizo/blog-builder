import { AppToastProvider } from '@blog-builder/ui';
import { buildMetadata, getSiteUrl } from '@blog-builder/seo';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { AnalyticsPlaceholder } from '@/components/analytics-placeholder';
import { ConsentPlaceholder } from '@/components/consent-placeholder';
import { RootJsonLd } from '@/components/root-json-ld';
import { DecorativeGridBackground } from '@/components/decorative-grid-background';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SkipToContent } from '@/components/skip-to-content';
import { isAppLocale } from '@/i18n/locales';
import { routing } from '@/i18n/routing';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : 'en';
  const h = await headers();
  const pathname = h.get('x-pathname') ?? '/';
  const ogLocale =
    locale === 'pt-br' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US';

  const base = buildMetadata({
    locale,
    pathname,
    title: 'Blog Builder',
    description: 'AI & tech blog foundation.',
    siteName: 'Blog Builder',
    ogLocale,
    baseUrl: getSiteUrl(),
  });

  return {
    ...base,
    title: {
      default: 'Blog Builder',
      template: '%s · Blog Builder',
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      ...base.openGraph,
      siteName: 'Blog Builder',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const h = await headers();
  const canonicalPath = h.get('x-pathname') ?? '/';
  /** Locale-stripped path; `/articles` list uses longer solid band before mask fade (leaderboard). */
  const isArticlesList = canonicalPath === '/articles';

  const cookieStore = await cookies();
  const themeRaw = cookieStore.get('bb_theme')?.value;
  const themeCookie =
    themeRaw === 'dark' || themeRaw === 'light' ? themeRaw : null;

  return (
    <NextIntlClientProvider messages={messages}>
      <AppToastProvider>
        <DecorativeGridBackground
          fadeClassName={
            isArticlesList ? 'mask-radial-fade-ad' : 'mask-radial-fade'
          }
          {...(isArticlesList ? { heightClassName: 'h-[720px]' as const } : {})}
        />
        <SkipToContent />
        <SiteHeader themeCookie={themeCookie} />
        <main id="main" tabIndex={-1} className="outline-none relative z-10">
          {children}
        </main>
        <SiteFooter />
        <AnalyticsPlaceholder />
        <ConsentPlaceholder />
        <RootJsonLd />
      </AppToastProvider>
    </NextIntlClientProvider>
  );
}
