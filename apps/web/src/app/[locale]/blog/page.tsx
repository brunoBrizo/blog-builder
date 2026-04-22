import { ArticleCard } from '../../../components/article-card';
import { SidebarCategories } from '../../../components/sidebar-categories';
import { AdPlaceholder } from '../../../components/ad-placeholder';
import { NewsletterCard } from '../../../components/newsletter-card';
import { Pagination } from '../../../components/pagination';
import { AuthorBox } from '../../../components/author-box';

import { articles } from '../../../mocks/articles';
import { categories } from '../../../mocks/categories';
import { authors } from '../../../mocks/authors';

export default function BlogListPage() {
  const marcus = authors[0];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Page Header */}
      <div className="mb-10 lg:mb-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
          Latest Insights
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 max-w-2xl">
          Deep dives, tutorials, and analysis on the rapidly evolving landscape
          of artificial intelligence, software development, and automation.
        </p>
      </div>

      {/* Leaderboard Ad Placeholder */}
      <AdPlaceholder type="leaderboard" className="mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Articles Feed (Left Column) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {/* Pagination Placeholder */}
          <Pagination currentPage={1} totalPages={3} />
        </div>

        {/* Sidebar (Right Column) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* E-E-A-T Author Box */}
            <AuthorBox author={marcus} variant="sidebar" />

            {/* Sidebar Ad Placeholder */}
            <AdPlaceholder type="sidebar" />

            {/* Newsletter CTA */}
            <NewsletterCard />

            {/* Categories */}
            <SidebarCategories categories={categories} />
          </div>
        </aside>
      </div>
    </main>
  );
}
