import { Injectable } from '@nestjs/common';
import type { z } from 'zod';

import { AppConfigService } from '../core/config/app-config.service';
import { PerplexityValidationError } from './generation.errors';
import {
  type PerplexityChatCompletionResponse,
  PerplexityChatCompletionResponseSchema,
  type PerplexityChatParams,
} from './perplexity.types';

const PERPLEXITY_URL = 'https://api.perplexity.ai/chat/completions';

export type PerplexityChatInput<TSchema extends z.ZodType> = {
  system: string;
  user: string;
  model?: string;
  params?: PerplexityChatParams;
  responseSchema: TSchema;
};

export type PerplexityChatResult<TSchema extends z.ZodType> = {
  data: z.infer<TSchema>;
  rawContent: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: string;
  searchResults: PerplexityChatCompletionResponse['search_results'];
};

@Injectable()
export class PerplexityClient {
  constructor(private readonly cfg: AppConfigService) {}

  async chat<TSchema extends z.ZodType>(
    input: PerplexityChatInput<TSchema>,
  ): Promise<PerplexityChatResult<TSchema>> {
    const model = input.model ?? 'sonar-pro';
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.cfg.perplexityTimeoutMs,
    );
    try {
      const body: Record<string, unknown> = {
        model,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
        temperature: input.params?.temperature,
        max_tokens: input.params?.max_tokens,
        search_recency_filter: input.params?.search_recency_filter,
        web_search_options: input.params?.web_search_options,
        disable_search: input.params?.disable_search,
        return_related_questions: input.params?.return_related_questions,
      };
      const res = await fetch(PERPLEXITY_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.cfg.perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Perplexity HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      const json: unknown = await res.json();
      const parsed = PerplexityChatCompletionResponseSchema.safeParse(json);
      if (!parsed.success) {
        throw new PerplexityValidationError(
          'Invalid Perplexity response envelope',
          parsed.error,
        );
      }
      const envelope = parsed.data;
      const content = envelope.choices[0]?.message.content;
      if (content === undefined || content.length === 0) {
        throw new PerplexityValidationError('Empty assistant content');
      }
      let jsonPayload: unknown;
      try {
        jsonPayload = JSON.parse(content) as unknown;
      } catch (e) {
        throw new PerplexityValidationError(
          'Assistant content is not valid JSON',
          e,
        );
      }
      const validated = input.responseSchema.safeParse(jsonPayload);
      if (!validated.success) {
        throw new PerplexityValidationError(
          'Assistant JSON failed schema validation',
          validated.error,
        );
      }
      const promptTokens = envelope.usage?.prompt_tokens ?? 0;
      const completionTokens = envelope.usage?.completion_tokens ?? 0;
      const totalTokens =
        envelope.usage?.total_tokens ?? promptTokens + completionTokens;
      const costNum =
        (promptTokens / 1_000_000) * this.cfg.perplexityUsdPerMtokensPrompt +
        (completionTokens / 1_000_000) *
          this.cfg.perplexityUsdPerMtokensCompletion;
      const costUsd = costNum.toFixed(6);
      return {
        data: validated.data as z.infer<TSchema>,
        rawContent: content,
        promptTokens,
        completionTokens,
        totalTokens,
        costUsd,
        searchResults: envelope.search_results,
      };
    } catch (e) {
      if (e instanceof PerplexityValidationError) {
        throw e;
      }
      if (e instanceof Error && e.name === 'AbortError') {
        throw new PerplexityValidationError(
          `Perplexity request timed out after ${this.cfg.perplexityTimeoutMs}ms`,
          e,
        );
      }
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }
}
