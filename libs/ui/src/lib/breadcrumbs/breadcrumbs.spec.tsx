import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs', () => {
  it('marks current page', () => {
    render(
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Here' }]} />,
    );
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Here')).toHaveAttribute('aria-current', 'page');
  });
});
