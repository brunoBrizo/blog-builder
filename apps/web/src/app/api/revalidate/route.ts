import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { RevalidatePathsBodySchema } from '@blog-builder/shared-types';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('x-revalidate-secret');
  const expected = process.env['REVALIDATE_SHARED_SECRET'];
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RevalidatePathsBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { paths, tags } = parsed.data;
  for (const p of paths) {
    revalidatePath(p);
  }
  if (tags) {
    for (const t of tags) {
      revalidateTag(t, 'default');
    }
  }

  return NextResponse.json({
    ok: true,
    paths: paths.length,
    tags: tags?.length ?? 0,
  });
}
