import { cn } from '@blog-builder/ui';

interface AdPlaceholderProps {
  type?: 'leaderboard' | 'sidebar' | 'content';
  /** Matches static article page design: rounded-2xxl, copy text */
  articleStyle?: boolean;
  className?: string;
}

export function AdPlaceholder({
  type = 'leaderboard',
  articleStyle = false,
  className,
}: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full border border-zinc-200/80 border-dashed flex flex-col items-center justify-center shadow-sm transition-colors',
        articleStyle
          ? 'bg-zinc-100/50 backdrop-blur-sm'
          : 'bg-white/50 backdrop-blur-sm hover:bg-white/80',
        type === 'leaderboard' &&
          (articleStyle
            ? 'rounded-2xl p-2 min-h-[90px]'
            : 'rounded-xl p-2 min-h-[90px]'),
        type === 'sidebar' &&
          (articleStyle
            ? 'rounded-[2rem] p-4 aspect-square min-h-[250px] hover:bg-zinc-100'
            : 'rounded-2xl p-4 aspect-square min-h-[250px]'),
        type === 'content' &&
          'rounded-2xl p-4 my-10 min-h-[120px] hover:bg-zinc-100',
        className,
      )}
    >
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Advertisement
      </span>
      <span className="text-xs font-light text-zinc-400 mt-1 text-center">
        {type === 'leaderboard'
          ? articleStyle
            ? 'Responsive Placement (728x90)'
            : 'Responsive Banner Placement (728x90)'
          : type === 'sidebar'
            ? 'Sidebar (300x250)'
            : articleStyle
              ? 'Responsive Content Ad'
              : 'Responsive Content Ad'}
      </span>
    </div>
  );
}
