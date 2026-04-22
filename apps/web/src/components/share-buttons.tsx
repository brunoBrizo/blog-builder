import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@blog-builder/ui';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButtons({ className }: ShareButtonsProps) {
  // In a real app, these props (url, title) would trigger share dialogs
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        aria-label="Copy link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
