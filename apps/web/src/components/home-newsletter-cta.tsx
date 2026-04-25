'use client';

import { Mail } from 'lucide-react';
import { FormEvent } from 'react';

import { homeNewsletter } from '@/lib/home-page-content';

export function HomeNewsletterCta() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section
      id="newsletter"
      className="relative scroll-mt-24 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-indigo-900/20"
      aria-labelledby="home-newsletter-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 -right-24 size-96 rounded-full bg-indigo-500 blur-[100px]" />
        <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-violet-600 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center md:px-12 md:py-16">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-inner">
          <Mail
            className="size-6 text-indigo-300"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <h2
          id="home-newsletter-heading"
          className="font-display mb-4 text-2xl font-medium tracking-tight text-white sm:text-3xl"
        >
          {homeNewsletter.title}
        </h2>
        <p className="mb-8 text-base font-light leading-relaxed text-slate-300 sm:text-lg">
          {homeNewsletter.description}
        </p>

        <form
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={onSubmit}
          noValidate
        >
          <label htmlFor="home-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="home-newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
            className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-light text-white shadow-inner transition-all placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-indigo-500 px-6 py-2.5 text-sm font-normal text-white shadow-sm transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-sm font-light text-slate-400">
          {homeNewsletter.disclaimer}
        </p>
      </div>
    </section>
  );
}
