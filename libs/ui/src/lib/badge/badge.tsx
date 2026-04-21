import * as React from 'react';

import { cn } from '../utils/cn';

import { badgeVariants } from './badge.variants';

import type { VariantProps } from 'class-variance-authority';

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
