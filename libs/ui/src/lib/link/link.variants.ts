import { cva } from 'class-variance-authority';

export const linkVariants = cva(
  'inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        default: '',
        muted: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);
