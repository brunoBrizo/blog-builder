import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildMetadata } from './build-metadata';

describe('buildMetadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('composes canonical, alternates, openGraph, twitter', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
    const m = buildMetadata({
      locale: 'pt-br',
      pathname: '/blog',
      title: 'Blog',
      description: 'Posts',
      siteName: 'Example',
      ogLocale: 'pt_BR',
    });
    expect(m.alternates?.canonical).toBe('https://example.com/pt-br/blog');
    expect(m.alternates?.languages?.['x-default']).toBe(
      'https://example.com/blog',
    );
    expect(m.openGraph?.url).toBe('https://example.com/pt-br/blog');
    expect(m.twitter?.title).toBe('Blog');
  });
});
