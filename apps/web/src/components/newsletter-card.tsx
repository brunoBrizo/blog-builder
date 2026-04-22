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
        'bg-white rounded-2xl p-7 border border-zinc-100 shadow-sm shadow-zinc-100/30',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <Mail className="w-5 h-5 text-zinc-900" strokeWidth={1.5} />
        <h3 className="text-[15px] font-medium tracking-tight text-zinc-900">
          Weekly Tech Digest
        </h3>
      </div>

      <p className="text-[14px] text-zinc-500 mb-6 leading-[1.6]">
        Get the latest AI tutorials, tool reviews, and tech news straight to
        your inbox.
      </p>

      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          required
          placeholder="name@example.com"
          className="w-full px-4 py-2.5 text-[14px] border border-zinc-100 rounded-xl focus:outline-none focus:border-zinc-300 transition-all placeholder:text-zinc-300 bg-zinc-50/30"
        />
        <button
          type="submit"
          className="w-full bg-zinc-900 text-white text-[14px] font-medium py-3 rounded-xl hover:bg-black transition-colors"
        >
          Subscribe
        </button>
      </form>

      <p className="text-[11px] text-zinc-400 mt-5 text-center leading-relaxed px-2">
        1-click unsubscribe anytime. By subscribing, you agree to our Privacy
        Policy.
      </p>
    </div>
  );
}
