import * as React from 'react';

import { cn } from '../utils/cn';

import { skeletonVariants } from './skeleton.variants';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants(), className)} {...props} />;
}
