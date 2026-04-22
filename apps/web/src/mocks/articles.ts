import { authors, type Author } from './authors';
import { categories, type Category } from './categories';

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  readTimeMin: number;
  featuredImageUrl: string;
  author: Author;
  category: Category;
  variant: 'cornerstone' | 'standard';
};

const marcus = authors[0];
const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug) as Category;

export const articles: Article[] = [
  {
    id: '1',
    slug: 'complete-guide-to-rag',
    title: 'The Definitive Guide to Building RAG Applications in 2025',
    excerpt:
      'A comprehensive 3,000-word tutorial on architecting Retrieval-Augmented Generation pipelines. Learn how to optimize chunking strategies, select the right embedding models, and evaluate vector database performance.',
    publishedAt: 'Oct 24, 2025',
    readTimeMin: 12,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    author: marcus,
    category: getCategory('guides-tutorials'),
    variant: 'cornerstone',
  },
  {
    id: '2',
    slug: 'cursor-vs-copilot',
    title: 'Cursor vs GitHub Copilot: Which is the Better AI Coding Assistant?',
    excerpt:
      'An in-depth performance review comparing autocomplete accuracy, codebase understanding, and UI integration for full-stack developers.',
    publishedAt: 'Oct 22, 2025',
    readTimeMin: 6,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    author: marcus,
    category: getCategory('ai-tools-reviews'),
    variant: 'standard',
  },
  {
    id: '3',
    slug: 'nextjs-15-features',
    title: 'Optimizing Core Web Vitals in Next.js 15',
    excerpt:
      'Practical techniques to achieve sub-2.5s LCP and eliminate Cumulative Layout Shift (CLS) using the latest App Router features.',
    publishedAt: 'Oct 20, 2025',
    readTimeMin: 8,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=600',
    author: marcus,
    category: getCategory('development-coding'),
    variant: 'standard',
  },
  {
    id: '4',
    slug: 'zapier-alternatives',
    title: '5 Open-Source Alternatives to Zapier for Local Workflows',
    excerpt:
      'Stop paying per-task execution fees. We explore n8n, Huginn, and other self-hosted automation tools for privacy-focused developers.',
    publishedAt: 'Oct 18, 2025',
    readTimeMin: 5,
    featuredImageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    author: marcus,
    category: getCategory('productivity-automation'),
    variant: 'standard',
  },
];
