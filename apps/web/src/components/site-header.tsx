'use client';

import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link } from '@/i18n/navigation';

import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@blog-builder/ui';

import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

type ThemeCookie = 'light' | 'dark' | null;

export function SiteHeader({ themeCookie }: { themeCookie: ThemeCookie }) {
  const t = useTranslations('common');
  const th = useTranslations('layout.header');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {t('siteName')}
        </Link>

        <nav
          aria-label={th('navAria')}
          className="hidden items-center gap-6 md:flex"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('home')}
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('blog')}
          </Link>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('admin')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle initialCookie={themeCookie} />

          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label={th('openMenu')}
              >
                <Menu className="size-5" aria-hidden />
              </Button>
            </DialogTrigger>
            <DialogContent className="md:hidden">
              <DialogHeader>
                <DialogTitle className="sr-only">{th('openMenu')}</DialogTitle>
              </DialogHeader>
              <nav
                aria-label={th('navAria')}
                className="flex flex-col gap-4 py-4"
              >
                <Link
                  href="/"
                  className="text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link
                  href="/blog"
                  className="text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('blog')}
                </Link>
                <Link
                  href="/admin"
                  className="text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('admin')}
                </Link>
                <LanguageSwitcher />
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}
