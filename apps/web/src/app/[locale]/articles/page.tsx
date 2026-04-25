import { Fragment } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ArticleCard } from '../../../components/article-card';
import { SidebarCategories } from '../../../components/sidebar-categories';
import { AdPlaceholder } from '../../../components/ad-placeholder';
import { NewsletterCard } from '../../../components/newsletter-card';
import { Pagination } from '../../../components/pagination';
import { AuthorBox } from '../../../components/author-box';

import type { PublicAuthor } from '@blog-builder/shared-types';

import { articles } from '../../../mocks/articles';
import { categories } from '../../../mocks/categories';
import { authors } from '../../../mocks/authors';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('placeholders');

  return {
    title: t('articlesListTitle'),
    description: t('articlesListLead'),
  };
}

export default async function ArticlesListPage() {
  const t = await getTranslations('placeholders');
  const marcus = authors[0];

  const sidebarAuthor: PublicAuthor | null = marcus
    ? {
        id: marcus.id,
        slug: marcus.slug,
        fullName: marcus.name,
        bio: marcus.bio,
        photoUrl: marcus.avatarUrl,
        expertise: [marcus.role],
        sameAs: Object.values(marcus.socials).filter(
          (v): v is string => typeof v === 'string' && v.length > 0,
        ),
      }
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
      <div className="mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-medium mb-4 shadow-sm">
          <span
            className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
            aria-hidden
          />
          {t('articlesListBadge')}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
          {t('articlesHeading')}
        </h1>
        <p className="text-base sm:text-lg font-light text-zinc-500 max-w-2xl leading-relaxed">
          {t('articlesListLead')}
        </p>
      </div>

      <AdPlaceholder type="leaderboard" className="mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-8 flex flex-col gap-2">
          {articles.map((article, index) => (
            <Fragment key={article.id}>
              <ArticleCard
                article={article}
                variant={index === 0 ? 'cornerstone' : 'standard'}
              />
              {index < articles.length - 1 && (
                <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200/60 to-transparent my-2" />
              )}
            </Fragment>
          ))}

          <Pagination currentPage={1} totalPages={3} />
        </div>

        <aside
          className="lg:col-span-4 space-y-8"
          aria-label={t('articlesListTitle')}
        >
          <div className="sticky top-24 space-y-8">
            {sidebarAuthor ? (
              <AuthorBox author={sidebarAuthor} variant="sidebar" />
            ) : null}
            <AdPlaceholder type="sidebar" />
            <NewsletterCard />
            <SidebarCategories categories={categories} />
          </div>
        </aside>
      </div>
    </div>
  );
}
