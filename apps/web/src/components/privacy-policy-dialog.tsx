'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@blog-builder/ui';

import { routes } from '@/lib/routes';

export function PrivacyPolicyDialog() {
  const t = useTranslations('placeholders');
  const tf = useTranslations('layout.footer');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-xs font-normal text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
        >
          {tf('privacy')}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('privacyDialogTitle')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm font-light text-zinc-600 leading-relaxed">
          {t('privacyDialogBody')}
        </p>
        <p className="text-sm">
          <Link
            href={routes.privacy}
            className="text-indigo-600 hover:underline font-medium"
          >
            {t('privacyViewFullPage')}
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
