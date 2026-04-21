import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex min-h-24 w-full rounded-md border border-input bg-surface-elevated px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
);
