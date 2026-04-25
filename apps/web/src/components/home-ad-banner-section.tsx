import { Megaphone } from 'lucide-react';

export function HomeAdBannerSection() {
  return (
    <section
      className="relative mx-auto hidden w-full max-w-4xl items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50/50 py-6 shadow-sm sm:flex"
      aria-label="Sponsored placement"
    >
      <span className="absolute top-2 right-3 text-[10px] font-normal tracking-widest text-zinc-400 uppercase">
        Sponsored
      </span>
      <div className="relative flex flex-col items-center justify-center gap-2">
        <Megaphone
          className="size-6 text-zinc-400"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="text-sm font-light text-zinc-400">
          Responsive Banner Placement (728x90)
        </span>
      </div>
    </section>
  );
}
