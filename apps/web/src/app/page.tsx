import { Placeholder } from '@blog-builder/ui';

export default function Index() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blog Builder</h1>
      <p className="text-base opacity-80">
        Foundation ready. Next up: content, SEO, and the rest of the roadmap.
      </p>
      <Placeholder>ui library wired</Placeholder>
    </main>
  );
}
