import { describe, expect, it } from 'vitest';

import { buildTwitter } from './build-twitter';

describe('buildTwitter', () => {
  it('sets summary_large_image by default', () => {
    const tw = buildTwitter({ title: 'T', description: 'D' });
    expect(tw).toMatchObject({
      card: 'summary_large_image',
      title: 'T',
      description: 'D',
    });
  });
});
