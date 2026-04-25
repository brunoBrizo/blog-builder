import Image from 'next/image';
import { Clock, Crown } from 'lucide-react';

import { Link } from '@/i18n/navigation';

import type { TutorialListFeatured } from '../mocks/tutorials';

type FeaturedTutorialListCardProps = {
  featured: TutorialListFeatured;
};

export function FeaturedTutorialListCard({
  featured,
}: FeaturedTutorialListCardProps) {
  return (
    <article className="group relative flex flex-col lg:flex-row bg-white rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-500 mb-12 overflow-hidden">
      <Link
        href={`/tutorials/${featured.slug}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-[2rem]"
      >
        <span className="sr-only">Read tutorial: {featured.listTitle}</span>
      </Link>

      <div className="lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1 relative z-20 bg-white">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium mb-6 w-fit border border-indigo-100/50">
          <Crown className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
          {featured.badgeLabel}
        </div>
        <h2 className="font-display text-2xl lg:text-4xl font-medium tracking-tight text-zinc-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
          {featured.listTitle}
        </h2>
        <p className="text-sm lg:text-base font-light text-zinc-500 mb-8 leading-relaxed">
          {featured.listSubhead}
        </p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-3 relative z-20">
            <Image
              src={featured.authorAvatarUrl}
              alt={featured.authorName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200"
            />
            <div>
              <p className="text-xs font-medium text-zinc-900">
                {featured.authorName}
              </p>
              <p className="text-xs font-light text-zinc-500">
                {featured.authorRole}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-light text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/50">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
            {featured.readTimeLabel}
          </div>
        </div>
      </div>

      <div className="lg:w-[55%] aspect-video lg:aspect-auto min-h-[220px] lg:min-h-[280px] relative overflow-hidden order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-zinc-100">
        <Image
          src={featured.imageUrl}
          alt={featured.imageAlt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
      </div>
    </article>
  );
}
