import { buildArticleJsonLd } from './article';

describe('buildArticleJsonLd', () => {
  it('returns a valid schema.org Article object', () => {
    const result = buildArticleJsonLd({
      headline: 'Test Article',
      image: ['https://example.com/image.jpg'],
      datePublished: '2025-01-01T00:00:00Z',
      author: { name: 'Jane Doe' },
      publisher: { name: 'Blog Builder' },
      inLanguage: 'en',
      url: 'https://example.com/articles/test',
    });

    expect(result).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article',
      image: ['https://example.com/image.jpg'],
      datePublished: '2025-01-01T00:00:00Z',
      author: { '@type': 'Person', name: 'Jane Doe' },
      publisher: { '@type': 'Organization', name: 'Blog Builder' },
      inLanguage: 'en',
      url: 'https://example.com/articles/test',
    });
  });

  it('includes optional fields when provided', () => {
    const result = buildArticleJsonLd({
      headline: 'Test',
      image: [],
      datePublished: '2025-01-01T00:00:00Z',
      dateModified: '2025-01-02T00:00:00Z',
      author: { name: 'John', url: 'https://john.example' },
      publisher: { name: 'Pub', logo: 'https://pub.example/logo.png' },
      articleSection: 'Tech',
      inLanguage: 'en',
      description: 'A test article',
      url: 'https://example.com/test',
    });

    expect(result).toMatchObject({
      dateModified: '2025-01-02T00:00:00Z',
      articleSection: 'Tech',
      description: 'A test article',
    });
    expect((result as Record<string, unknown>).author).toMatchObject({
      url: 'https://john.example',
    });
    expect((result as Record<string, unknown>).publisher).toMatchObject({
      logo: 'https://pub.example/logo.png',
    });
  });
});
