import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  AppToastProvider,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from './toast';

describe('Toast', () => {
  it('renders live region for toasts', () => {
    render(
      <AppToastProvider>
        <ToastRoot open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>OK</ToastDescription>
        </ToastRoot>
      </AppToastProvider>,
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
