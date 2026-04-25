import type { Metadata } from 'next';

import { AdPlaceholder } from '@/components/ad-placeholder';
import { FeaturedNewsListCard } from '@/components/featured-news-list-card';
import { NewsFilterBar } from '@/components/news-filter-bar';
import { NewsListBottomSection } from '@/components/news-list-bottom-section';
import { NewsListHero } from '@/components/news-list-hero';
import { NewsListPagination } from '@/components/news-list-pagination';
import { NewsStoryCard } from '@/components/news-story-card';
import { newsListFeatured, newsListHero, newsListStories } from '@/mocks/news';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: newsListHero.title,
    description: newsListHero.description,
  };
}

export default function NewsListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
      <NewsListHero />
      <FeaturedNewsListCard featured={newsListFeatured} />
      <AdPlaceholder type="leaderboard" articleStyle className="mb-12" />
      <NewsFilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {newsListStories.map((story) => (
          <NewsStoryCard key={story.slug} story={story} />
        ))}
      </div>
      <NewsListPagination />
      <NewsListBottomSection />
    </div>
  );
}
