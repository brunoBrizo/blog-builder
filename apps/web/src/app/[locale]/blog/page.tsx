import { redirect } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * List UI lives at /articles. Keep /blog for backward-compatible bookmarks.
 */
export default async function BlogListRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: '/articles', locale });
}
