import * as React from 'react';

import { cn } from '../utils/cn';

import { textareaVariants } from './textarea.variants';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(textareaVariants(), className)}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
