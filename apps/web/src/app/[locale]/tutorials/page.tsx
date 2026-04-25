import type { Metadata } from 'next';

import { AdPlaceholder } from '@/components/ad-placeholder';
import { FeaturedTutorialListCard } from '@/components/featured-tutorial-list-card';
import { TutorialFilterBar } from '@/components/tutorial-filter-bar';
import { TutorialMasterclassCard } from '@/components/tutorial-masterclass-card';
import { TutorialsListBottomSection } from '@/components/tutorials-list-bottom-section';
import { TutorialsListHero } from '@/components/tutorials-list-hero';
import { TutorialsListPagination } from '@/components/tutorials-list-pagination';
import {
  tutorialListFeatured,
  tutorialMasterclassList,
  tutorialsListPageHero,
} from '@/mocks/tutorials';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tutorials & Masterclasses',
    description:
      'Discover our latest deep-dives, tutorials, and reviews on AI tools, development frameworks, and tech trends.',
  };
}

export default function TutorialsListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
      <TutorialsListHero {...tutorialsListPageHero} />
      <FeaturedTutorialListCard featured={tutorialListFeatured} />
      <AdPlaceholder type="leaderboard" articleStyle className="mb-12" />
      <TutorialFilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tutorialMasterclassList.map((item) => (
          <TutorialMasterclassCard key={item.slug} item={item} />
        ))}
      </div>
      <TutorialsListPagination />
      <TutorialsListBottomSection />
    </div>
  );
}
