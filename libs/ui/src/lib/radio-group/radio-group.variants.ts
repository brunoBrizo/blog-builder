import { cva } from 'class-variance-authority';

export const radioItemVariants = cva(
  'aspect-square size-4 rounded-full border border-input text-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
);
