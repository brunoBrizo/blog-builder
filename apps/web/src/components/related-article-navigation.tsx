import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@blog-builder/ui';

type ArticleRelatedNav = {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

type RelatedArticleNavigationProps = {
  related: ArticleRelatedNav;
  /** URL segment under locale: `articles` (default), `tutorials`, or `news` */
  linkBase?: 'articles' | 'tutorials' | 'news';
  className?: string;
};

export function RelatedArticleNavigation({
  related,
  linkBase = 'articles',
  className,
}: RelatedArticleNavigationProps) {
  if (!related.previous && !related.next) {
    return null;
  }

  const path = (slug: string) => `/${linkBase}/${slug}`;

  return (
    <div
      className={cn('mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4', className)}
    >
      {related.previous && (
        <Link
          href={path(related.previous.slug)}
          className="group p-6 bg-white border border-zinc-200/80 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
        >
          <span className="text-xs font-medium text-zinc-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Previous
          </span>
          <span className="font-display text-lg font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {related.previous.title}
          </span>
        </Link>
      )}
      {related.next && (
        <Link
          href={path(related.next.slug)}
          className="group p-6 bg-white border border-zinc-200/80 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-right sm:col-start-2"
        >
          <span className="text-xs font-medium text-zinc-400 mb-3 flex items-center justify-end gap-1.5 uppercase tracking-wider">
            Next
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
          <span className="font-display text-lg font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {related.next.title}
          </span>
        </Link>
      )}
    </div>
  );
}
