import { HomeHeroCanvas } from '@/components/home-hero-canvas';
import { homeHero } from '@/lib/home-page-content';
import { Link } from '@/i18n/navigation';

export function HomeHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-zinc-200/60 pb-16 pt-8 md:pt-20 lg:pb-32 lg:pt-32 bg-gradient-to-b from-indigo-50/30 to-transparent"
      aria-labelledby="home-hero-heading"
    >
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute -top-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] aspect-square rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <HomeHeroCanvas />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col items-start">
          <span className="home-animate-fade-in mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-normal text-indigo-700 shadow-sm ring-1 ring-indigo-500/20 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-indigo-500" />
            </span>
            <Link
              href="/tutorials/complete-guide-to-rag"
              className="text-left transition-opacity hover:opacity-90"
            >
              {homeHero.badge}
            </Link>
          </span>

          <h1
            id="home-hero-heading"
            className="font-display home-animate-fade-in home-delay-100 mb-6 text-5xl font-medium leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl"
          >
            {homeHero.titleLine1}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {homeHero.titleGradient}
            </span>
            {homeHero.titleLine2}
          </h1>

          <p className="home-animate-fade-in home-delay-200 mb-10 max-w-xl text-lg font-light leading-relaxed text-zinc-500 sm:text-xl">
            {homeHero.description}
          </p>

          <div className="home-animate-fade-in home-delay-300 flex flex-wrap items-center gap-4">
            <a
              href="#latest"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-normal text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
            >
              {homeHero.primaryCta}
            </a>
            <a
              href="#newsletter"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200/80 bg-white px-5 py-2.5 text-sm font-normal text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
            >
              {homeHero.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
