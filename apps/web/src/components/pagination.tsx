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
    <div className={cn('flex items-center justify-between pt-4', className)}>
      <button
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm text-zinc-400 border border-zinc-100 rounded-md disabled:cursor-not-allowed disabled:opacity-50 hover:bg-zinc-50 hover:text-indigo-600 transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center gap-1 text-sm text-zinc-500">
        {[...Array(Math.min(3, totalPages))].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <span
              key={page}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-md transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'hover:bg-zinc-50 hover:text-indigo-600 cursor-pointer',
              )}
            >
              {page}
            </span>
          );
        })}
        {totalPages > 3 && <span className="px-1">...</span>}
      </div>

      <button
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm text-zinc-700 border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
