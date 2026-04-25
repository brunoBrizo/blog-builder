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
import type { Article } from '../mocks/articles';

type ArticleDetailViewProps = {
  article: Article;
};

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  const { detail, title, author, publishedAt, readTimeMin, featuredImageUrl } =
    article;

  const shortTitle =
    title.length > 42 ? `${title.slice(0, 40).trim()}\u2026` : title;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
      <ArticleBreadcrumbs
        parentHref={detail.breadcrumb.parentHref}
        parentLabel={detail.breadcrumb.parentLabel}
        currentTitle={shortTitle}
      />

      <div className="hidden sm:block mb-10">
        <AdPlaceholder type="leaderboard" articleStyle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-20">
        <article className="lg:col-span-8 flex flex-col min-w-0">
          <ArticleHero
            title={title}
            subhead={detail.subhead}
            categoryPillLabel={
              detail.categoryPillLabel ?? article.category.name
            }
            showNewspaperIcon={Boolean(detail.showCategoryNewspaperIcon)}
            author={author}
            publishedAt={publishedAt}
            readTimeMin={readTimeMin}
          />

          <ArticleFeaturedImage
            imageUrl={featuredImageUrl}
            imageAlt={title}
            caption={detail.featuredImageCaption}
          />

          <ArticleBody blocks={detail.blocks} />

          <ArticleTopics tags={detail.topicTags} />

          <AuthorBox
            variant="articleEeat"
            author={author}
            {...(detail.authorRoleInArticle != null
              ? { roleOverride: detail.authorRoleInArticle }
              : {})}
            {...(detail.authorBioInArticle != null
              ? { bioOverride: detail.authorBioInArticle }
              : {})}
          />

          <RelatedArticleNavigation related={detail.related} />
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <TableOfContents items={detail.toc} variant="article" />
            <AdPlaceholder type="sidebar" articleStyle />
            <NewsletterCard variant="article" />
          </div>
        </aside>
      </div>
    </main>
  );
}
