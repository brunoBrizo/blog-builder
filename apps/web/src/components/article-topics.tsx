import { cn } from '@blog-builder/ui';
import type { PublicTag } from '@blog-builder/shared-types';

type ArticleTopicsProps = {
  tags: PublicTag[];
  className?: string;
};

export function ArticleTopics({ tags, className }: ArticleTopicsProps) {
  return (
    <div className={cn('mt-12 pt-8 border-t border-zinc-200/80', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-zinc-900 mr-1">Topics:</span>
        {tags.map((t) => (
          <span
            key={t.id}
            className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200/80 rounded-lg shadow-sm"
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
