import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getSiteUrl,
} from '@blog-builder/seo';

import { locales, localeToHtmlLang } from '@/i18n/locales';

export function RootJsonLd() {
  const base = getSiteUrl();
  const inLanguage = locales.map(localeToHtmlLang);
  const website = buildWebSiteJsonLd({
    url: base,
    name: 'Blog Builder',
    description: 'AI & tech blog foundation.',
    inLanguage,
  });
  const org = buildOrganizationJsonLd({
    url: base,
    name: 'Blog Builder',
    description: 'AI & tech blog foundation.',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}
