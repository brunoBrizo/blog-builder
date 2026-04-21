import type { Metadata } from 'next';

export type TwitterInput = {
  title: string;
  description: string;
  card?: 'summary' | 'summary_large_image';
};

export function buildTwitter(input: TwitterInput): Metadata['twitter'] {
  return {
    card: input.card ?? 'summary_large_image',
    title: input.title,
    description: input.description,
  };
}
