import { cva } from 'class-variance-authority';

export const checkboxIndicatorVariants = cva(
  'flex size-4 items-center justify-center rounded-sm border border-input bg-surface-elevated text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
);
