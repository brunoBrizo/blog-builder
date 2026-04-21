'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@blog-builder/ui';

const COOKIE = 'bb_theme';
const MAX_AGE = 60 * 60 * 24 * 365;

type Scheme = 'light' | 'dark';

function setCookie(value: Scheme) {
  document.cookie = `${COOKIE}=${value};path=/;max-age=${MAX_AGE};samesite=lax`;
}

function applyForcedClass(mode: Scheme) {
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(mode === 'light' ? 'theme-light' : 'theme-dark');
}

export function ThemeToggle({
  initialCookie,
}: {
  initialCookie: Scheme | null;
}) {
  const t = useTranslations('common');
  const [forced, setForced] = useState<Scheme | null>(initialCookie);
  const [system, setSystem] = useState<Scheme>('light');

  useEffect(() => {
    if (forced) {
      applyForcedClass(forced);
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const read = (): Scheme => (mq.matches ? 'dark' : 'light');
    setSystem(read());
    const onChange = () => setSystem(read());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [forced]);

  const effective: Scheme = forced ?? system;
  const isDark = effective === 'dark';

  const toggle = () => {
    const next: Scheme = isDark ? 'light' : 'dark';
    setForced(next);
    applyForcedClass(next);
    setCookie(next);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? t('themeLight') : t('themeDark')}
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
    </Button>
  );
}
