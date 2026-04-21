import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('has checkbox role', () => {
    render(<Checkbox aria-label="Accept" />);
    expect(
      screen.getByRole('checkbox', { name: 'Accept' }),
    ).toBeInTheDocument();
  });
});
