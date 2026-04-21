import { cva } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative flex size-10 shrink-0 overflow-hidden rounded-full bg-surface',
);

export const avatarFallbackVariants = cva(
  'flex size-full items-center justify-center rounded-full bg-surface text-sm font-medium text-muted-foreground',
);
