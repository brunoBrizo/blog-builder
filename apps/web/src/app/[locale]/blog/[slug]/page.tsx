import { redirect } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Article detail lives at `/articles/[slug]`. Redirect legacy `/blog/[slug]` URLs.
 */
export default async function BlogArticleRedirect({ params }: Props) {
  const { locale, slug } = await params;
  redirect({ href: `/articles/${slug}`, locale });
}
