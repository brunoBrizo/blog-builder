import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Link } from './link';

describe('Link', () => {
  it('renders internal link', () => {
    render(<Link href="/about">About</Link>);
    const a = screen.getByRole('link', { name: 'About' });
    expect(a).toHaveAttribute('href', '/about');
  });

  it('adds rel for external http href', () => {
    render(<Link href="https://example.com">Ex</Link>);
    const a = screen.getByRole('link', { name: 'Ex' });
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
