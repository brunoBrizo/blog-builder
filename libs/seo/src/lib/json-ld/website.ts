export type WebSiteJsonLdInput = {
  url: string;
  name: string;
  description: string;
  inLanguage: string[];
};

export function buildWebSiteJsonLd(input: WebSiteJsonLdInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage,
  };
}
