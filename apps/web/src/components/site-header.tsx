'use client';

import { Menu, Search, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@blog-builder/ui';

import { ThemeToggle } from './theme-toggle';

type ThemeCookie = 'light' | 'dark' | null;

export function SiteHeader({ themeCookie }: { themeCookie: ThemeCookie }) {
  const t = useTranslations('common');
  const th = useTranslations('layout.header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: t('aiTools'), href: '#' },
    { label: t('development'), href: '#' },
    { label: t('guides'), href: '/blog' },
    { label: t('articles'), href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-medium tracking-tighter uppercase text-zinc-900 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              {t('siteName')}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) && item.href !== '#';
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm transition-colors relative ${
                      isActive
                        ? 'text-indigo-600 after:absolute after:-bottom-[21px] after:left-0 after:w-full after:h-[1px] after:bg-indigo-600'
                        : 'text-zinc-500 hover:text-indigo-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block w-48">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="size-4 text-zinc-400" strokeWidth={1.5} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400/20 transition-all"
              />
            </div>

            {/* Language Switcher */}
            <button className="flex items-center gap-1.5 text-zinc-500 hover:text-indigo-600 transition-colors text-sm px-2 py-1 rounded-md hover:bg-indigo-50/50">
              <Globe className="size-4" strokeWidth={1.5} />
              <span>EN</span>
            </button>

            <ThemeToggle initialCookie={themeCookie} />

            {/* Mobile Menu Button */}
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <button className="md:hidden text-zinc-500 hover:text-indigo-600 p-1 transition-colors">
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
                      key={item.label}
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
