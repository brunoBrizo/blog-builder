'use client';

import { useEffect, useState, useRef } from 'react';
import { List } from 'lucide-react';
import { cn } from '@blog-builder/ui';
import Link from 'next/link';

export type TocItem = {
  id: string;
  title: string;
};

interface TableOfContentsProps {
  items: TocItem[];
  variant?: 'default' | 'article';
  className?: string;
}

export function TableOfContents({
  items,
  variant = 'default',
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the first heading that is in the top portion of the viewport
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-10% 0% -80% 0%',
      threshold: 0,
    });

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const isArticle = variant === 'article';

  return (
    <div
      className={cn(
        'hidden lg:block',
        isArticle
          ? 'bg-white rounded-[2rem] p-6 border border-zinc-200/80 shadow-sm'
          : 'bg-zinc-50/50 rounded-xl p-5 border border-zinc-100',
        className,
      )}
    >
      <h3
        className={cn(
          isArticle
            ? 'text-xs font-medium text-zinc-400 mb-5 uppercase tracking-widest flex items-center gap-2'
            : 'text-sm font-medium text-zinc-900 mb-4 uppercase tracking-wider px-1',
        )}
      >
        {isArticle && (
          <List className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
        )}
        In this article
      </h3>
      <nav
        className={cn(
          'flex flex-col relative',
          isArticle ? 'gap-3' : 'gap-2.5',
        )}
      >
        {isArticle ? (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-100" />
        ) : (
          <div className="absolute left-[0.5px] top-1.5 bottom-1.5 w-px bg-zinc-200" />
        )}

        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <div key={item.id} className="relative">
              <div
                className={cn(
                  'absolute z-20 transition-opacity duration-200 bg-indigo-600',
                  isArticle
                    ? '-left-[0.5px] top-1.5 h-5 w-[2px] bg-indigo-500'
                    : '-left-[0.5px] top-1.5 h-4 w-[2px]',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
              />
              <Link
                href={`#${item.id}`}
                className={cn(
                  isArticle
                    ? 'text-sm pl-4 relative z-10 transition-colors block'
                    : 'text-sm pl-4 relative z-10 transition-colors block py-0.5',
                  isActive
                    ? 'text-indigo-600 font-medium'
                    : 'text-zinc-500 hover:text-indigo-600',
                  isArticle && !isActive && 'font-light',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: 'smooth' });
                  setActiveId(item.id);
                }}
              >
                {isArticle ? (
                  item.title
                ) : (
                  <>
                    {index + 1}. {item.title}
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
