import { z } from 'zod';

/** Raw Perplexity chat completions response (before `content` JSON parse). */
export const PerplexityChatCompletionResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          role: z.string().optional(),
          content: z.string(),
        }),
      }),
    )
    .min(1),
  usage: z
    .object({
      prompt_tokens: z.number().optional(),
      completion_tokens: z.number().optional(),
      total_tokens: z.number().optional(),
    })
    .optional(),
  search_results: z
    .array(
      z.object({
        url: z.string(),
        title: z.string().optional(),
        date: z.string().optional(),
        last_updated: z.string().optional(),
      }),
    )
    .optional(),
});

export type PerplexityChatCompletionResponse = z.infer<
  typeof PerplexityChatCompletionResponseSchema
>;

export type PerplexityChatParams = {
  temperature?: number;
  max_tokens?: number;
  search_recency_filter?: 'hour' | 'day' | 'week' | 'month' | 'year';
  web_search_options?: { search_context_size?: 'low' | 'medium' | 'high' };
  disable_search?: boolean;
  return_related_questions?: boolean;
};
