import type { z } from 'zod';

import type { PerplexityChatInput } from '../perplexity.client';
import type { PerplexityChatResult } from '../perplexity.client';

const searchResults = [
  {
    url: 'https://example.com/ref',
    title: 'Reference',
    date: '2024-06-01',
  },
];

/** Minimal valid payloads for each Perplexity call in order (steps 1–8). */
export const PIPELINE_STUB_FIXTURES = [
  {
    topics: [
      {
        primaryLongTailKeyword: 'best ai tools for developers',
        secondaryKeywords: ['llm', 'automation', 'workflow'],
        searchIntent: 'informational' as const,
        suggestedTitle: 'Best AI Tools for Developers in 2026',
      },
    ],
  },
  {
    commonPoints: ['Point A'],
    contentGaps: ['Gap B'],
    unansweredQuestions: ['Q1'],
    uniqueAngle: 'Practical comparison',
    summaryBrief: 'Brief',
  },
  {
    h1Title: 'Best AI Tools',
    metaDescription:
      'A practical guide to AI tools for developers under 155 chars.',
    sections: [
      { h2: 'Overview', h3: ['Context'], targetWords: 400 },
      { h2: 'Tools', h3: ['Coding', 'Search'], targetWords: 1200 },
    ],
    faqOutline: [{ question: 'What is an LLM?' }],
    totalTargetWords: 2200,
  },
  {
    articleMarkdown:
      '## Overview\n\nAI tools help developers.\n\n## Tools\n\nMore content here.\n\n[Source: Reference](https://example.com/ref)',
    tldr: 'AI tools speed up development.',
    keyTakeaways: ['Many options exist', 'Pick for your stack'],
  },
  {
    articleMarkdown:
      '## Overview\n\nAI tools help developers — with a human voice.\n\n## My take\n\nI have used these daily for months.\n\n## Tools\n\nMore content.\n\n[Source: Reference](https://example.com/ref)',
  },
  {
    meta_title: 'Best AI Tools for Developers | Guide',
    meta_description: 'Compare the best AI tools for developers in 2026.',
    slug: 'best-ai-tools-developers-2026',
    focus_keyword: 'ai tools developers',
    secondary_keywords: ['llm', 'copilot'],
    og_title: 'Best AI Tools',
    og_description: 'Developer-focused AI tooling guide.',
    faq_schema: [
      { question: 'What is an LLM?', answer: 'A large language model.' },
    ],
    article_schema: {
      headline: 'Best AI Tools for Developers',
      description: 'Guide',
      keywords: 'ai, developers',
      wordCount: 1800,
    },
    suggested_internal_links: ['/blog/ai'],
    suggested_categories: ['AI'],
  },
  {
    slug: 'melhores-ferramentas-ia',
    title: 'Melhores ferramentas de IA',
    subtitle: null,
    tldr: 'Resumo em PT',
    keyTakeaways: ['Um', 'Dois'],
    articleMarkdown: '## Visão\n\nConteúdo em PT-BR.',
    meta_title: 'Meta PT',
    meta_description: 'Desc PT',
    og_title: 'OG PT',
    og_description: 'OG desc PT',
    faq: [{ question: 'Pergunta?', answer: 'Resposta.' }],
  },
  {
    slug: 'mejores-herramientas-ia',
    title: 'Mejores herramientas de IA',
    subtitle: null,
    tldr: 'Resumen ES',
    keyTakeaways: ['Uno', 'Dos'],
    articleMarkdown: '## Visión\n\nContenido en español.',
    meta_title: 'Meta ES',
    meta_description: 'Desc ES',
    og_title: 'OG ES',
    og_description: 'OG desc ES',
    faq: [{ question: '¿Pregunta?', answer: 'Respuesta.' }],
  },
] as const;

export type StubPerplexityOptions = {
  /** 0-based call index to throw (simulates failing step before memo). */
  throwOnCallIndex?: number;
  promptTokens?: number;
  completionTokens?: number;
};

/**
 * First invocation at call index 3 throws without advancing the fixture cursor,
 * so a second pipeline run resumes at step 4 (simulates Inngest replay + memoized steps 1–3).
 */
export function createCrashResumePerplexityStub(
  promptTokens = 100,
  completionTokens = 200,
): jest.MockedFunction<
  <TSchema extends z.ZodType>(
    input: PerplexityChatInput<TSchema>,
  ) => Promise<PerplexityChatResult<TSchema>>
> {
  let callIndex = 0;
  let failStep4Once = true;
  return jest.fn(
    async <TSchema extends z.ZodType>(
      input: PerplexityChatInput<TSchema>,
    ): Promise<PerplexityChatResult<TSchema>> => {
      const ix = callIndex;
      if (ix === 3 && failStep4Once) {
        failStep4Once = false;
        throw new Error('stub: crash before step 4 completes');
      }
      const raw = PIPELINE_STUB_FIXTURES[ix];
      if (raw === undefined) {
        throw new Error(`stub: no fixture for call index ${ix}`);
      }
      const data = input.responseSchema.parse(raw) as z.infer<TSchema>;
      callIndex += 1;
      return {
        data,
        rawContent: JSON.stringify(raw),
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        costUsd: '0.001000',
        searchResults: ix === 3 || ix === 4 ? [...searchResults] : undefined,
      };
    },
  );
}

export function createStubPerplexityChat(
  options: StubPerplexityOptions = {},
): jest.MockedFunction<
  <TSchema extends z.ZodType>(
    input: PerplexityChatInput<TSchema>,
  ) => Promise<PerplexityChatResult<TSchema>>
> {
  let callIndex = 0;
  const promptTokens = options.promptTokens ?? 100;
  const completionTokens = options.completionTokens ?? 200;

  return jest.fn(
    async <TSchema extends z.ZodType>(
      input: PerplexityChatInput<TSchema>,
    ): Promise<PerplexityChatResult<TSchema>> => {
      const ix = callIndex++;
      if (options.throwOnCallIndex === ix) {
        throw new Error(`stub: simulated failure at perplexity call ${ix}`);
      }
      const raw = PIPELINE_STUB_FIXTURES[ix];
      if (raw === undefined) {
        throw new Error(`stub: no fixture for call index ${ix}`);
      }
      const data = input.responseSchema.parse(raw) as z.infer<TSchema>;
      const ixForSearch = ix;
      return {
        data,
        rawContent: JSON.stringify(raw),
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        costUsd: '0.001000',
        searchResults:
          ixForSearch === 3 || ixForSearch === 4
            ? [...searchResults]
            : undefined,
      };
    },
  );
}
