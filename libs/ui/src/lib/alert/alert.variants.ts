import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  'relative w-full rounded-lg border border-border bg-surface p-4 text-foreground [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'border-destructive/50 text-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);
