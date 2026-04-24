import { cn } from '@blog-builder/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  className,
}: PaginationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-8 mt-4 border-t border-zinc-200/60',
        className,
      )}
    >
      <button
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-200/80 rounded-md disabled:cursor-not-allowed disabled:bg-zinc-50 hover:bg-zinc-50 shadow-sm transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center gap-1 text-sm font-medium text-zinc-500">
        {[...Array(Math.min(3, totalPages))].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <span
              key={page}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'hover:bg-zinc-200 hover:text-zinc-900 cursor-pointer',
              )}
            >
              {page}
            </span>
          );
        })}
        {totalPages > 3 && <span className="px-1 text-zinc-400">...</span>}
      </div>

      <button
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-zinc-700 border border-zinc-200/80 rounded-md hover:bg-white hover:text-zinc-900 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
