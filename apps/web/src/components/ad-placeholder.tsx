import { cn } from '@blog-builder/ui';

interface AdPlaceholderProps {
  type?: 'leaderboard' | 'sidebar' | 'content';
  className?: string;
}

export function AdPlaceholder({
  type = 'leaderboard',
  className,
}: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full bg-white/50 backdrop-blur-sm border border-zinc-200/80 border-dashed flex flex-col items-center justify-center shadow-sm transition-colors hover:bg-white/80',
        type === 'leaderboard' && 'rounded-xl p-2 min-h-[90px]',
        type === 'sidebar' && 'rounded-2xl p-4 aspect-square min-h-[250px]',
        type === 'content' && 'rounded-xl p-4 min-h-[100px] my-10',
        className,
      )}
    >
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Advertisement
      </span>
      <span className="text-xs font-light text-zinc-400 mt-1">
        {type === 'leaderboard'
          ? 'Responsive Banner Placement (728x90)'
          : type === 'sidebar'
            ? 'Sidebar Placement (300x250)'
            : 'Responsive Content Ad'}
      </span>
    </div>
  );
}
