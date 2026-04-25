import { ArrowRight, Crown, Star } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

import { homeEditorPick } from '@/lib/home-page-content';

export function HomeEditorPickSection() {
  return (
    <section id="editor-pick" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-normal tracking-widest text-zinc-400 uppercase">
            <Star
              className="size-4 text-indigo-500"
              strokeWidth={1.5}
              aria-hidden
            />
            <span>Curated Selection</span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 lg:text-4xl">
            {homeEditorPick.title}
          </h2>
        </div>
        <Link
          href={homeEditorPick.articleHref}
          className="group flex items-center gap-1.5 text-sm font-normal text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none"
        >
          {homeEditorPick.cta}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      </div>

      <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-4 focus-within:ring-offset-[#FAFAFA] hover:border-zinc-300/50 hover:shadow-lg lg:flex-row">
        <Link
          href={homeEditorPick.articleHref}
          className="absolute inset-0 z-10 focus:outline-none"
        >
          <span className="sr-only">Read article</span>
        </Link>

        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-zinc-100 bg-zinc-100 lg:aspect-auto lg:w-3/5 lg:border-r lg:border-b-0">
          <Image
            src={homeEditorPick.imageUrl}
            alt={homeEditorPick.imageAlt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        <div className="flex w-full flex-col justify-center p-6 lg:p-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-normal text-indigo-600">
              <Crown className="size-4" strokeWidth={1.5} aria-hidden />
              {homeEditorPick.tag}
            </span>
          </div>
          <h3 className="mb-4 font-display text-2xl font-normal leading-[1.2] tracking-tight text-zinc-900 transition-colors group-hover:text-indigo-600 sm:text-3xl">
            {homeEditorPick.headline}
          </h3>
          <p className="mb-8 text-lg font-light leading-relaxed text-zinc-500">
            {homeEditorPick.excerpt}
          </p>

          <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-6">
            <Image
              src={homeEditorPick.authorAvatarUrl}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full bg-zinc-100 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-normal text-zinc-900">
                {homeEditorPick.authorName}
              </span>
              <span className="text-xs font-light text-zinc-400">
                {homeEditorPick.meta}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
