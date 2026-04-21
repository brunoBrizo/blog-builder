import { describe, expect, it } from 'vitest';

import { canonicalUrl } from './canonical-url';

describe('canonicalUrl', () => {
  const base = 'https://example.com';

  it('builds default locale without prefix segment', () => {
    expect(canonicalUrl('en', '/', base)).toBe('https://example.com/');
    expect(canonicalUrl('en', '/blog', base)).toBe('https://example.com/blog');
  });

  it('prefixes non-default locales', () => {
    expect(canonicalUrl('pt-br', '/blog', base)).toBe(
      'https://example.com/pt-br/blog',
    );
    expect(canonicalUrl('es', '/', base)).toBe('https://example.com/es');
  });
});
