import { Link } from '@/i18n/navigation';
import { cn } from '@blog-builder/ui';
import type { ArticleTopicTag } from '../mocks/articles';

type ArticleTopicsProps = {
  tags: ArticleTopicTag[];
  className?: string;
};

export function ArticleTopics({ tags, className }: ArticleTopicsProps) {
  return (
    <div className={cn('mt-12 pt-8 border-t border-zinc-200/80', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-zinc-900 mr-1">Topics:</span>
        {tags.map((t) => {
          const content = t.label;
          if (t.href) {
            return (
              <Link
                key={t.label + t.href}
                href={t.href}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200/80 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
              >
                {content}
              </Link>
            );
          }
          return (
            <span
              key={t.label}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200/80 rounded-lg shadow-sm"
            >
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}
