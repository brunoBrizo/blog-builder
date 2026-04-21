import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('associates with label via id', () => {
    render(
      <>
        <label htmlFor="e">Email</label>
        <Input id="e" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
