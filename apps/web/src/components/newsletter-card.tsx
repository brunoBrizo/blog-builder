'use client';

import { Mail } from 'lucide-react';
import { cn } from '@blog-builder/ui';

interface NewsletterCardProps {
  className?: string;
}

export function NewsletterCard({ className }: NewsletterCardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-zinc-900/5 group border border-zinc-800',
        className,
      )}
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 text-indigo-300 flex items-center justify-center border border-white/10 shadow-inner">
            <Mail className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-medium tracking-tight text-white">
            Tutorial Updates
          </h3>
        </div>

        <p className="text-sm font-light text-zinc-400 mb-5 leading-relaxed">
          Get notified when we publish new masterclasses and architectural deep
          dives. No spam.
        </p>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            aria-label="Email address"
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-sm font-light bg-zinc-950/50 border border-zinc-800 rounded-md focus-visible:outline-none focus-visible:border-indigo-500 transition-colors placeholder:text-zinc-600 text-white shadow-inner"
          />
          <button
            type="submit"
            className="w-full bg-white text-zinc-900 text-sm font-medium py-2 rounded-md hover:bg-zinc-100 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Subscribe
          </button>
        </form>

        <p className="text-xs font-light text-zinc-500 mt-3 text-center">
          1-click unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
