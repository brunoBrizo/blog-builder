import { BookMarked } from 'lucide-react';

type TutorialsListHeroProps = {
  badge: string;
  title: string;
  description: string;
};

export function TutorialsListHero({
  badge,
  title,
  description,
}: TutorialsListHeroProps) {
  return (
    <div className="flex flex-col items-center text-center mb-16 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-xs font-medium mb-6 shadow-sm">
        <BookMarked className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
        {badge}
      </div>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 mb-6">
        {title}
      </h1>
      <p className="text-base sm:text-lg font-light text-zinc-500 max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}
