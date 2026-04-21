'use client';

import { useParams } from 'next/navigation';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { isAppLocale, locales, type AppLocale } from '@/i18n/locales';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@blog-builder/ui';

const labels: Record<AppLocale, string> = {
  en: 'English',
  'pt-br': 'Português',
  es: 'Español',
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const raw = params['locale'];
  const locale = typeof raw === 'string' && isAppLocale(raw) ? raw : 'en';
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      disabled={pending}
    >
      <SelectTrigger aria-label="Language" className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {labels[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
