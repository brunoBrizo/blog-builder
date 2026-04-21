'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, Input } from '@blog-builder/ui';

export function NewsletterSticky() {
  const t = useTranslations('layout.newsletter');
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <aside
      aria-label={t('stickyTitle')}
      className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-lg rounded-lg border border-border bg-surface-elevated p-4 shadow-lg sm:left-auto"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {t('stickyTitle')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('stickyDescription')}
          </p>
          <Input
            type="email"
            className="mt-3"
            placeholder={t('emailPlaceholder')}
            disabled
            aria-disabled="true"
          />
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col">
          <Button type="button" disabled className="w-full sm:w-auto">
            {t('cta')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label={t('dismiss')}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </aside>
  );
}
