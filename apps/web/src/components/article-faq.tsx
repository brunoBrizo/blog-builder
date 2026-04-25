'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@blog-builder/ui';

type FaqItem = {
  question: string;
  answer: string;
};

type ArticleFaqProps = {
  faq: FaqItem[];
  className?: string;
};

function FaqItemRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index + 1}`;

  return (
    <div id={id} className="border-b border-zinc-200/80 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between py-4 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm',
        )}
        aria-expanded={open}
        aria-controls={`${id}-answer`}
      >
        <span className="font-display text-base font-medium text-zinc-900 pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      <div
        id={`${id}-answer`}
        className={cn(
          'overflow-hidden transition-all duration-200',
          open ? 'max-h-96 pb-4' : 'max-h-0',
        )}
      >
        <p className="text-sm font-light text-zinc-600 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function ArticleFaq({ faq, className }: ArticleFaqProps) {
  if (faq.length === 0) return null;

  return (
    <section
      className={cn('mt-12', className)}
      aria-labelledby="article-faq-heading"
    >
      <h2
        id="article-faq-heading"
        className="font-display text-2xl font-medium tracking-tight text-zinc-900 mb-6"
      >
        Frequently Asked Questions
      </h2>
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        {faq.map((item, i) => (
          <FaqItemRow key={`${item.question}-${i}`} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
