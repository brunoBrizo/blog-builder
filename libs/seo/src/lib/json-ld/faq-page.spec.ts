import { buildFaqPageJsonLd } from './faq-page';

describe('buildFaqPageJsonLd', () => {
  it('returns a valid FAQPage', () => {
    const result = buildFaqPageJsonLd({
      questions: [
        {
          name: 'What is RAG?',
          acceptedAnswer: { text: 'Retrieval-Augmented Generation.' },
        },
      ],
    });

    expect(result).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is RAG?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Retrieval-Augmented Generation.',
          },
        },
      ],
    });
  });
});
