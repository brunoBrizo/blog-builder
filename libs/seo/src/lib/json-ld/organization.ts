export type OrganizationJsonLdInput = {
  url: string;
  name: string;
  description?: string;
};

export function buildOrganizationJsonLd(
  input: OrganizationJsonLdInput,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: input.url,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
  };
}
