import { describe, expect, it } from 'vitest';

import { buildWebSiteJsonLd } from './website';

describe('buildWebSiteJsonLd', () => {
  it('emits WebSite shape', () => {
    const json = buildWebSiteJsonLd({
      url: 'https://example.com',
      name: 'Example',
      description: 'Desc',
      inLanguage: ['en', 'pt-BR'],
    });
    expect(json).toMatchObject({
      '@type': 'WebSite',
      url: 'https://example.com',
      name: 'Example',
    });
  });
});
