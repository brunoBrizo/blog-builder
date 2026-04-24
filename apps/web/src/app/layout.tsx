import { getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { fontMono, fontSans, fontDisplay } from './fonts';
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
      className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} ${themeClass}`.trim()}
      suppressHydrationWarning
    >
      <body className="bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden relative min-h-dvh">
        {children}
      </body>
    </html>
  );
}
