import { ChevronLeft, ChevronRight } from 'lucide-react';

import { tutorialsListPagination } from '../mocks/tutorials';

export function TutorialsListPagination() {
  const p = tutorialsListPagination;
  return (
    <div className="flex items-center justify-between py-4 mb-20 border-t border-zinc-200/80">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-sm font-light text-zinc-500">
            Showing{' '}
            <span className="font-medium text-zinc-900">{p.showingFrom}</span>{' '}
            to <span className="font-medium text-zinc-900">{p.showingTo}</span>{' '}
            of <span className="font-medium text-zinc-900">{p.total}</span>{' '}
            masterclasses
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-xl shadow-sm border border-zinc-200/80 bg-white"
            aria-label="Pagination"
          >
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 transition-colors border-r border-zinc-200/80"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            <span
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-zinc-900 px-4 py-2 text-sm font-medium text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              1
            </span>
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 transition-colors border-l border-zinc-200/80"
            >
              2
            </button>
            <button
              type="button"
              className="relative hidden items-center px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:z-20 md:inline-flex border-l border-zinc-200/80 transition-colors"
            >
              3
            </button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-400 border-l border-zinc-200/80">
              …
            </span>
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:z-20 border-l border-zinc-200/80 transition-colors"
            >
              {p.lastPage}
            </button>
            <button
              type="button"
              className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 transition-colors border-l border-zinc-200/80"
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </nav>
        </div>
      </div>
      <div className="flex flex-1 justify-between sm:hidden w-full">
        <button
          type="button"
          className="relative inline-flex items-center rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm"
        >
          Previous
        </button>
        <button
          type="button"
          className="relative inline-flex items-center rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
