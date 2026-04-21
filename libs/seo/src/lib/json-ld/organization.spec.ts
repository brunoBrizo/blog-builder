import { describe, expect, it } from 'vitest';

import { buildOrganizationJsonLd } from './organization';

describe('buildOrganizationJsonLd', () => {
  it('emits Organization shape', () => {
    const json = buildOrganizationJsonLd({
      url: 'https://example.com',
      name: 'Example Org',
      description: 'We build things',
    });
    expect(json).toMatchObject({
      '@type': 'Organization',
      name: 'Example Org',
    });
  });
});
