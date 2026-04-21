import { z } from 'zod';

function pathAllowed(p: string): boolean {
  const n = p.startsWith('/') ? p : `/${p}`;
  return n.startsWith('/blog/') || n.startsWith('/draft/');
}

/** Body for on-demand ISR revalidation (API + any caller that mirrors validation). */
export const RevalidatePathSchema = z.object({
  path: z.string().min(1).refine(pathAllowed, {
    message: 'path must start with /blog/ or /draft/',
  }),
});

export type RevalidatePathInput = z.infer<typeof RevalidatePathSchema>;
