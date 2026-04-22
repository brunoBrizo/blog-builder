import Link from 'next/link';
import { cn } from '@blog-builder/ui';
import type { Category } from '../mocks/categories';

interface SidebarCategoriesProps {
  categories: Category[];
  className?: string;
}

const colorMap = {
  violet: 'bg-violet-400',
  emerald: 'bg-emerald-400',
  blue: 'bg-blue-400',
  rose: 'bg-rose-400',
  amber: 'bg-amber-400',
  zinc: 'bg-zinc-400',
};

export function SidebarCategories({
  categories,
  className,
}: SidebarCategoriesProps) {
  return (
    <div
      className={cn(
        'bg-white border border-zinc-100 rounded-2xl p-6',
        className,
      )}
    >
      <h3 className="text-[11px] font-bold text-zinc-900 mb-6 uppercase tracking-[0.1em]">
        Topics
      </h3>
      <ul className="flex flex-col gap-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog/category/${category.slug}`}
              className="group flex items-center justify-between text-[14px] text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    colorMap[category.color] || colorMap.zinc,
                  )}
                />
                <span>{category.name}</span>
              </div>
              <span className="text-[13px] text-zinc-300 font-normal">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
