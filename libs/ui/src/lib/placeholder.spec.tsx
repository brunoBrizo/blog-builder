import { render, screen } from '@testing-library/react';
import { Placeholder } from './placeholder';

describe('Placeholder', () => {
  it('renders default text', () => {
    render(<Placeholder />);
    expect(screen.getByTestId('ui-placeholder').textContent).toBe('ui');
  });

  it('renders children when provided', () => {
    render(<Placeholder>hello</Placeholder>);
    expect(screen.getByTestId('ui-placeholder').textContent).toBe('hello');
  });
});
