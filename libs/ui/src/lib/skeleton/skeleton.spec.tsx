import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders', () => {
    const { container } = render(<Skeleton data-testid="s" />);
    expect(container.querySelector('[data-testid="s"]')).toBeTruthy();
  });
});
