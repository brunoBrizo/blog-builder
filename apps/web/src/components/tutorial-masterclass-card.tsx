import Image from 'next/image';
import {
  ArrowRight,
  Braces,
  Box,
  Clock,
  Cloud,
  Code2,
  Cpu,
  FileCode2,
  Globe,
  Images,
  Monitor,
  PlayCircle,
  Server,
  Sparkles,
} from 'lucide-react';

import { Link } from '@/i18n/navigation';

import type {
  TutorialMasterclassAccent,
  TutorialMasterclassDotColor,
  TutorialMasterclassListItem,
} from '../mocks/tutorials';

import type { ReactNode } from 'react';

const titleHover: Record<TutorialMasterclassAccent, string> = {
  indigo: 'group-hover:text-indigo-600',
  emerald: 'group-hover:text-emerald-600',
  sky: 'group-hover:text-sky-600',
  amber: 'group-hover:text-amber-600',
  violet: 'group-hover:text-violet-600',
  fuchsia: 'group-hover:text-fuchsia-600',
};

const ctaText: Record<TutorialMasterclassAccent, string> = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  sky: 'text-sky-600',
  amber: 'text-amber-600',
  violet: 'text-violet-600',
  fuchsia: 'text-fuchsia-600',
};

const dotActive: Record<TutorialMasterclassDotColor, string> = {
  indigo: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]',
  emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
  sky: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]',
  amber: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
  violet: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]',
  fuchsia: 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]',
};

const difficultyLabel: Record<
  TutorialMasterclassListItem['difficulty'],
  string
> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const dotInactive = 'bg-white/30';

function BadgeIcon({
  name,
}: {
  name: TutorialMasterclassListItem['badgeIcon'];
}) {
  const cls = 'w-4 h-4 shrink-0' as const;
  const map: Record<TutorialMasterclassListItem['badgeIcon'], ReactNode> = {
    play: <PlayCircle className={cls} strokeWidth={1.5} aria-hidden />,
    server: <Server className={cls} strokeWidth={1.5} aria-hidden />,
    fileCode: <FileCode2 className={cls} strokeWidth={1.5} aria-hidden />,
    cloud: <Cloud className={cls} strokeWidth={1.5} aria-hidden />,
    monitor: <Monitor className={cls} strokeWidth={1.5} aria-hidden />,
    sparkles: <Sparkles className={cls} strokeWidth={1.5} aria-hidden />,
  };
  return map[name];
}

function FloatingIcon({
  name,
}: {
  name: TutorialMasterclassListItem['floatingIcon'];
}) {
  const cls = 'w-[18px] h-[18px]' as const;
  const map: Record<TutorialMasterclassListItem['floatingIcon'], ReactNode> = {
    code: <Code2 className={cls} strokeWidth={1.5} aria-hidden />,
    cpu: <Cpu className={cls} strokeWidth={1.5} aria-hidden />,
    braces: <Braces className={cls} strokeWidth={1.5} aria-hidden />,
    box: <Box className={cls} strokeWidth={1.5} aria-hidden />,
    globe: <Globe className={cls} strokeWidth={1.5} aria-hidden />,
    gallery: <Images className={cls} strokeWidth={1.5} aria-hidden />,
  };
  return map[name];
}

type TutorialMasterclassCardProps = {
  item: TutorialMasterclassListItem;
};

export function TutorialMasterclassCard({
  item,
}: TutorialMasterclassCardProps) {
  const diff = difficultyLabel[item.difficulty];
  return (
    <article className="group relative flex flex-col bg-white rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-zinc-300 transition-all duration-500 ease-out overflow-hidden">
      <Link
        href={`/tutorials/${item.slug}`}
        className="absolute inset-0 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-[2rem]"
      >
        <span className="sr-only">Read tutorial: {item.title}</span>
      </Link>

      <div className="relative w-full aspect-[16/10] bg-zinc-900 overflow-hidden border-b border-zinc-100">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />

        <div className="absolute top-5 left-5 z-10">
          <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium shadow-sm flex items-center gap-1.5">
            <BadgeIcon name={item.badgeIcon} />
            {item.badgeLabel}
          </span>
        </div>

        <div className="absolute top-5 right-5 z-10 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm group-hover:bg-white/20 transition-colors">
          <FloatingIcon name={item.floatingIcon} />
        </div>

        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 backdrop-blur-sm border border-white/10 text-white text-xs font-medium shadow-sm">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden />
            {item.durationLabel}
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-zinc-900/60 backdrop-blur-sm border border-white/10 shadow-sm"
            aria-label={`${diff} difficulty`}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={
                  i < item.activeDots
                    ? `w-2 h-2 rounded-full ${dotActive[item.dotColor]}`
                    : `w-2 h-2 rounded-full ${dotInactive}`
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 pt-6 bg-white relative z-20">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {item.topicPills.map((p) => (
            <span
              key={p}
              className="px-2.5 py-1 rounded-md border border-zinc-200/80 bg-zinc-50 text-xs font-medium text-zinc-600"
            >
              {p}
            </span>
          ))}
        </div>

        <h3
          className={`font-display text-xl font-medium tracking-tight text-zinc-900 mb-2 ${titleHover[item.accent]} transition-colors leading-snug`}
        >
          {item.title}
        </h3>
        <p className="text-sm font-light text-zinc-500 mb-6 line-clamp-2 leading-relaxed">
          {item.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-100">
          <div className="flex items-center gap-2.5 relative z-30">
            <Image
              src={item.authorAvatarUrl}
              alt={item.authorName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200"
            />
            <span className="text-xs font-medium text-zinc-700">
              {item.authorName}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${ctaText[item.accent]} group-hover:gap-2.5 transition-all duration-300 pointer-events-none`}
          >
            <span>Start Module</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden />
          </div>
        </div>
      </div>
    </article>
  );
}
