import type { Metadata } from 'next';

import { buildOpenGraph } from './build-open-graph';
import { buildTwitter } from './build-twitter';
import { canonicalUrl } from './canonical-url';
import { buildHreflangMap } from './hreflang';
import { getSiteUrl } from './site-url';

import type { SeoLocale } from './canonical-url';

export type BuildMetadataInput = {
  locale: SeoLocale;
  /** Path without locale prefix (e.g. `/` or `/blog`). */
  pathname: string;
  title: string;
  description: string;
  siteName: string;
  /** BCP 47 for Open Graph locale (e.g. `en_US`, `pt_BR`). */
  ogLocale: string;
  baseUrl?: string;
  robots?: Metadata['robots'];
  openGraphType?: 'website' | 'article';
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const baseUrl = input.baseUrl ?? getSiteUrl();
  const canonical = canonicalUrl(input.locale, input.pathname, baseUrl);
  const languages = buildHreflangMap(input.pathname, baseUrl);

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
      languages,
    },
    robots: input.robots ?? { index: true, follow: true },
    openGraph: buildOpenGraph({
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: input.siteName,
      locale: input.ogLocale,
      ...(input.openGraphType !== undefined
        ? { type: input.openGraphType }
        : {}),
    }),
    twitter: buildTwitter({
      title: input.title,
      description: input.description,
    }),
  };
}
