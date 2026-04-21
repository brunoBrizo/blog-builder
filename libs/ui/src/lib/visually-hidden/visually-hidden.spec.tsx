import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VisuallyHidden } from './visually-hidden';

describe('VisuallyHidden', () => {
  it('renders children', () => {
    const { getByText } = render(<VisuallyHidden>Secret</VisuallyHidden>);
    expect(getByText('Secret')).toBeInTheDocument();
  });
});
