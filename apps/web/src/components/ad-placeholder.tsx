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
        'w-full bg-zinc-50/50 border border-zinc-200 border-dashed rounded-lg p-4 flex flex-col items-center justify-center',
        type === 'leaderboard' && 'min-h-[90px] p-2',
        type === 'sidebar' && 'aspect-square min-h-[250px]',
        type === 'content' && 'min-h-[100px] my-10',
        className,
      )}
    >
      <span className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
        Advertisement
      </span>
      <span className="text-xs text-zinc-300 mt-1">
        Google AdSense -{' '}
        {type === 'leaderboard'
          ? '728x90'
          : type === 'sidebar'
            ? '300x250'
            : 'Responsive Content Ad'}
      </span>
    </div>
  );
}
