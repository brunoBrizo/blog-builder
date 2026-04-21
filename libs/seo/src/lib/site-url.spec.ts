import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSiteUrl } from './site-url';

describe('getSiteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers NEXT_PUBLIC_SITE_URL and strips trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://blog.example/');
    expect(getSiteUrl()).toBe('https://blog.example');
  });

  it('falls back to VERCEL_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_URL', 'my-app.vercel.app');
    expect(getSiteUrl()).toBe('https://my-app.vercel.app');
  });

  it('defaults to localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_URL', '');
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });
});
