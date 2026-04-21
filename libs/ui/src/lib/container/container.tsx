import * as React from 'react';

import { cn } from '../utils/cn';

import { containerVariants } from './container.variants';

import type { VariantProps } from 'class-variance-authority';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants>;

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size, className }))} {...props} />
  );
}
