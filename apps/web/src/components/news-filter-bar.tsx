import { ArrowDownUp, ChevronDown } from 'lucide-react';

import {
  newsFilterCategories,
  newsFilterSort,
  newsFilterTypes,
} from '../mocks/news';

const selectClass =
  'appearance-none w-full bg-white border border-zinc-200/80 text-zinc-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors';

export function NewsFilterBar() {
  const catId = 'news-filter-category';
  const typeId = 'news-filter-type';
  const sortId = 'news-filter-sort';
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h2 className="font-display text-2xl font-medium tracking-tight text-zinc-900">
        Latest Stories
      </h2>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto relative z-20">
        <div className="relative group min-w-[160px]">
          <label htmlFor={catId} className="sr-only">
            Category
          </label>
          <select
            id={catId}
            className={selectClass}
            defaultValue={newsFilterCategories[0]}
          >
            {newsFilterCategories.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none w-4 h-4"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <div className="relative group min-w-[140px]">
          <label htmlFor={typeId} className="sr-only">
            Content type
          </label>
          <select
            id={typeId}
            className={selectClass}
            defaultValue={newsFilterTypes[0]}
          >
            {newsFilterTypes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none w-4 h-4"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <div className="relative group min-w-[150px]">
          <label htmlFor={sortId} className="sr-only">
            Sort order
          </label>
          <select
            id={sortId}
            className={`${selectClass} pl-9`}
            defaultValue={newsFilterSort[0]}
          >
            {newsFilterSort.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ArrowDownUp
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none w-4 h-4"
            strokeWidth={1.5}
            aria-hidden
          />
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none w-4 h-4"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
