import { describe, expect, it } from 'vitest';

import { buildOpenGraph } from './build-open-graph';

describe('buildOpenGraph', () => {
  it('returns website defaults', () => {
    const og = buildOpenGraph({
      title: 'T',
      description: 'D',
      url: 'https://example.com/',
      siteName: 'S',
      locale: 'en_US',
    });
    expect(og).toMatchObject({
      title: 'T',
      description: 'D',
      url: 'https://example.com/',
      siteName: 'S',
      locale: 'en_US',
      type: 'website',
    });
  });
});
