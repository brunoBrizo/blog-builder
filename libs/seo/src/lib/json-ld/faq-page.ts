export type FaqPageJsonLdInput = {
  questions: { name: string; acceptedAnswer: { text: string } }[];
};

export function buildFaqPageJsonLd(input: FaqPageJsonLdInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.questions.map((q) => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.acceptedAnswer.text,
      },
    })),
  };
}
