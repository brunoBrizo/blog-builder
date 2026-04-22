import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@blog-builder/ui';
import type { Article } from '../mocks/articles';
import { cn } from '@blog-builder/ui';

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const isCornerstone = article.variant === 'cornerstone';

  return (
    <article
      className={cn(
        'group relative flex flex-col sm:flex-row gap-6 sm:gap-8 pb-10 border-b border-zinc-100',
        className,
      )}
    >
      <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read article: {article.title}</span>
      </Link>

      <div
        className={cn(
          'w-full bg-zinc-100 rounded-lg overflow-hidden relative shrink-0',
          isCornerstone
            ? 'sm:w-2/5 aspect-[16/10] sm:aspect-[4/3]'
            : 'sm:w-1/3 aspect-[16/10] sm:aspect-square',
        )}
      >
        {isCornerstone && (
          <div className="absolute top-2 left-2 z-20 bg-indigo-50/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-indigo-700 shadow-sm border border-indigo-200/50">
            Cornerstone
          </div>
        )}
        <Image
          src={article.featuredImageUrl}
          alt={article.title}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div
        className={cn(
          'flex flex-col flex-grow',
          !isCornerstone && 'justify-center',
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant={
              article.category.color as
                | 'default'
                | 'secondary'
                | 'outline'
                | 'destructive'
                | 'violet'
                | 'emerald'
                | 'blue'
                | 'amber'
                | 'zinc'
                | null
                | undefined
            }
          >
            {article.category.name}
          </Badge>
        </div>

        <h2
          className={cn(
            'font-medium tracking-tight text-zinc-900 mb-3 group-hover:text-indigo-600 transition-colors',
            isCornerstone ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl',
          )}
        >
          {article.title}
        </h2>

        <p className="text-sm text-zinc-500 mb-5 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
          {isCornerstone ? (
            <>
              <div className="flex items-center gap-2 relative z-20">
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  width={20}
                  height={20}
                  className="rounded-full grayscale opacity-80 object-cover"
                />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Updated {article.publishedAt}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                <span>{article.readTimeMin} min read</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span>{article.publishedAt}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span>{article.readTimeMin} min read</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
