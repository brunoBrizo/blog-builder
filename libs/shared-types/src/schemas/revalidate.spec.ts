import { describe, expect, it } from 'vitest';

import { RevalidatePathSchema } from './revalidate';

describe('RevalidatePathSchema', () => {
  it('accepts /blog/ and /draft/ paths', () => {
    expect(RevalidatePathSchema.safeParse({ path: '/blog/x' }).success).toBe(
      true,
    );
    expect(RevalidatePathSchema.safeParse({ path: 'draft/y' }).success).toBe(
      true,
    );
  });

  it('rejects other prefixes', () => {
    expect(RevalidatePathSchema.safeParse({ path: '/other' }).success).toBe(
      false,
    );
  });
});
