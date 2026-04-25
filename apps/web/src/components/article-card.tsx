import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Crown, Book, PlayCircle, Server, Code2 } from 'lucide-react';
import type { Article } from '../mocks/articles';
import { cn } from '@blog-builder/ui';

interface ArticleCardProps {
  article: Article;
  variant?: 'cornerstone' | 'standard';
  className?: string;
}

export function ArticleCard({ article, variant, className }: ArticleCardProps) {
  const isCornerstone =
    variant === 'cornerstone' || article.variant === 'cornerstone';

  // Choose an icon and color based on category name
  const categoryName = article.category.name.toLowerCase();
  let CategoryIcon = Book;
  let categoryColorClass = 'text-indigo-600';
  let groupHoverClass = 'group-hover:text-indigo-600';

  if (categoryName.includes('react') || categoryName.includes('walkthrough')) {
    CategoryIcon = PlayCircle;
    categoryColorClass = 'text-violet-600';
    groupHoverClass = 'group-hover:text-violet-600';
  } else if (
    categoryName.includes('llm') ||
    categoryName.includes('architecture')
  ) {
    CategoryIcon = Server;
    categoryColorClass = 'text-emerald-600';
    groupHoverClass = 'group-hover:text-emerald-600';
  } else if (
    categoryName.includes('typescript') ||
    categoryName.includes('development')
  ) {
    CategoryIcon = Code2;
    categoryColorClass = 'text-sky-600';
    groupHoverClass = 'group-hover:text-sky-600';
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col sm:flex-row gap-5 sm:gap-6 p-4 -mx-4 rounded-2xl hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent hover:border-zinc-200/60 transition-all duration-300 ease-out',
        className,
      )}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-2xl"
      >
        <span className="sr-only">Read article: {article.title}</span>
      </Link>

      <div
        className={cn(
          'w-full sm:w-[32%] aspect-[16/10] bg-zinc-100 rounded-xl overflow-hidden relative shrink-0 border border-zinc-200/50 shadow-sm',
        )}
      >
        {isCornerstone && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-sm">
            <Crown className="text-indigo-600 size-3" strokeWidth={2} />
            <span className="text-xs font-medium tracking-wide uppercase text-zinc-800">
              Cornerstone
            </span>
          </div>
        )}
        <Image
          src={article.featuredImageUrl}
          alt={article.title}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className="flex flex-col justify-center sm:w-[68%]">
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium mb-2',
            categoryColorClass,
          )}
        >
          <CategoryIcon className="size-4" strokeWidth={2} />
          {article.category.name}
        </div>

        <h2
          className={cn(
            'font-display text-lg sm:text-xl font-medium tracking-tight text-zinc-900 mb-2 transition-colors leading-snug',
            groupHoverClass,
          )}
        >
          {article.title}
        </h2>

        <p className="text-sm font-light text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCornerstone ? (
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover border border-zinc-200"
              />
            ) : null}
            <span
              className={cn(
                isCornerstone
                  ? 'text-xs font-medium text-zinc-700'
                  : 'text-xs font-light text-zinc-400 font-medium text-zinc-600',
              )}
            >
              {article.author.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-light text-zinc-400">
            <span>{article.publishedAt}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>{article.readTimeMin} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
