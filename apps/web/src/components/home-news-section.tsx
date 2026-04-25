import { ArrowRight, Clock, Rss } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

import { routes } from '@/lib/routes';
import { homeNewsCards, type HomeNewsCard } from '@/lib/home-page-content';

const toneMap: Record<
  HomeNewsCard['categoryTone'],
  { ping: string; dot: string }
> = {
  indigo: { ping: 'bg-indigo-400', dot: 'bg-indigo-500' },
  emerald: { ping: 'bg-emerald-400', dot: 'bg-emerald-500' },
  violet: { ping: 'bg-violet-400', dot: 'bg-violet-500' },
  amber: { ping: 'bg-amber-400', dot: 'bg-amber-500' },
};

export function HomeNewsSection() {
  return (
    <section id="news" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-normal tracking-widest text-zinc-400 uppercase">
            <Rss
              className="size-4 text-emerald-500"
              strokeWidth={1.5}
              aria-hidden
            />
            <span>Breaking Updates</span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 lg:text-4xl">
            AI News
          </h2>
        </div>
        <Link
          href={routes.news}
          className="group flex items-center gap-1.5 text-sm font-normal text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none"
        >
          View all updates
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {homeNewsCards.map((card) => (
          <NewsCard key={card.slug} card={card} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ card }: { card: HomeNewsCard }) {
  const t = toneMap[card.categoryTone];
  return (
    <article className="group relative flex flex-col items-start rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-4 focus-within:ring-offset-[#FAFAFA] hover:-translate-y-1 hover:border-zinc-300/80 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.06)]">
      <Link
        href={`/news/${card.slug}`}
        className="absolute inset-0 z-10 focus:outline-none"
      >
        <span className="sr-only">Read news</span>
      </Link>

      <div className="relative mb-5 aspect-[2/1] w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={card.imageUrl}
          alt={card.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5 ring-inset" />

        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-md border border-zinc-200/50 bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
          <span className="relative flex size-1.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${t.ping}`}
            />
            <span
              className={`relative inline-flex size-1.5 rounded-full ${t.dot}`}
            />
          </span>
          <span className="text-[10px] font-medium tracking-widest text-zinc-900 uppercase">
            {card.category}
          </span>
        </div>
      </div>

      <div className="flex w-full grow flex-col px-3 pb-3">
        <div className="mb-3 flex w-full items-center justify-between">
          <time className="flex items-center gap-1.5 text-xs font-normal text-zinc-500">
            <Clock className="size-4" strokeWidth={1.5} aria-hidden />
            {card.timeLabel}
          </time>
          <div className="flex translate-x-[-0.5rem] items-center gap-1 text-xs font-normal text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Read
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </div>
        </div>

        <h3 className="mb-2.5 font-display text-lg font-medium leading-[1.3] tracking-tight text-zinc-900 transition-colors group-hover:text-indigo-600">
          {card.title}
        </h3>

        <p className="line-clamp-2 text-base font-light leading-relaxed text-zinc-500">
          {card.excerpt}
        </p>
      </div>
    </article>
  );
}
