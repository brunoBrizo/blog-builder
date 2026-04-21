import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardTitle } from './card';

describe('Card', () => {
  it('renders heading', () => {
    render(
      <Card>
        <CardTitle>T</CardTitle>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'T' })).toBeInTheDocument();
  });
});
