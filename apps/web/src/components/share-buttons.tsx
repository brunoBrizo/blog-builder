import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@blog-builder/ui';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  variant?: 'default' | 'article';
  className?: string;
}

const baseBtn =
  'flex items-center justify-center border text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400';

export function ShareButtons({
  className,
  variant = 'default',
}: ShareButtonsProps) {
  // In a real app, these props (url, title) would trigger share dialogs
  const isArticle = variant === 'article';
  const size = isArticle
    ? 'w-9 h-9 rounded-xl border-zinc-200/80 bg-white'
    : 'w-8 h-8 rounded-md border-zinc-200';
  const icon = isArticle ? 'w-4 h-4' : 'w-4 h-4';

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="group"
      aria-label="Share"
    >
      <button
        type="button"
        className={cn(baseBtn, size)}
        aria-label="Share on Twitter"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={icon}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      {isArticle && (
        <button
          type="button"
          className={cn(baseBtn, size)}
          aria-label="Share on LinkedIn"
        >
          <svg
            className={icon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className={cn(baseBtn, size)}
        aria-label="Copy link"
      >
        <LinkIcon className={icon} />
      </button>
    </div>
  );
}
