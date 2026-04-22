export type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: 'violet' | 'emerald' | 'blue' | 'amber' | 'rose' | 'zinc';
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'AI Tools & Reviews',
    slug: 'ai-tools-reviews',
    count: 24,
    color: 'blue',
  },
  {
    id: '2',
    name: 'Development & Coding',
    slug: 'development-coding',
    count: 18,
    color: 'emerald',
  },
  {
    id: '3',
    name: 'Guides & Tutorials',
    slug: 'guides-tutorials',
    count: 12,
    color: 'violet',
  },
  {
    id: '4',
    name: 'Tech News & Trends',
    slug: 'tech-news-trends',
    count: 9,
    color: 'rose',
  },
  {
    id: '5',
    name: 'Productivity & Automation',
    slug: 'productivity-automation',
    count: 15,
    color: 'amber',
  },
];
