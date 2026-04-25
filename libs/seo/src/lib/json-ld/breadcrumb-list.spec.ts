import { buildBreadcrumbListJsonLd } from './breadcrumb-list';

describe('buildBreadcrumbListJsonLd', () => {
  it('returns a valid BreadcrumbList', () => {
    const result = buildBreadcrumbListJsonLd({
      items: [
        { name: 'Home', item: 'https://example.com' },
        { name: 'Articles', item: 'https://example.com/articles' },
        { name: 'Test', item: 'https://example.com/articles/test' },
      ],
    });

    expect(result).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Articles',
          item: 'https://example.com/articles',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Test',
          item: 'https://example.com/articles/test',
        },
      ],
    });
  });
});
