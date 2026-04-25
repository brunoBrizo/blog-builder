import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@blog-builder/ui';

type ArticleBreadcrumbsProps = {
  parentHref: string;
  parentLabel: string;
  currentTitle: string;
  className?: string;
};

export function ArticleBreadcrumbs({
  parentHref,
  parentLabel,
  currentTitle,
  className,
}: ArticleBreadcrumbsProps) {
  return (
    <nav
      className={cn(
        'flex items-center gap-2 text-xs font-medium text-zinc-500 mb-8 relative z-20',
        className,
      )}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-sm"
      >
        Home
      </Link>
      <ChevronRight
        className="w-3.5 h-3.5 text-zinc-400 shrink-0"
        strokeWidth={1.5}
      />
      <Link
        href={parentHref}
        className="hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-sm"
      >
        {parentLabel}
      </Link>
      <ChevronRight
        className="w-3.5 h-3.5 text-zinc-400 shrink-0"
        strokeWidth={1.5}
      />
      <span className="text-zinc-900 truncate max-w-[200px] sm:max-w-xs">
        {currentTitle}
      </span>
    </nav>
  );
}
