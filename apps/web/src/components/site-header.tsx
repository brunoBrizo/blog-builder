'use client';

import { Menu, Search, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@blog-builder/ui';

import { routes } from '@/lib/routes';

import { ThemeToggle } from './theme-toggle';

type ThemeCookie = 'light' | 'dark' | null;

function navItemActive(pathname: string, href: string) {
  if (href === routes.home) {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ themeCookie }: { themeCookie: ThemeCookie }) {
  const t = useTranslations('common');
  const th = useTranslations('layout.header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: t('home'), href: routes.home },
    { label: t('tutorials'), href: routes.tutorials },
    { label: t('articles'), href: routes.articles },
    { label: t('news'), href: routes.news },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-display text-sm sm:text-base font-medium tracking-tighter uppercase text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm relative z-10 flex items-center gap-1.5"
            >
              <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"></span>
              SYNTHETIX
            </Link>

            <nav
              aria-label={th('navAria')}
              className="hidden md:flex items-center gap-6"
            >
              {navItems.map((item) => {
                const isActive = navItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm ${
                      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-56 group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none transition-colors group-focus-within:text-white text-zinc-500">
                <Search className="size-4" strokeWidth={1.5} />
              </div>
              <input
                type="text"
                aria-label="Search articles"
                placeholder="Search articles..."
                className="w-full rounded-md border border-zinc-700/80 bg-zinc-800/50 py-1.5 pl-8 pr-3 text-sm font-light text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition-all shadow-sm"
              />
            </div>

            <div className="relative group hidden sm:block">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
              >
                EN
                <ChevronDown className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            <ThemeToggle initialCookie={themeCookie} />

            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="md:hidden text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                >
                  <Menu className="size-6" strokeWidth={1.5} />
                </button>
              </DialogTrigger>
              <DialogContent className="md:hidden">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    {th('openMenu')}
                  </DialogTitle>
                </DialogHeader>
                <nav className="flex flex-col gap-4 py-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-base text-zinc-500 hover:text-indigo-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
