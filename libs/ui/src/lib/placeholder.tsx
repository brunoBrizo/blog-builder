import type { ReactNode } from 'react';

export interface PlaceholderProps {
  readonly children?: ReactNode;
}

export function Placeholder({ children }: PlaceholderProps) {
  return <div data-testid="ui-placeholder">{children ?? 'ui'}</div>;
}
