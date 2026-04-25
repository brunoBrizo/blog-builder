import { z } from 'zod';

export type SonarCallParams = {
  temperature?: number;
  max_tokens?: number;
  search_recency_filter?: 'hour' | 'day' | 'week' | 'month' | 'year';
  web_search_options?: { search_context_size?: 'low' | 'medium' | 'high' };
  disable_search?: boolean;
  return_related_questions?: boolean;
};

export const Step1ResearchResponseSchema = z.object({
  topics: z
    .array(
      z.object({
        primaryLongTailKeyword: z.string(),
        secondaryKeywords: z.array(z.string()),
        searchIntent: z.enum(['informational', 'commercial', 'transactional']),
        suggestedTitle: z.string(),
        /** Optional ranking hint (higher = more valuable for scheduling). */
        score: z.number().min(0).max(100).optional(),
      }),
    )
    .min(1),
});
export type Step1ResearchResponse = z.infer<typeof Step1ResearchResponseSchema>;

export function buildStep1Research(input: { topicSeed: string }): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step1ResearchResponseSchema;
} {
  return {
    system:
      'You are an SEO keyword researcher for an AI and technology blog. Reply with valid JSON only matching the schema.',
    user: `Find 3 trending AI/tech topics aligned with this seed: "${input.topicSeed}". For each topic return primaryLongTailKeyword, secondaryKeywords (3 items), searchIntent, suggestedTitle, and an optional numeric score from 0-100 indicating editorial strength (timeliness + search demand). Target an international English-speaking audience.`,
    params: {
      temperature: 0.7,
      max_tokens: 2000,
      search_recency_filter: 'week',
      web_search_options: { search_context_size: 'high' },
      return_related_questions: true,
    },
    responseSchema: Step1ResearchResponseSchema,
  };
}

export const Step2CompetitorResponseSchema = z.object({
  commonPoints: z.array(z.string()),
  contentGaps: z.array(z.string()),
  unansweredQuestions: z.array(z.string()),
  uniqueAngle: z.string(),
  summaryBrief: z.string(),
});
export type Step2CompetitorResponse = z.infer<
  typeof Step2CompetitorResponseSchema
>;

export function buildStep2Competitor(input: {
  primaryKeyword: string;
  title: string;
}): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step2CompetitorResponseSchema;
} {
  return {
    system:
      'You are an SEO content strategist. Analyze search results and return structured JSON only.',
    user: `Search for: ${input.primaryKeyword}. Title angle: ${input.title}. Return JSON with commonPoints, contentGaps, unansweredQuestions, uniqueAngle, summaryBrief.`,
    params: {
      temperature: 0.3,
      max_tokens: 2000,
      search_recency_filter: 'month',
      web_search_options: { search_context_size: 'high' },
    },
    responseSchema: Step2CompetitorResponseSchema,
  };
}

export const Step3OutlineResponseSchema = z.object({
  h1Title: z.string(),
  metaDescription: z.string(),
  sections: z.array(
    z.object({
      h2: z.string(),
      h3: z.array(z.string()),
      targetWords: z.number().int(),
    }),
  ),
  faqOutline: z.array(z.object({ question: z.string() })),
  totalTargetWords: z.number().int(),
});
export type Step3OutlineResponse = z.infer<typeof Step3OutlineResponseSchema>;

export function buildStep3Outline(input: {
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  competitor: Step2CompetitorResponse;
}): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step3OutlineResponseSchema;
} {
  return {
    system:
      'You are an expert technical blog writer and SEO specialist. JSON only.',
    user: `Create a detailed outline. Title: ${input.title}. Primary keyword: ${input.primaryKeyword}. Secondary: ${input.secondaryKeywords.join(', ')}. Gaps: ${input.competitor.contentGaps.join('; ')}. Unique angle: ${input.competitor.uniqueAngle}. Include h1Title, metaDescription (under 155 chars), sections with h2, h3, targetWords, faqOutline, totalTargetWords (2000-2500).`,
    params: {
      temperature: 0.5,
      max_tokens: 1500,
      disable_search: true,
    },
    responseSchema: Step3OutlineResponseSchema,
  };
}

export const Step4WriteResponseSchema = z.object({
  articleMarkdown: z.string(),
  tldr: z.string(),
  keyTakeaways: z.array(z.string()),
});
export type Step4WriteResponse = z.infer<typeof Step4WriteResponseSchema>;

