import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('exposes radiogroup', () => {
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroupItem value="a" aria-label="A" />
      </RadioGroup>,
    );
    expect(
      screen.getByRole('radiogroup', { name: 'Plan' }),
    ).toBeInTheDocument();
  });
});
