import { canonicalUrl } from './canonical-url';

import type { SeoLocale } from './canonical-url';

const locales: SeoLocale[] = ['en', 'pt-br', 'es'];
const defaultLocale: SeoLocale = 'en';

export type HreflangMap = Record<string, string>;

/**
 * Alternate language URLs for a canonical path (no locale prefix).
 */
export function buildHreflangMap(path: string, baseUrl?: string): HreflangMap {
  const map: HreflangMap = {};
  for (const locale of locales) {
    const tag = locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es' : 'en';
    map[tag] = canonicalUrl(locale, path, baseUrl);
  }
  map['x-default'] = canonicalUrl(defaultLocale, path, baseUrl);
  return map;
}
