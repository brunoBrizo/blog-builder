/**
 * Static marketing copy and assets aligned with `docs/designs/home-page.html`.
 * Internal links use real slugs; detail pages may differ from card copy.
 */

export const homeHero = {
  badge: 'New: Building RAG Applications in 2026',
  titleLine1: 'Architecting the',
  titleLine2: ' of software.',
  titleGradient: 'future',
  description:
    'Expert-led tutorials, architectural deep dives, and cutting-edge insights on artificial intelligence and modern development frameworks.',
  primaryCta: 'Read Latest Insights',
  secondaryCta: 'Subscribe to Digest',
} as const;

export const homeEditorPick = {
  kicker: 'Curated Selection',
  title: "Editor's Pick",
  cta: 'Read full story',
  articleHref: '/tutorials/complete-guide-to-rag' as const,
  imageUrl:
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  imageAlt: 'RAG Architecture',
  tag: 'Cornerstone Guide',
  headline: 'The Definitive Guide to Building RAG Applications in 2026',
  excerpt:
    'A comprehensive tutorial on architecting Retrieval-Augmented Generation pipelines. Learn how to optimize chunking strategies, select the right embedding models, and evaluate vector database performance at scale.',
  authorName: 'Marcus Dev',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80',
  meta: '12 min read • Updated Oct 24',
} as const;

export type HomeTutorialCard = {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  label: string;
  labelIcon: 'play' | 'server' | 'code';
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
};

export const homeTutorials: HomeTutorialCard[] = [
  {
    slug: 'react-server-components',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'React Code',
    label: 'Walkthrough',
    labelIcon: 'play',
    title: 'Mastering React Server Components',
    excerpt:
      'A complete guide to data fetching, suspense boundaries, and streaming architecture in Next.js 15.',
    author: 'Sarah Jenkins',
    readTime: '15 min read',
  },
  {
    slug: 'local-llms-ollama',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    imageAlt: 'Server Infrastructure',
    label: 'Architecture',
    labelIcon: 'server',
    title: 'Deploying Local LLMs with Ollama',
    excerpt:
      'Step-by-step instructions for running Llama 3 locally and integrating it into your Node.js backend.',
    author: 'David Chen',
    readTime: '10 min read',
  },
  {
    slug: 'advanced-typescript',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'TypeScript Code',
    label: 'Development',
    labelIcon: 'code',
    title: 'Advanced TypeScript Patterns in 2026',
    excerpt:
      'Elevate your codebase with advanced generics, utility types, and strict error handling strategies.',
    author: 'Alex Rivera',
    readTime: '18 min read',
  },
];

export type HomeArticleCard = {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  label: string;
  labelIcon: 'layers' | 'cpu';
  labelTone: 'blue' | 'emerald';
  title: string;
  excerpt: string;
  leftMeta: string;
  rightMeta: string;
};

export const homeLatestArticles: [HomeArticleCard, HomeArticleCard] = [
  {
    slug: 'cursor-vs-copilot',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    imageAlt: 'Coding',
    label: 'AI Tools',
    labelIcon: 'layers',
    labelTone: 'blue',
    title: 'Cursor vs GitHub Copilot: The 2026 Showdown',
    excerpt:
      'An in-depth performance review comparing autocomplete accuracy and codebase understanding.',
    leftMeta: 'Oct 22',
    rightMeta: '6 min read',
  },
  {
    slug: 'nextjs-15-features',
    imageUrl:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Tech grid',
    label: 'Performance',
    labelIcon: 'cpu',
    labelTone: 'emerald',
    title: 'Optimizing Core Web Vitals in Next.js 15',
    excerpt:
      'Practical techniques to achieve sub-2.5s LCP and eliminate Layout Shift using the App Router.',
    leftMeta: 'Oct 20',
    rightMeta: '8 min read',
  },
];

export type HomeNewsCard = {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  /** Tailwind color token for pulse dot */
  categoryTone: 'indigo' | 'emerald' | 'violet' | 'amber';
  timeLabel: string;
  title: string;
  excerpt: string;
};

export const homeNewsCards: HomeNewsCard[] = [
  {
    slug: 'openai-gpt-5-announcement',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'OpenAI technology',
    category: 'Release',
    categoryTone: 'indigo',
    timeLabel: '2 hours ago',
    title:
      'OpenAI releases highly anticipated GPT-4.5 preview to select developers',
    excerpt:
      'The new model introduces significantly improved reasoning capabilities and a massive 512k context window, setting a new standard for enterprise AI applications.',
  },
  {
    slug: 'mistral-large-3',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
    imageAlt: 'Nvidia hardware',
    category: 'Hardware',
    categoryTone: 'emerald',
    timeLabel: '5 hours ago',
    title:
      'Nvidia announces next-generation Blackwell architecture for AI inference',
    excerpt:
      'Promising up to 30x performance increase for LLM workloads, the new architecture focuses on extreme energy efficiency and massive datacenter scalability.',
  },
  {
    slug: 'anthropic-claude-4',
    imageUrl:
      'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Claude Opus performance',
    category: 'Research',
    categoryTone: 'violet',
    timeLabel: 'Yesterday',
    title:
      "Anthropic's Claude 3.5 Opus sets new benchmarks in coding and reasoning tasks",
    excerpt:
      'Surpassing major competitors in key evaluations, the latest iteration excels in complex multi-step coding tasks, agentic workflows, and logical deduction.',
  },
  {
    slug: 'eu-ai-act-updates',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
    imageAlt: 'Cyber security policy',
    category: 'Policy',
    categoryTone: 'amber',
    timeLabel: 'Oct 23',
    title: 'New AI regulation framework proposed by European Union committee',
    excerpt:
      'The newly proposed framework aims to establish strict guidelines for high-risk AI systems while simultaneously attempting to foster innovation in open-source development.',
  },
];

export const homeNewsletter = {
  title: 'The definitive weekly tech digest.',
  description:
    'Join 25,000+ developers and tech leaders. Get our latest deep dives, architectural teardowns, and AI tool reviews delivered straight to your inbox.',
  disclaimer: 'No spam. 1-click unsubscribe anytime.',
} as const;

export const homeContact = {
  kicker: 'Get in touch',
  title: 'Contact Us',
  subheading: "Let's build the future together.",
  body: 'Have a question about our tutorials, want to contribute a guest post, or interested in sponsoring Synthetix? Send us a message and our team will get back to you shortly.',
  linkedInHandle: '@synthetix_ai',
  email: 'hello@synthetix.ai',
} as const;
