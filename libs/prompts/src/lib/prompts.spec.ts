import {
  buildStep1Research,
  Step1ResearchResponseSchema,
} from './article-pipeline-builders';

describe('article-pipeline-builders', () => {
  it('buildStep1Research returns prompts and schema', () => {
    const out = buildStep1Research({ topicSeed: 'AI tooling' });
    expect(out.system).toContain('SEO');
    expect(out.user).toContain('AI tooling');
    expect(out.params.search_recency_filter).toBe('week');
    expect(out.responseSchema).toBe(Step1ResearchResponseSchema);
  });
});
