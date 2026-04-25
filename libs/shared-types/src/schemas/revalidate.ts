import { z } from 'zod';

/** Allowed ISR paths: blog/draft, locale home, articles list, sitemap. */
export function revalidatePathAllowed(p: string): boolean {
  const n = p.startsWith('/') ? p : `/${p}`;
  if (n.startsWith('/blog/') || n.startsWith('/draft/')) {
    return true;
  }
  if (/^(?:\/(?:en|pt-BR|es))\/(?:blog|draft|articles)(?:\/|$)/.test(n)) {
    return true;
  }
  if (/^\/(?:en|pt-BR|es)$/.test(n)) {
    return true;
  }
  if (n === '/sitemap.xml') {
    return true;
  }
  return false;
}

/** Single path (legacy). */
export const RevalidatePathSchema = z.object({
  path: z.string().min(1).refine(revalidatePathAllowed, {
    message:
      'path must be /blog/*, /draft/*, /{en|pt-BR|es}/*, or /sitemap.xml',
  }),
});

export type RevalidatePathInput = z.infer<typeof RevalidatePathSchema>;

/** Batch ISR revalidation (Next.js App Router route). */
export const RevalidatePathsBodySchema = z.object({
  paths: z
    .array(z.string().min(1).max(512))
    .min(1)
    .max(50)
    .refine((paths) => paths.every(revalidatePathAllowed), {
      message: 'each path must be an allowed ISR pattern',
    }),
  tags: z.array(z.string().min(1).max(128)).max(20).optional(),
});

export type RevalidatePathsBody = z.infer<typeof RevalidatePathsBodySchema>;
