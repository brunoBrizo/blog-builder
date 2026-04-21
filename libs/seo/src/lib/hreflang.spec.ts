import { describe, expect, it } from 'vitest';

import { buildHreflangMap } from './hreflang';

describe('buildHreflangMap', () => {
  it('includes all locales and x-default', () => {
    const base = 'https://example.com';
    const map = buildHreflangMap('/pricing', base);
    expect(map['en']).toBe('https://example.com/pricing');
    expect(map['pt-BR']).toBe('https://example.com/pt-br/pricing');
    expect(map['es']).toBe('https://example.com/es/pricing');
    expect(map['x-default']).toBe('https://example.com/pricing');
  });
});
