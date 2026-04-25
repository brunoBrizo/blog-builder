import { ArrowRight, BookOpen, Code, Play, Server } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

import { routes } from '@/lib/routes';
import { homeTutorials, type HomeTutorialCard } from '@/lib/home-page-content';

function LabelIcon({ card }: { card: HomeTutorialCard }) {
  const cls = 'size-4';
  switch (card.labelIcon) {
    case 'play':
      return <Play className={cls} strokeWidth={1.5} aria-hidden />;
    case 'server':
      return <Server className={cls} strokeWidth={1.5} aria-hidden />;
    case 'code':
      return <Code className={cls} strokeWidth={1.5} aria-hidden />;
    default:
      return null;
  }
}

export function HomeTutorialsSection() {
  return (
    <section id="tutorials" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-normal tracking-widest text-zinc-400 uppercase">
            <BookOpen
              className="size-4 text-violet-500"
              strokeWidth={1.5}
              aria-hidden
            />
            <span>Step-by-Step Masterclasses</span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 lg:text-4xl">
            Best Tutorials
          </h2>
        </div>
        <Link
          href={routes.tutorials}
          className="group flex items-center gap-1.5 text-sm font-normal text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none"
        >
          Browse all tutorials
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {homeTutorials.map((card) => (
          <article
            key={card.slug}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-4 focus-within:ring-offset-[#FAFAFA] hover:-translate-y-1 hover:border-zinc-300/50 hover:shadow-lg"
          >
            <Link
              href={`/tutorials/${card.slug}`}
              className="absolute inset-0 z-10 focus:outline-none"
            >
              <span className="sr-only">Read tutorial</span>
            </Link>
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-zinc-100 bg-zinc-100">
              <Image
                src={card.imageUrl}
                alt={card.imageAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex grow flex-col p-6">
              <span className="mb-3 flex items-center gap-1.5 text-xs font-normal text-violet-600">
                <LabelIcon card={card} />
                {card.label}
              </span>
              <h3 className="mb-2 font-display text-lg font-normal text-zinc-900 transition-colors group-hover:text-violet-600">
                {card.title}
              </h3>
              <p className="mb-6 line-clamp-2 text-base font-light leading-relaxed text-zinc-500">
                {card.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-light text-zinc-400">
                <span>{card.author}</span>
                <span>{card.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
