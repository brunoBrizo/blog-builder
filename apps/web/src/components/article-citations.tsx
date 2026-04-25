import { ExternalLink } from 'lucide-react';
import { cn } from '@blog-builder/ui';
import type { PublicArticleCitation } from '@blog-builder/shared-types';

type ArticleCitationsProps = {
  citations: PublicArticleCitation[];
  className?: string;
};

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function ArticleCitations({
  citations,
  className,
}: ArticleCitationsProps) {
  if (citations.length === 0) return null;

  return (
    <section
      className={cn('mt-12', className)}
      aria-labelledby="article-citations-heading"
    >
      <h2
        id="article-citations-heading"
        className="font-display text-2xl font-medium tracking-tight text-zinc-900 mb-6"
      >
        Sources & References
      </h2>
      <ol className="space-y-4">
        {citations.map((citation, i) => {
          const number = i + 1;
          const domain = extractDomain(citation.url);
          const title = citation.title ?? domain;

          return (
            <li
              key={`${citation.url}-${i}`}
              id={`cite-${number}`}
              className="flex gap-3 text-sm"
            >
              <span className="text-zinc-400 font-medium shrink-0 w-6 text-right">
                {number}.
              </span>
              <div className="min-w-0">
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                >
                  {title}
                  <ExternalLink className="w-3 h-3 shrink-0" aria-hidden />
                </a>
                {citation.publisher && (
                  <span className="block text-xs text-zinc-500 mt-0.5">
                    {citation.publisher}
                  </span>
                )}
                {citation.snippet && (
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                    {citation.snippet}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
