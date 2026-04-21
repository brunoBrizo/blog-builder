import '@testing-library/jest-dom/vitest';

import * as React from 'react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.ComponentProps<'a'> & { href: string | object }) =>
    React.createElement(
      'a',
      {
        href: typeof href === 'string' ? href : '#',
        ...props,
      },
      children,
    ),
}));
