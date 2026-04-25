import { ArrowRight, Cpu, FileText, Layers, Megaphone } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

import { routes } from '@/lib/routes';
import { homeLatestArticles } from '@/lib/home-page-content';

function ArticleCard({
  slug,
  imageUrl,
  imageAlt,
  label,
  labelIcon,
  labelTone,
  title,
  excerpt,
  leftMeta,
  rightMeta,
}: (typeof homeLatestArticles)[0]) {
  const toneClass =
    labelTone === 'blue'
      ? 'text-blue-600 group-hover:text-blue-600'
      : 'text-emerald-600 group-hover:text-emerald-600';
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-4 focus-within:ring-offset-[#FAFAFA] hover:-translate-y-1 hover:border-zinc-300/50 hover:shadow-lg">
      <Link
        href={`/articles/${slug}`}
        className="absolute inset-0 z-10 focus:outline-none"
      >
        <span className="sr-only">Read article</span>
      </Link>
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-zinc-100 bg-zinc-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex grow flex-col p-6">
        <span
          className={`mb-3 flex items-center gap-1.5 text-xs font-normal ${toneClass}`}
        >
          {labelIcon === 'layers' ? (
            <Layers className="size-4" strokeWidth={1.5} aria-hidden />
          ) : (
            <Cpu className="size-4" strokeWidth={1.5} aria-hidden />
          )}
          {label}
        </span>
        <h3
          className={`mb-2 font-display text-lg font-normal text-zinc-900 transition-colors ${labelTone === 'blue' ? 'group-hover:text-blue-600' : 'group-hover:text-emerald-600'}`}
        >
          {title}
        </h3>
        <p className="mb-6 line-clamp-2 text-base font-light leading-relaxed text-zinc-500">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-light text-zinc-400">
          <span>{leftMeta}</span>
          <span>{rightMeta}</span>
        </div>
      </div>
    </article>
  );
}

function NativeAdCard() {
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-dashed border-zinc-200/60 bg-zinc-50 p-6 shadow-sm">
      <span className="absolute top-4 right-4 z-20 text-[10px] font-normal tracking-widest text-zinc-400 uppercase">
        Sponsored
      </span>
      <div className="relative mb-6 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-100/50">
        <Megaphone
          className="size-10 text-zinc-300"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <div className="flex grow flex-col justify-center text-center">
        <h3 className="mb-2 font-display text-base font-normal text-zinc-600">
          Native Placement
        </h3>
        <p className="text-sm font-light text-zinc-400">
          Ad content seamlessly integrates here.
        </p>
      </div>
    </div>
  );
}

export function HomeLatestSection() {
  const [first, second] = homeLatestArticles;

  return (
    <section id="latest" className="scroll-mt-24">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-normal tracking-widest text-zinc-400 uppercase">
            <FileText
              className="size-4 text-blue-500"
              strokeWidth={1.5}
              aria-hidden
            />
            <span>Chronological Archive</span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-zinc-900 lg:text-4xl">
            Latest Dispatches
          </h2>
        </div>
        <Link
          href={routes.articles}
          className="group flex items-center gap-1.5 text-sm font-normal text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none"
        >
          Browse all dispatches
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <ArticleCard {...first} />
        <NativeAdCard />
        <ArticleCard {...second} />
      </div>
    </section>
  );
}
