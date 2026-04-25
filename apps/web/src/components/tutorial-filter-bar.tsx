import { ArrowDown, SortAsc } from 'lucide-react';

const topicId = 'tutorial-filter-topic';
const levelId = 'tutorial-filter-level';
const sortId = 'tutorial-filter-sort';

export function TutorialFilterBar() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h2 className="font-display text-2xl font-medium tracking-tight text-zinc-900">
        All Masterclasses
      </h2>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto relative z-20">
        <div className="relative min-w-[140px] w-full sm:w-auto">
          <label htmlFor={topicId} className="sr-only">
            Filter by topic
          </label>
          <select
            id={topicId}
            defaultValue="all"
            className="appearance-none w-full bg-white border border-zinc-200/80 text-zinc-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors"
          >
            <option value="all">All Topics</option>
            <option>React &amp; Next.js</option>
            <option>AI Integration</option>
            <option>Architecture</option>
            <option>DevOps</option>
          </select>
          <ArrowDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <div className="relative min-w-[140px] w-full sm:w-auto">
          <label htmlFor={levelId} className="sr-only">
            Filter by difficulty
          </label>
          <select
            id={levelId}
            defaultValue="all"
            className="appearance-none w-full bg-white border border-zinc-200/80 text-zinc-700 text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors"
          >
            <option value="all">All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <ArrowDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <div className="relative min-w-[150px] w-full sm:w-auto">
          <label htmlFor={sortId} className="sr-only">
            Sort masterclasses
          </label>
          <div className="relative">
            <SortAsc
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
              strokeWidth={1.5}
              aria-hidden
            />
            <select
              id={sortId}
              defaultValue="newest"
              className="appearance-none w-full bg-white border border-zinc-200/80 text-zinc-700 text-sm font-medium py-2 pl-9 pr-8 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option>Most Popular</option>
              <option>Duration</option>
            </select>
            <ArrowDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