export function buildStep4Write(input: { outline: Step3OutlineResponse }): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step4WriteResponseSchema;
} {
  return {
    system: `You are a senior tech writer. Write like a real person. JSON only with keys articleMarkdown, tldr, keyTakeaways (string array). articleMarkdown must be GitHub-flavored Markdown with ## and ### headings, [Source: title](url) citations for data claims.`,
    user: `Write the full article from this outline JSON:\n${JSON.stringify(input.outline)}`,
    params: {
      temperature: 0.6,
      max_tokens: 8000,
      search_recency_filter: 'month',
      web_search_options: { search_context_size: 'high' },
    },
    responseSchema: Step4WriteResponseSchema,
  };
}

export const Step5HumanizeResponseSchema = z.object({
  articleMarkdown: z.string(),
});
export type Step5HumanizeResponse = z.infer<typeof Step5HumanizeResponseSchema>;

export function buildStep5Humanize(input: { draftMarkdown: string }): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step5HumanizeResponseSchema;
} {
  return {
    system: `You humanize AI-written Markdown. Return JSON { "articleMarkdown": "..." } only. Preserve [Source: title](url) citations and code fences exactly.`,
    user: `Humanize this article. Add a "## My take" section before FAQ with 150-250 words first-person perspective. Full markdown:\n\n${input.draftMarkdown}`,
    params: {
      temperature: 0.7,
      max_tokens: 10000,
      disable_search: true,
    },
    responseSchema: Step5HumanizeResponseSchema,
  };
}

export const Step6SeoResponseSchema = z.object({
  meta_title: z.string(),
  meta_description: z.string(),
  slug: z.string(),
  focus_keyword: z.string(),
  secondary_keywords: z.array(z.string()),
  og_title: z.string(),
  og_description: z.string(),
  faq_schema: z.array(z.object({ question: z.string(), answer: z.string() })),
  article_schema: z.object({
    headline: z.string(),
    description: z.string(),
    keywords: z.string(),
    wordCount: z.number().int(),
  }),
  suggested_internal_links: z.array(z.string()),
  suggested_categories: z.array(z.string()),
});
export type Step6SeoResponse = z.infer<typeof Step6SeoResponseSchema>;

export function buildStep6Seo(input: {
  title: string;
  primaryKeyword: string;
  excerpt: string;
}): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step6SeoResponseSchema;
} {
  return {
    system: 'You are an SEO metadata specialist. Return valid JSON only.',
    user: `Generate SEO metadata. Title: ${input.title}. Primary keyword: ${input.primaryKeyword}. Summary: ${input.excerpt}`,
    params: {
      temperature: 0.3,
      max_tokens: 1000,
      disable_search: true,
    },
    responseSchema: Step6SeoResponseSchema,
  };
}

export const Step7TranslatePtResponseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  tldr: z.string(),
  keyTakeaways: z.array(z.string()),
  articleMarkdown: z.string(),
  meta_title: z.string(),
  meta_description: z.string(),
  og_title: z.string().nullable(),
  og_description: z.string().nullable(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
});
export type Step7TranslatePtResponse = z.infer<
  typeof Step7TranslatePtResponseSchema
>;

export function buildStep7TranslatePt(input: {
  articleMarkdown: string;
  seo: Step6SeoResponse;
}): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step7TranslatePtResponseSchema;
} {
  return {
    system:
      'You translate technology content to Brazilian Portuguese (pt-BR). JSON only. Keep Markdown and links intact.',
    user: `Translate to pt-BR. Article:\n${input.articleMarkdown}\nSEO JSON:\n${JSON.stringify(input.seo)}`,
    params: {
      temperature: 0.3,
      max_tokens: 10000,
      disable_search: true,
    },
    responseSchema: Step7TranslatePtResponseSchema,
  };
}

export const Step8TranslateEsResponseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  tldr: z.string(),
  keyTakeaways: z.array(z.string()),
  articleMarkdown: z.string(),
  meta_title: z.string(),
  meta_description: z.string(),
  og_title: z.string().nullable(),
  og_description: z.string().nullable(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
});
export type Step8TranslateEsResponse = z.infer<
  typeof Step8TranslateEsResponseSchema
>;

export function buildStep8TranslateEs(input: {
  articleMarkdown: string;
  seo: Step6SeoResponse;
}): {
  system: string;
  user: string;
  params: SonarCallParams;
  responseSchema: typeof Step8TranslateEsResponseSchema;
} {
  return {
    system:
      'You translate technology content to Latin American Spanish. JSON only. Keep Markdown and links intact.',
    user: `Translate to es. Article:\n${input.articleMarkdown}\nSEO JSON:\n${JSON.stringify(input.seo)}`,
    params: {
      temperature: 0.3,
      max_tokens: 10000,
      disable_search: true,
    },
    responseSchema: Step8TranslateEsResponseSchema,
  };
}
