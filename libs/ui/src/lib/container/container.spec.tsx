import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from './container';

describe('Container', () => {
  it('renders', () => {
    const { container } = render(<Container data-testid="c">x</Container>);
    expect(container.querySelector('[data-testid="c"]')).toBeTruthy();
  });
});
