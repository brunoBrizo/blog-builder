export const newsListHero = {
  badge: 'Synthetix AI Dispatch',
  title: 'The Pulse of AI.',
  description:
    'Breaking developments, funding rounds, and technological breakthroughs. Your daily brief on the intelligence revolution.',
} as const;

export type NewsListFeatured = {
  slug: string;
  badgeLabel: string;
  listTitle: string;
  listSubhead: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  timeLabel: string;
  imageUrl: string;
  imageAlt: string;
};

export const newsListFeatured: NewsListFeatured = {
  slug: 'openai-gpt-5-announcement',
  badgeLabel: 'Breaking News',
  listTitle: 'OpenAI Unveils GPT-5: A New Era of Reasoning',
  listSubhead:
    'The next-generation model introduces unprecedented logical reasoning capabilities, real-time multimodal processing, and a heavily reinforced alignment protocol that sets a new industry standard.',
  authorName: 'Marcus Dev',
  authorRole: 'Chief AI Reporter',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80',
  timeLabel: '2 hours ago',
  imageUrl:
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  imageAlt: 'Abstract representation of a neural network',
};

export const newsFilterCategories = [
  'All Categories',
  'Foundation Models',
  'Startups & Funding',
  'Hardware',
  'Policy',
] as const;

export const newsFilterTypes = [
  'All Types',
  'News',
  'Deep Dives',
  'Interviews',
] as const;

export const newsFilterSort = [
  'Latest Updates',
  'Most Read',
  "Editor's Picks",
] as const;

export type NewsStoryTagIcon = 'smartphone' | 'server' | 'scale' | 'bot';

export type NewsStoryAccent = 'indigo' | 'emerald' | 'amber' | 'rose';

export type NewsListStory = {
  slug: string;
  /** Wide bento: image on `left` (robotics) or `right` (Apple). `stacked` = 1-col card. */
  layout: 'wide-right' | 'wide-left' | 'stacked';
  title: string;
  excerpt: string;
  timeLabel: string;
  /** When true, show time in content area; when false on stacked, time sits on the image. */
  timeInContent: boolean;
  authorName: string;
  authorAvatarUrl: string;
  imageUrl: string;
  imageAlt: string;
  tag: { label: string; icon: NewsStoryTagIcon; tone?: 'rose' };
  ctaLabel: string;
  accent: NewsStoryAccent;
};

export const newsListStories: NewsListStory[] = [
  {
    slug: 'apple-intelligence-rollout',
    layout: 'wide-right',
    title: 'Apple Intelligence Begins Global Rollout: What You Need to Know',
    excerpt:
      'Following months of beta testing, Apple is finally releasing its deeply integrated AI features to iOS 18 users worldwide, bringing local on-device processing to the masses.',
    timeLabel: '3 hours ago',
    timeInContent: true,
    authorName: 'David K.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Apple device ecosystem representing on-device AI',
    tag: { label: 'Consumer AI', icon: 'smartphone' },
    ctaLabel: 'Read Full Story',
    accent: 'indigo',
  },
  {
    slug: 'mistral-large-3',
    layout: 'stacked',
    title: 'Mistral Open-Sources Large 3 Model',
    excerpt:
      'The European AI champion drops its most powerful open-weight model yet, matching GPT-4 class performance on most benchmarks.',
    timeLabel: '5 hours ago',
    timeInContent: false,
    authorName: 'Sarah J.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
    imageUrl:
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Data center server racks',
    tag: { label: 'Open Source', icon: 'server' },
    ctaLabel: 'Read Story',
    accent: 'emerald',
  },
  {
    slug: 'eu-ai-act-updates',
    layout: 'stacked',
    title: 'EU AI Act Enters Final Implementation Phase',
    excerpt:
      'Companies face new compliance deadlines as the European Union finalizes technical standards for high-risk AI systems.',
    timeLabel: '8 hours ago',
    timeInContent: false,
    authorName: 'Marcus Dev',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp',
    imageAlt: 'European policy and regulation concept',
    tag: { label: 'Regulation', icon: 'scale' },
    ctaLabel: 'Read Story',
    accent: 'amber',
  },
  {
    slug: 'robotics-breakthrough',
    layout: 'wide-left',
    title: 'Figure 02 Demonstrates Autonomous Manufacturing Capabilities',
    excerpt:
      "In a massive leap for humanoid robotics, Figure's latest iteration successfully performed complex, multi-step automotive assembly tasks completely autonomously, powered by an end-to-end neural network.",
    timeLabel: '12 hours ago',
    timeInContent: true,
    authorName: 'Elena R.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Humanoid robot in a manufacturing environment',
    tag: { label: 'Robotics', icon: 'bot', tone: 'rose' },
    ctaLabel: 'Read Deep Dive',
    accent: 'rose',
  },
];

export const newsListPagination = {
  showingFrom: 1,
  showingTo: 6,
  total: 128,
  lastPage: 7,
} as const;

export const newsListBottomCopy = {
  newsletterTitle: 'The AI Daily Brief.',
  newsletterBody:
    'Join 50,000+ founders and engineers receiving the essential AI news every morning.',
  editorEyebrow: "Editor's Desk",
  editorBio:
    'Curating the most impactful breakthroughs in artificial intelligence, cutting through the hype to bring you the facts.',
} as const;
