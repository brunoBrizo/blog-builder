import type { Metadata } from 'next';

export type OpenGraphInput = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: string;
  type?: 'website' | 'article';
};

export function buildOpenGraph(input: OpenGraphInput): Metadata['openGraph'] {
  return {
    title: input.title,
    description: input.description,
    url: input.url,
    siteName: input.siteName,
    locale: input.locale,
    type: input.type ?? 'website',
  };
}
