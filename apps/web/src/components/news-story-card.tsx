import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  Clock,
  Scale,
  Server,
  Smartphone,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@blog-builder/ui';

import type { NewsListStory, NewsStoryAccent } from '../mocks/news';

const accentTitle: Record<NewsStoryAccent, string> = {
  indigo: 'group-hover:text-indigo-600',
  emerald: 'group-hover:text-emerald-600',
  amber: 'group-hover:text-amber-600',
  rose: 'group-hover:text-rose-600',
};

const accentCta: Record<NewsStoryAccent, string> = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  rose: 'text-rose-600',
};

type NewsStoryCardProps = {
  story: NewsListStory;
};

function TagIcon({ name }: { name: NewsListStory['tag']['icon'] }) {
  const className = 'w-4 h-4';
  switch (name) {
    case 'smartphone':
      return <Smartphone className={className} strokeWidth={1.5} aria-hidden />;
    case 'server':
      return <Server className={className} strokeWidth={1.5} aria-hidden />;
    case 'scale':
      return <Scale className={className} strokeWidth={1.5} aria-hidden />;
    case 'bot':
      return <Bot className={className} strokeWidth={1.5} aria-hidden />;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}

function StoryImageBlock({
  story,
  className,
}: {
  story: NewsListStory;
  className?: string;
}) {
  const isRose = story.tag.tone === 'rose';
  return (
    <div
      className={cn(
        'relative w-full bg-zinc-900 overflow-hidden border-zinc-100',
        className,
      )}
    >
      <Image
        src={story.imageUrl}
        alt={story.imageAlt}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />
      <div className="absolute top-5 left-5 z-10">
        <span
          className={cn(
            'px-3 py-1.5 rounded-lg backdrop-blur-md border text-white text-xs font-medium shadow-sm flex items-center gap-1.5',
            isRose
              ? 'bg-rose-500/90 border-rose-400/30'
              : 'bg-white/20 border-white/30',
          )}
        >
          <TagIcon name={story.tag.icon} />
          {story.tag.label}
        </span>
      </div>
      {story.layout === 'stacked' && !story.timeInContent ? (
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 backdrop-blur-sm border border-white/10 text-white text-xs font-medium shadow-sm">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
            {story.timeLabel}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function NewsStoryCard({ story }: NewsStoryCardProps) {
  const span = story.layout === 'stacked' ? 'md:col-span-1' : 'md:col-span-2';
  const titleC = accentTitle[story.accent];
  const ctaC = accentCta[story.accent];

  if (story.layout === 'stacked') {
    return (
      <article
        className={cn(
          'group relative flex flex-col bg-white rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-zinc-300 transition-all duration-500 ease-out overflow-hidden',
          span,
        )}
      >
        <Link
          href={`/news/${story.slug}`}
          className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-[2rem]"
        >
          <span className="sr-only">Read article: {story.title}</span>
        </Link>
        <StoryImageBlock story={story} className="aspect-[16/10] border-b" />
        <div className="flex flex-col flex-1 p-6 bg-white relative z-20">
          <h2
            className={cn(
              'font-display text-xl font-medium tracking-tight text-zinc-900 mb-2 leading-snug transition-colors',
              titleC,
            )}
          >
            {story.title}
          </h2>
          <p className="text-sm font-light text-zinc-500 mb-6 line-clamp-2 leading-relaxed">
            {story.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-100">
            <div className="flex items-center gap-2.5 relative z-30">
              <Image
                src={story.authorAvatarUrl}
                alt={story.authorName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-zinc-200"
              />
              <span className="text-xs font-medium text-zinc-700">
                {story.authorName}
              </span>
            </div>
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all duration-300',
                ctaC,
              )}
            >
              {story.ctaLabel}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden />
            </div>
          </div>
        </div>
      </article>
    );
  }

  const isRight = story.layout === 'wide-right';
  return (
    <article
      className={cn(
        'group relative flex flex-col lg:flex-row bg-white rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-zinc-300 transition-all duration-500 ease-out overflow-hidden',
        span,
      )}
    >
      <Link
        href={`/news/${story.slug}`}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-[2rem]"
      >
        <span className="sr-only">Read article: {story.title}</span>
      </Link>
      {isRight ? (
        <>
          <div className="flex flex-col flex-1 p-6 md:p-8 lg:p-10 bg-white relative z-20 order-2 lg:order-1 min-w-0">
            {story.timeInContent ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 text-zinc-500 text-xs font-medium w-fit mb-4">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
                {story.timeLabel}
              </div>
            ) : null}
            <h2
              className={cn(
                'font-display text-2xl lg:text-3xl font-medium tracking-tight text-zinc-900 mb-3 leading-snug transition-colors',
                titleC,
              )}
            >
              {story.title}
            </h2>
            <p className="text-sm md:text-base font-light text-zinc-500 mb-6 leading-relaxed">
              {story.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-100">
              <div className="flex items-center gap-2.5 relative z-30">
                <Image
                  src={story.authorAvatarUrl}
                  alt={story.authorName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                />
                <span className="text-xs font-medium text-zinc-700">
                  {story.authorName}
                </span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all duration-300',
                  ctaC,
                )}
              >
                {story.ctaLabel}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden />
              </div>
            </div>
          </div>
          <StoryImageBlock
            story={story}
            className="w-full lg:w-2/5 lg:min-w-0 lg:max-w-[40%] aspect-[16/9] lg:aspect-auto min-h-[200px] border-b lg:border-b-0 lg:border-l order-1 lg:order-2"
          />
        </>
      ) : (
        <>
          <StoryImageBlock
            story={story}
            className="w-full lg:w-2/5 lg:min-w-0 lg:max-w-[40%] aspect-[16/9] lg:aspect-auto min-h-[200px] border-b lg:border-b-0 lg:border-r"
          />
          <div className="flex flex-col flex-1 p-6 md:p-8 lg:p-10 bg-white relative z-20 min-w-0">
            {story.timeInContent ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/50 text-zinc-500 text-xs font-medium w-fit mb-4">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
                {story.timeLabel}
              </div>
            ) : null}
            <h2
              className={cn(
                'font-display text-2xl lg:text-3xl font-medium tracking-tight text-zinc-900 mb-3 leading-snug transition-colors',
                titleC,
              )}
            >
              {story.title}
            </h2>
            <p className="text-sm md:text-base font-light text-zinc-500 mb-6 leading-relaxed">
              {story.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-100">
              <div className="flex items-center gap-2.5 relative z-30">
                <Image
                  src={story.authorAvatarUrl}
                  alt={story.authorName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                />
                <span className="text-xs font-medium text-zinc-700">
                  {story.authorName}
                </span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium group-hover:gap-2.5 transition-all duration-300',
                  ctaC,
                )}
              >
                {story.ctaLabel}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden />
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
