export type BreadcrumbListJsonLdInput = {
  items: { name: string; item: string }[];
};

export function buildBreadcrumbListJsonLd(
  input: BreadcrumbListJsonLdInput,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
