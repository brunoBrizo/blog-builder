import Image from 'next/image';
import { Book, Clock, Newspaper } from 'lucide-react';
import { ShareButtons } from './share-buttons';
import { cn } from '@blog-builder/ui';
import type { Author } from '../mocks/authors';

type ArticleHeroProps = {
  title: string;
  subhead: string;
  /** Category pill label (e.g. Tech News) */
  categoryPillLabel: string;
  showNewspaperIcon: boolean;
  author: Author;
  publishedAt: string;
  readTimeMin: number;
};

function CategoryPill({
  label,
  showNewspaperIcon = false,
}: {
  label: string;
  showNewspaperIcon?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100/50">
      {showNewspaperIcon ? (
        <Newspaper className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      ) : (
        <Book className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      )}
      {label}
    </div>
  );
}

export function ArticleHero({
  title,
  subhead,
  categoryPillLabel,
  showNewspaperIcon,
  author,
  publishedAt,
  readTimeMin,
}: ArticleHeroProps) {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <CategoryPill
          label={categoryPillLabel}
          showNewspaperIcon={showNewspaperIcon}
        />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 mb-6 leading-tight">
        {title}
      </h1>

      <p className="text-lg font-light text-zinc-500 mb-8 leading-relaxed">
        {subhead}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-zinc-200/80">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={40}
            height={40}
            className={cn(
              'w-10 h-10 rounded-full object-cover border border-zinc-200',
              'shrink-0',
            )}
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-zinc-900">
              {author.name}
            </div>
            <div className="flex items-center gap-2 text-xs font-light text-zinc-500 mt-0.5">
              <span className="truncate">{publishedAt}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" strokeWidth={1.5} />
                {readTimeMin} min read
              </span>
            </div>
          </div>
        </div>

        <ShareButtons variant="article" className="shrink-0" />
      </div>
    </header>
  );
}
