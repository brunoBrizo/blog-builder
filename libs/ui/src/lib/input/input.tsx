import * as React from 'react';

import { cn } from '../utils/cn';

import { inputVariants } from './input.variants';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants(), className)}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
