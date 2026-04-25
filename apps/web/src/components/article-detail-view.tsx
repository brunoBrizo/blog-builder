import { ArticleBreadcrumbs } from './article-breadcrumbs';
import { ArticleHero } from './article-hero';
import { ArticleFeaturedImage } from './article-featured-image';
import { ArticleBody } from './article-body';
import { ArticleTopics } from './article-topics';
import { RelatedArticleNavigation } from './related-article-navigation';
import { AuthorBox } from './author-box';
import { TableOfContents } from './table-of-contents';
import { NewsletterCard } from './newsletter-card';
import { AdPlaceholder } from './ad-placeholder';
import { ArticleFaq } from './article-faq';
import { ArticleCitations } from './article-citations';
import type { PublicArticleDetail } from '@blog-builder/shared-types';

type ArticleDetailViewProps = {
  article: PublicArticleDetail;
  toc: { id: string; title: string }[];
  bodyHtml: string;
};

function formatDate(date: Date | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleDetailView({
  article,
  toc,
  bodyHtml,
}: ArticleDetailViewProps) {
  const shortTitle =
    article.title.length > 42
      ? `${article.title.slice(0, 40).trim()}\u2026`
      : article.title;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
      <ArticleBreadcrumbs
        parentHref="/articles"
        parentLabel={article.category?.name ?? 'Articles'}
        currentTitle={shortTitle}
      />

      <div className="hidden sm:block mb-10">
        <AdPlaceholder type="leaderboard" articleStyle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-20">
        <article className="lg:col-span-8 flex flex-col min-w-0">
          <ArticleHero
            title={article.title}
            subhead={article.subtitle ?? article.tldr}
            categoryPillLabel={article.category?.name ?? 'Article'}
            showNewspaperIcon={false}
            author={article.author}
            publishedAt={formatDate(article.publishedAt)}
            readTimeMin={article.readingTimeMinutes}
          />

          <ArticleFeaturedImage
            imageUrl={article.coverImageUrl ?? ''}
            imageAlt={article.title}
            caption=""
          />

          {article.keyTakeaways.length > 0 && (
            <div className="my-8 p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl">
              <h3 className="font-display text-lg font-medium text-zinc-900 mb-4">
                Key Takeaways
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 marker:text-indigo-400">
                {article.keyTakeaways.map((item, i) => (
                  <li key={i} className="pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ArticleBody html={bodyHtml} />

          <ArticleFaq faq={article.faq} />

          <ArticleCitations citations={article.citations} />

          <ArticleTopics tags={article.tags} />

          <AuthorBox variant="articleEeat" author={article.author} />

          <RelatedArticleNavigation
            related={article.neighbors}
            linkBase="articles"
          />
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <TableOfContents items={toc} variant="article" />
            <AdPlaceholder type="sidebar" articleStyle />
            <NewsletterCard variant="article" />
          </div>
        </aside>
      </div>
    </main>
  );
}
