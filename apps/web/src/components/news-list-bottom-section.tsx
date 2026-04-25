'use client';

import { ArrowRight, Mailbox, Newspaper } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import { authors } from '../mocks/authors';
import { newsListBottomCopy } from '../mocks/news';

const lead = authors[0];

export function NewsListBottomSection() {
  const c = newsListBottomCopy;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-500 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700" />

        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner mb-4 md:mx-0 mx-auto">
            <Newspaper className="w-5 h-5" strokeWidth={1.5} aria-hidden />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white mb-2">
            {c.newsletterTitle}
          </h2>
          <p className="text-sm font-light text-zinc-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
            {c.newsletterBody}
          </p>
        </div>

        <div className="relative z-10 w-full md:w-[320px] shrink-0">
          <form
            className="flex flex-col gap-2.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex items-center bg-zinc-950/50 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
              <div className="pl-3.5 text-zinc-500 flex items-center pointer-events-none">
                <Mailbox className="w-4 h-4" strokeWidth={1.5} aria-hidden />
              </div>
              <input
                type="email"
                name="news-list-email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                aria-label="Email address for AI Daily Brief"
                className="w-full px-3 py-3 text-sm font-light bg-transparent focus-visible:outline-none placeholder:text-zinc-600 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-zinc-900 text-sm font-medium py-3 rounded-xl hover:bg-zinc-100 hover:scale-[0.98] active:scale-[0.96] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 flex items-center justify-center gap-2"
            >
              Subscribe Now
              <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>
          </form>
          <p className="text-[11px] font-light text-zinc-500 mt-3 text-center md:text-left">
            Zero spam. 1-click unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="lg:col-span-4 bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700" />
        <div className="relative z-10 mb-8">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-6">
            {c.editorEyebrow}
          </p>
          {lead ? (
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Image
                  src={lead.avatarUrl}
                  alt={lead.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800 bg-zinc-950"
                />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium tracking-tight text-white">
                  {lead.name}
                </h3>
                <p className="text-xs font-medium text-orange-400">
                  Editor-in-Chief
                </p>
              </div>
            </div>
          ) : null}
          <p className="text-sm font-light text-zinc-400 leading-relaxed">
            {c.editorBio}
          </p>
        </div>
        <Link
          href="/about"
          className="relative z-10 inline-flex items-center justify-center w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors border border-white/5 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Read Editorial Guidelines
        </Link>
      </div>
    </div>
  );
}
