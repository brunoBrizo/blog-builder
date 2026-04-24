import { Link } from '@/i18n/navigation';
import { cn } from '@blog-builder/ui';
import type { Category } from '../mocks/categories';

interface SidebarCategoriesProps {
  categories: Category[];
  className?: string;
}

export function SidebarCategories({
  categories,
  className,
}: SidebarCategoriesProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/80 shadow-sm',
        className,
      )}
    >
      <h3 className="text-xs font-medium text-zinc-400 mb-4 uppercase tracking-widest">
        Filter by Topic
      </h3>
      <ul className="flex flex-col gap-1">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/articles?category=${encodeURIComponent(category.slug)}`}
              className="group flex items-center justify-between text-sm font-light text-zinc-500 hover:text-zinc-900 px-2 py-2 rounded-md hover:bg-zinc-50 transition-colors"
            >
              <span>{category.name}</span>
              <span className="text-xs font-medium bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
