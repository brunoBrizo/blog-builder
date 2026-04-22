import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('common');

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl mb-6">
        {t('siteName')}
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-zinc-500 mb-10">
        Home placeholder — pending design. Check out the{' '}
        <a href="/blog" className="text-indigo-600 hover:underline">
          /blog
        </a>{' '}
        route to see the implemented UI mockups!
      </p>
    </main>
  );
}
