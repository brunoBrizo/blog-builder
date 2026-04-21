import { getSiteUrl } from './site-url';

export type SeoLocale = 'en' | 'pt-br' | 'es';

const defaultLocale: SeoLocale = 'en';

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Full canonical URL for a locale and path (path without locale prefix, e.g. `/blog`).
 */
export function canonicalUrl(
  locale: SeoLocale,
  path: string,
  baseUrl: string = getSiteUrl(),
): string {
  const p = normalizePath(path);
  if (locale === defaultLocale) {
    return `${baseUrl}${p || '/'}`;
  }
  return `${baseUrl}/${locale}${p}`;
}
