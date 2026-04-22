import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-surface text-foreground',
        outline: 'text-foreground border-border',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        violet: 'text-violet-600 bg-violet-50 border-violet-100/50',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
        blue: 'text-blue-600 bg-blue-50 border-blue-100/50',
        amber: 'text-amber-600 bg-amber-50 border-amber-100/50',
        rose: 'text-rose-600 bg-rose-50 border-rose-100/50',
        zinc: 'text-zinc-600 bg-zinc-50 border-zinc-100/50',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);
