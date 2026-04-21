import NextLink from 'next/link';
import * as React from 'react';

import { cn } from '../utils/cn';

import { linkVariants } from './link.variants';

import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export type LinkProps = ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants>;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, href, rel, target, ...props }, ref) => {
    const hrefString = typeof href === 'string' ? href : '';
    const isExternal =
      hrefString.startsWith('http://') || hrefString.startsWith('https://');
    const resolvedRel =
      rel ??
      (target === '_blank' || isExternal ? 'noopener noreferrer' : undefined);

    return (
      <NextLink
        ref={ref}
        href={href}
        target={target}
        rel={resolvedRel}
        className={cn(linkVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
Link.displayName = 'Link';
