import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('renders', () => {
    render(<Label htmlFor="x">Name</Label>);
    expect(screen.getByText('Name')).toHaveAttribute('for', 'x');
  });
});
