'use client';

import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import * as React from 'react';

export type VisuallyHiddenProps = React.ComponentPropsWithoutRef<
  typeof VisuallyHiddenPrimitive.Root
>;

export const VisuallyHidden = VisuallyHiddenPrimitive.Root;
