'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@blog-builder/ui';
import Link from 'next/link';

export type TocItem = {
  id: string;
  title: string;
};

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
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

  return (
    <div
      className={cn(
        'bg-zinc-50/50 rounded-xl p-5 border border-zinc-100 hidden lg:block',
        className,
      )}
    >
      <h3 className="text-sm font-medium text-zinc-900 mb-4 uppercase tracking-wider px-1">
        In this article
      </h3>
      <nav className="flex flex-col gap-2.5 relative">
        {/* Continuous vertical track line */}
        <div className="absolute left-[0.5px] top-1.5 bottom-1.5 w-[1px] bg-zinc-200" />

        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <div key={item.id} className="relative">
              {/* Active indicator blue bar */}
              <div
                className={cn(
                  'absolute -left-[0.5px] top-1.5 h-4 w-[2px] bg-indigo-600 z-20 transition-opacity duration-200',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
              />
              <Link
                href={`#${item.id}`}
                className={cn(
                  'text-sm pl-4 relative z-10 transition-colors block py-0.5',
                  isActive
                    ? 'text-indigo-600 font-medium'
                    : 'text-zinc-500 hover:text-indigo-600',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: 'smooth' });
                  setActiveId(item.id);
                }}
              >
                {index + 1}. {item.title}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
