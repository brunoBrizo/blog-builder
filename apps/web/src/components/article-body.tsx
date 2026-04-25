import { CodeBlock } from './code-block';
import { AdPlaceholder } from './ad-placeholder';
import type { ArticleBodyBlock } from '../mocks/articles';
import { cn } from '@blog-builder/ui';

function renderInlineSegs(segments: { t: 'text' | 'strong'; v: string }[]) {
  return (
    <>
      {segments.map((s, i) => {
        if (s.t === 'strong') {
          return (
            <strong key={i} className="font-medium text-zinc-900">
              {s.v}
            </strong>
          );
        }
        return <span key={i}>{s.v}</span>;
      })}
    </>
  );
}

type ArticleBodyProps = {
  blocks?: ArticleBodyBlock[];
  html?: string;
  className?: string;
};

export function ArticleBody({ blocks, html, className }: ArticleBodyProps) {
  if (html) {
    return (
      <div
        className={cn(
          'prose prose-zinc max-w-none text-base text-zinc-600 font-light leading-relaxed space-y-6 article-body',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={cn(
        'prose prose-zinc max-w-none text-base text-zinc-600 font-light leading-relaxed space-y-6',
        className,
      )}
    >
      {(blocks ?? []).map((b, i) => {
        switch (b.type) {
          case 'lead':
            return (
              <p
                key={i}
                className="text-xl text-zinc-800 font-medium mb-8 leading-snug"
              >
                {b.text}
              </p>
            );
          case 'p':
            return <p key={i}>{b.text}</p>;
          case 'pInline':
            return <p key={i}>{renderInlineSegs(b.segments)}</p>;
          case 'h2':
            return (
              <h2
                key={b.id}
                id={b.id}
                className="font-display text-2xl font-medium tracking-tight text-zinc-900 mt-12 mb-6 scroll-mt-24"
              >
                {b.text}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={i}
                className="font-display text-xl font-medium tracking-tight text-zinc-900 mt-8 mb-4"
              >
                {b.text}
              </h3>
            );
          case 'ul':
            return (
              <ul
                key={i}
                className="list-disc pl-5 space-y-2 mb-6 not-prose text-zinc-600 marker:text-zinc-400"
              >
                {b.items.map((row, j) => (
                  <li key={j} className="pl-0.5">
                    <strong className="text-zinc-900 font-medium">
                      {row.label}
                    </strong>{' '}
                    {row.description}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol
                key={i}
                className="list-decimal pl-5 space-y-2 mb-6 not-prose text-zinc-600 marker:text-zinc-400"
              >
                {b.items.map((row, j) => (
                  <li key={j} className="pl-0.5">
                    <strong className="text-zinc-900 font-medium">
                      {row.label}
                    </strong>{' '}
                    {row.description}
                  </li>
                ))}
              </ol>
            );
          case 'blockquote': {
            const isAnthropicStyle = Boolean(b.attribution);
            if (isAnthropicStyle) {
              return (
                <blockquote
                  key={i}
                  className="not-prose border-l-2 border-indigo-500 pl-6 my-8 text-zinc-700 italic text-lg font-medium bg-gradient-to-r from-indigo-50/50 to-transparent pr-4 py-3 rounded-r-lg"
                >
                  {b.text}
                  {b.attribution && (
                    <span className="block text-sm font-normal text-zinc-500 mt-2 not-italic">
                      — {b.attribution}
                    </span>
                  )}
                </blockquote>
              );
            }
            if (b.quoteStyle === 'gradient') {
              return (
                <blockquote
                  key={i}
                  className="not-prose border-l-2 border-indigo-500 pl-6 my-8 text-zinc-700 italic text-lg font-medium bg-gradient-to-r from-indigo-50/50 to-transparent pr-4 py-3 rounded-r-lg"
                >
                  {b.text}
                </blockquote>
              );
            }
            return (
              <blockquote
                key={i}
                className="not-prose border-l-2 border-indigo-600 pl-4 py-3 pr-4 bg-indigo-50/30 rounded-r-lg my-8 text-zinc-700 italic"
              >
                {b.text}
              </blockquote>
            );
          }
          case 'inContentAd':
            return (
              <div key={i} className="not-prose">
                <AdPlaceholder type="content" articleStyle />
              </div>
            );
          case 'stats':
            return (
              <div
                key={i}
                className="not-prose my-8 rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-50 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-around text-center sm:text-left"
              >
                {b.items.map((m, j) => (
                  <div
                    key={`${m.value}-${m.label}`}
                    className={cn(
                      'flex min-w-0 flex-1 flex-col items-center sm:items-start py-3 first:pt-0 last:pb-0 sm:py-0',
                      j > 0 &&
                        'border-t sm:border-t-0 sm:border-l sm:pl-8 sm:ml-0 border-zinc-200',
                    )}
                  >
                    <div className="text-3xl font-display font-medium text-indigo-600 mb-1">
                      {m.value}
                    </div>
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            );
          case 'code':
            return (
              <div key={i} className="not-prose">
                <CodeBlock
                  language={b.language}
                  code={b.code}
                  variant={b.displayVariant ?? 'default'}
                  {...(b.plainText != null ? { copyText: b.plainText } : {})}
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
