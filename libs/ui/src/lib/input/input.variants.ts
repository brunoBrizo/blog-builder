import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'flex h-10 w-full min-w-0 rounded-md border border-input bg-surface-elevated px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
);
