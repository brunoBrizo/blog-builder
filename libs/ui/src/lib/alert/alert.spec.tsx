import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertTitle } from './alert';

describe('Alert', () => {
  it('is an alert', () => {
    render(
      <Alert>
        <AlertTitle>Note</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Note');
  });
});
