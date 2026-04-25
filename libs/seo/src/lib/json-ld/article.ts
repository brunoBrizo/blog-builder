export type ArticleJsonLdInput = {
  headline: string;
  image: string[];
  datePublished: string;
  dateModified?: string | undefined;
  author: { name: string; url?: string | undefined };
  publisher: { name: string; logo?: string | undefined };
  articleSection?: string | undefined;
  inLanguage: string;
  description?: string | undefined;
  url: string;
};

export function buildArticleJsonLd(input: ArticleJsonLdInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    image: input.image,
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: {
      '@type': 'Person',
      name: input.author.name,
      ...(input.author.url ? { url: input.author.url } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: input.publisher.name,
      ...(input.publisher.logo ? { logo: input.publisher.logo } : {}),
    },
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    inLanguage: input.inLanguage,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-headline', '.article-body'],
    },
  };
}
