export const locales = ['en', 'pt-br', 'es'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';

export function localeToHtmlLang(locale: AppLocale): string {
  if (locale === 'pt-br') {
    return 'pt-BR';
  }
  if (locale === 'es') {
    return 'es';
  }
  return 'en';
}

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}
