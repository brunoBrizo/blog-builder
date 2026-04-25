import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildFaqPageJsonLd,
  buildMetadata,
  canonicalUrl,
  getSiteUrl,
  type SeoLocale,
} from '@blog-builder/seo';

import { ArticleDetailView } from '@/components/article-detail-view';
import { getArticleBySlug, listTopSlugs } from '@/lib/api-client/articles';
import { extractTocFromHtml } from '@/lib/article-toc';
import { injectCitationLinks } from '@/lib/article-citations';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function dbLocaleToSeoLocale(dbLocale: string): SeoLocale {
  if (dbLocale === 'pt-BR') return 'pt-br';
  if (dbLocale === 'es') return 'es';
  return 'en';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as SeoLocale;
  const article = await getArticleBySlug(rawLocale, slug);

  if (!article) {
    return { title: 'Not found' };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.tldr;
  const pathname = `/articles/${slug}`;
  const ogLocale =
    locale === 'pt-br' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US';

  const base = buildMetadata({
    locale,
    pathname,
    title,
    description,
    siteName: 'Blog Builder',
    ogLocale,
    openGraphType: 'article',
  });

  // Build hreflang map from actual article translations
  const baseUrl = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const t of article.translations) {
    const tag =
      t.locale === 'pt-BR' ? 'pt-BR' : t.locale === 'es' ? 'es' : 'en';
    languages[tag] = canonicalUrl(
      dbLocaleToSeoLocale(t.locale),
      `/articles/${t.slug}`,
      baseUrl,
    );
  }
  languages['x-default'] = canonicalUrl('en', pathname, baseUrl);

  return {
    ...base,
    alternates: {
      ...base.alternates,
      languages,
    },
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.publishedAt?.toISOString(),
      authors: [article.author.fullName],
      section: article.category?.name ?? undefined,
      tags: article.tags.map((t) => t.name),
    },
  };
}

export async function generateStaticParams() {
  const locales = ['en', 'pt-br', 'es'];
  const limit = 50;
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    try {
      const slugs = await listTopSlugs(locale, limit);
      for (const { slug } of slugs) {
        params.push({ locale, slug });
      }
    } catch {
      // API may be unavailable at build time; skip this locale
    }
  }

  return params;
}

export const revalidate = 60;

export default async function ArticleBySlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(locale, slug);

  if (!article) {
    notFound();
  }

  const toc = extractTocFromHtml(article.bodyHtml);
  const bodyHtml = injectCitationLinks(
    article.bodyHtml,
    article.citations.length,
  );

  const baseUrl = getSiteUrl();
  const articleUrl = canonicalUrl(locale as SeoLocale, `/articles/${slug}`);

  const jsonLdArticle = buildArticleJsonLd({
    headline: article.title,
    image: article.coverImageUrl ? [article.coverImageUrl] : [],
    datePublished: article.publishedAt?.toISOString() ?? '',
    dateModified: article.publishedAt?.toISOString(),
    author: { name: article.author.fullName },
    publisher: { name: 'Blog Builder' },
    articleSection: article.category?.name ?? undefined,
    inLanguage: locale,
    description: article.metaDescription || article.tldr,
    url: articleUrl,
  });

  const jsonLdBreadcrumb = buildBreadcrumbListJsonLd({
    items: [
      { name: 'Home', item: baseUrl },
      {
        name: article.category?.name ?? 'Articles',
        item: `${baseUrl}/${locale}/articles`,
      },
      { name: article.title, item: articleUrl },
    ],
  });

  const jsonLdFaq =
    article.faq.length > 0
      ? buildFaqPageJsonLd({
          questions: article.faq.map((q) => ({
            name: q.question,
            acceptedAnswer: { text: q.answer },
          })),
        })
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <ArticleDetailView article={article} toc={toc} bodyHtml={bodyHtml} />
    </>
  );
}
