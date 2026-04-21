import { getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { fontMono, fontSans } from './fonts';
import './global.css';

import { cookies } from 'next/headers';

import { isAppLocale, localeToHtmlLang } from '@/i18n/locales';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const localeRaw = await getLocale();
  const locale = isAppLocale(localeRaw) ? localeRaw : 'en';
  const htmlLang = localeToHtmlLang(locale);

  const cookieStore = await cookies();
  const theme = cookieStore.get('bb_theme')?.value;
  const themeClass =
    theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : '';

  return (
    <html
      lang={htmlLang}
      dir="ltr"
      className={`${fontSans.variable} ${fontMono.variable} ${themeClass}`.trim()}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
