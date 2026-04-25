'use client';

import { usePathname } from '@/i18n/navigation';
import { useEffect, useLayoutEffect } from 'react';

let lastPathname: string | undefined;

function forceWindowScrollTop() {
  if (typeof window === 'undefined') {
    return;
  }
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
}

/**
 * App Router can keep document scroll when route segments swap, and the browser
 * may restore a stored offset after React runs (e.g. revisit after back + link).
 * We take scroll ownership with history.scrollRestoration = manual and re-assert
 * the scroll position in useLayoutEffect + a follow-up rAF.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('scrollRestoration' in history)) {
      return;
    }
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (lastPathname === undefined) {
      lastPathname = pathname;
      if (typeof window !== 'undefined' && !window.location.hash) {
        forceWindowScrollTop();
      }
      return;
    }
    if (lastPathname !== pathname) {
      lastPathname = pathname;
      if (typeof window !== 'undefined' && window.location.hash) {
        return;
      }
      forceWindowScrollTop();
    }
  }, [pathname]);

  return null;
}
