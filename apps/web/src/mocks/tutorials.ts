import { authors, type Author } from './authors';
import { categories, type Category } from './categories';
import type { Article, ArticleBodyBlock, ArticleDetail } from './articles';

/** List page grid (design `tutorials-page.html`); detail pages use `Article` stubs. */
export type TutorialMasterclassDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type TutorialMasterclassAccent =
  | 'indigo'
  | 'emerald'
  | 'sky'
  | 'amber'
  | 'violet'
  | 'fuchsia';

export type TutorialMasterclassDotColor = TutorialMasterclassAccent;

export type TutorialMasterclassListItem = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  badgeLabel: string;
  /** Top-left category row */
  badgeIcon: 'play' | 'server' | 'fileCode' | 'cloud' | 'monitor' | 'sparkles';
  /** Top-right floating icon */
  floatingIcon: 'code' | 'cpu' | 'braces' | 'box' | 'globe' | 'gallery';
  durationLabel: string;
  difficulty: TutorialMasterclassDifficulty;
  /** Lit dots (1–3); remainder are muted. */
  activeDots: 1 | 2 | 3;
  dotColor: TutorialMasterclassDotColor;
  topicPills: string[];
  authorName: string;
  authorAvatarUrl: string;
  accent: TutorialMasterclassAccent;
};

export const tutorialsListPageHero = {
  badge: 'Synthetix Academy',
  title: 'Master Modern Tech.',
  description:
    'Curated deep dives, step-by-step masterclasses, and architectural teardowns designed for senior developers scaling next-gen applications.',
} as const;

const firstAuthor = authors[0];
if (!firstAuthor) {
  throw new Error('mocks/authors: need at least one author');
}
const marcus: Author = firstAuthor;
const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug) as Category;

/** HTML for design-matched Python highlighting (code panel); copy uses plain `RAG_CODE_TUTORIAL_PLAIN` */
const RAG_CODE_TUTORIAL_HTML = `<span class="text-indigo-400">from</span> langchain.text_splitter <span class="text-indigo-400">import</span> RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=<span class="text-emerald-400">1000</span>,
    chunk_overlap=<span class="text-emerald-400">200</span>,
    length_function=<span class="text-indigo-400">len</span>,
    separators=[<span class="text-amber-300">"\\n\\n"</span>, <span class="text-amber-300">"\\n"</span>, <span class="text-amber-300">" "</span>, <span class="text-amber-300">""</span>]
)

chunks = text_splitter.split_text(document_content)
<span class="text-zinc-500"># Analyze chunk distribution before embedding</span>
<span class="text-indigo-400">print</span>(<span class="text-amber-300">f"Generated {len(chunks)} semantic chunks."</span>)`;

/** Copy target: matches `RAG_CODE` in `mocks/articles.ts` */
const RAG_CODE_TUTORIAL_PLAIN = `from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\\n\\n", "\\n", " ", ""]
)

chunks = text_splitter.split_text(document_content)
# Analyze chunk distribution before embedding
print(f"Generated {len(chunks)} semantic chunks.")`;

const ragTutorialBlocks: ArticleBodyBlock[] = [
  {
    type: 'pInline',
    segments: [
      {
        t: 'text',
        v: 'Large Language Models (LLMs) are incredibly powerful, but they suffer from a fundamental limitation: their knowledge is frozen at the time of training. To build applications that can reason over proprietary or real-time data, we need ',
      },
      { t: 'strong', v: 'Retrieval-Augmented Generation (RAG)' },
      { t: 'text', v: '.' },
    ],
  },
  {
    type: 'p',
    text: "In this guide, we'll walk through the modern stack for building production-ready RAG pipelines, bypassing the common pitfalls developers face when moving from prototypes to scaled applications.",
  },
  {
    type: 'h2',
    id: 'core-architecture',
    text: '1. Core Architecture Overview',
  },
  {
    type: 'p',
    text: 'A typical RAG system consists of two primary pipelines working in tandem: the ingestion pipeline and the retrieval/generation pipeline. Understanding the separation of concerns here is vital for scalability.',
  },
  {
    type: 'ul',
    items: [
      {
        label: 'Ingestion:',
        description:
          'Document parsing, chunking, embedding generation, and vector indexing.',
      },
      {
        label: 'Retrieval:',
        description:
          'Query processing, semantic search, re-ranking, and context window assembly.',
      },
      {
        label: 'Generation:',
        description: 'Prompt formatting and LLM inference.',
      },
    ],
  },
  {
    type: 'blockquote',
    text: 'The quality of your RAG output is strictly bounded by the quality of your retrieval. An LLM cannot generate accurate answers from irrelevant context.',
    quoteStyle: 'gradient',
  },
  { type: 'inContentAd' },
  {
    type: 'h2',
    id: 'chunking-strategies',
    text: '2. Advanced Chunking Strategies',
  },
  {
    type: 'p',
    text: 'Naive fixed-size chunking (e.g., splitting every 500 characters) often destroys semantic boundaries. Instead, modern systems utilize semantic or document-aware chunking.',
  },
  { type: 'h3', text: 'Implementation with LangChain' },
  {
    type: 'p',
    text: "Here's how to implement a recursive character text splitter that respects natural paragraph boundaries before falling back to word boundaries.",
  },
  {
    type: 'code',
    language: 'python',
    code: RAG_CODE_TUTORIAL_HTML,
    plainText: RAG_CODE_TUTORIAL_PLAIN,
    displayVariant: 'editorial',
  },
  {
    type: 'h2',
    id: 'evaluating-retrieval',
    text: '3. Evaluating Retrieval Performance',
  },
  {
    type: 'p',
    text: "Don't guess if your RAG pipeline is working. Use frameworks like Ragas or TruLens to quantify performance across three metrics:",
  },
  {
    type: 'ol',
    items: [
      {
        label: 'Context Precision:',
        description: 'Is the retrieved context relevant to the query?',
      },
      {
        label: 'Context Recall:',
        description:
          'Did we retrieve all the necessary information to answer the query?',
      },
      {
        label: 'Faithfulness:',
        description:
          "Is the LLM's answer directly derived from the provided context (avoiding hallucination)?",
      },
    ],
  },
  {
    type: 'p',
    text: "By setting up automated evaluation pipelines during CI/CD, you can confidently swap out embedding models (like moving from OpenAI's `text-embedding-ada-002` to `text-embedding-3-small`) and measure the exact impact on your application's accuracy.",
  },
];

const ragTutorialDetail: ArticleDetail = {
  breadcrumb: {
    parentHref: '/tutorials',
    parentLabel: 'Tutorials',
  },
  breadcrumbCurrentLabel: 'Building RAG Applications',
  subhead:
    'A comprehensive tutorial on architecting Retrieval-Augmented Generation pipelines. Learn how to optimize chunking strategies, select the right embedding models, and evaluate vector database performance.',
  featuredImageCaption:
    'Visualizing the data retrieval and embedding generation process in a modern LLM architecture.',
  leadParagraph: '',
  categoryPillLabel: 'Tutorial',
  showCategoryNewspaperIcon: false,
  categoryPillIcon: 'bookOpen',
  relatedPath: 'tutorials',
  toc: [
    { id: 'core-architecture', title: 'Core Architecture Overview' },
    { id: 'chunking-strategies', title: 'Advanced Chunking Strategies' },
    {
      id: 'evaluating-retrieval',
      title: 'Evaluating Retrieval Performance',
    },
  ],
  blocks: ragTutorialBlocks,
  topicTags: [
    { label: 'Python' },
    { label: 'LLMs' },
    { label: 'Vector Databases' },
    { label: 'Architecture' },
  ],
  related: {
    previous: {
      slug: 'understanding-embeddings',
      title: 'Understanding Embeddings: The Math Behind the Magic',
    },
    next: {
      slug: 'top-5-open-source-vector-databases',
      title: 'Top 5 Open-Source Vector Databases Evaluated',
    },
  },
};

const tutorialCompleteGuide: Article = {
  id: 'tut-1',
  slug: 'complete-guide-to-rag',
  title: 'The Definitive Guide to Building RAG Applications in 2025',
  excerpt:
    'A comprehensive tutorial on architecting Retrieval-Augmented Generation pipelines. Learn how to optimize chunking strategies, select the right embedding models, and evaluate vector database performance.',
  publishedAt: 'Oct 24, 2025',
  readTimeMin: 12,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  featuredImageAlt: 'Abstract data flow representing RAG architecture',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'cornerstone',
  detail: ragTutorialDetail,
};

const understandingEmbeddings: Article = {
  id: 'tut-2',
  slug: 'understanding-embeddings',
  title: 'Understanding Embeddings: The Math Behind the Magic',
  excerpt:
    'A compact walkthrough of vector space intuition, model tradeoffs, and when embeddings are the right abstraction.',
  publishedAt: 'Oct 20, 2025',
  readTimeMin: 5,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: {
    breadcrumb: {
      parentHref: '/tutorials',
      parentLabel: 'Tutorials',
    },
    breadcrumbCurrentLabel: 'Understanding Embeddings',
    subhead:
      'A compact look at what embeddings are, how they sit in a vector space, and how that shapes retrieval quality for RAG.',
    featuredImageCaption:
      'Venn diagram style metaphor: documents as points, queries as search rays.',
    leadParagraph: '',
    categoryPillLabel: 'Tutorial',
    categoryPillIcon: 'bookOpen',
    relatedPath: 'tutorials',
    toc: [{ id: 'intro', title: 'What are embeddings' }],
    blocks: [
      {
        type: 'p',
        text: 'This placeholder keeps navigation between tutorials working while a full long-form version is in the backlog. Skim the core RAG guide for a production walkthrough in the same stack.',
      },
    ],
    topicTags: [{ label: 'Embeddings' }, { label: 'NLP' }],
    related: {
      previous: null,
      next: {
        slug: 'complete-guide-to-rag',
        title: tutorialCompleteGuide.title,
      },
    },
  },
};

const top5Vector: Article = {
  id: 'tut-3',
  slug: 'top-5-open-source-vector-databases',
  title: 'Top 5 Open-Source Vector Databases Evaluated',
  excerpt:
    'A scorecard of open projects on latency, ops, and how they line up for typical RAG scale.',
  publishedAt: 'Oct 18, 2025',
  readTimeMin: 6,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1555949963-ff9fe0c87eb2?auto=format&fit=crop&q=80&w=1200',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: {
    breadcrumb: {
      parentHref: '/tutorials',
      parentLabel: 'Tutorials',
    },
    breadcrumbCurrentLabel: 'Vector DBs Evaluated',
    subhead:
      'A placeholder overview until the full deep-dive lands; use it to exercise prev/next in the RAG series.',
    featuredImageCaption:
      'A neutral backdrop for a scorecard of vector stores.',
    leadParagraph: '',
    categoryPillLabel: 'Tutorial',
    categoryPillIcon: 'bookOpen',
    relatedPath: 'tutorials',
    toc: [{ id: 'overview', title: 'Overview' }],
    blocks: [
      {
        type: 'p',
        text: 'The full write-up is coming soon. In the meantime, the Definitive RAG guide covers what matters when wiring retrieval into production: chunking, embeddings, and eval loops.',
      },
    ],
    topicTags: [{ label: 'Vector DB' }, { label: 'RAG' }],
    related: {
      previous: {
        slug: 'complete-guide-to-rag',
        title: tutorialCompleteGuide.title,
      },
      next: null,
    },
  },
};

/** Cornerstone row on list page: 2026 title + copy per design (detail article title may differ). */
export const tutorialListFeatured = {
  slug: 'complete-guide-to-rag' as const,
  badgeLabel: 'Cornerstone Masterclass',
  listTitle: 'The Definitive Guide to Building RAG Applications in 2026',
  listSubhead:
    'A comprehensive tutorial on architecting Retrieval-Augmented Generation pipelines. Learn how to optimize chunking strategies, select the right embedding models, and seamlessly evaluate vector databases in production.',
  readTimeLabel: '12 min read',
  authorName: marcus.name,
  authorRole: 'Lead Educator',
  authorAvatarUrl: marcus.avatarUrl,
  imageUrl: tutorialCompleteGuide.featuredImageUrl,
  imageAlt: 'RAG Architecture',
} as const;

export type TutorialListFeatured = typeof tutorialListFeatured;

function makeGridTutorialDetail(title: string, subhead: string): ArticleDetail {
  return {
    breadcrumb: {
      parentHref: '/tutorials',
      parentLabel: 'Tutorials',
    },
    breadcrumbCurrentLabel: title,
    subhead,
    featuredImageCaption: title,
    leadParagraph: '',
    categoryPillLabel: 'Tutorial',
    categoryPillIcon: 'bookOpen',
    relatedPath: 'tutorials',
    toc: [{ id: 'intro', title: 'Overview' }],
    blocks: [
      {
        type: 'p',
        text: 'Full content for this masterclass is coming soon.',
      },
    ],
    topicTags: [],
    related: { previous: null, next: null },
  };
}

const tutorialReactServerComponents: Article = {
  id: 'tut-4',
  slug: 'react-server-components',
  title: 'Mastering React Server Components',
  excerpt:
    'A complete guide to data fetching, suspense boundaries, and streaming architecture in Next.js 15.',
  publishedAt: 'Jan 6, 2026',
  readTimeMin: 8,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
  featuredImageAlt: 'React Code',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'Mastering React Server Components',
    'A complete guide to data fetching, suspense boundaries, and streaming architecture in Next.js 15.',
  ),
};

const tutorialLocalLlmsOllama: Article = {
  id: 'tut-5',
  slug: 'local-llms-ollama',
  title: 'Deploying Local LLMs with Ollama',
  excerpt:
    'Step-by-step instructions for running Llama 3 locally and integrating it into your Node.js backend seamlessly.',
  publishedAt: 'Jan 5, 2026',
  readTimeMin: 10,
  featuredImageUrl:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
  featuredImageAlt: 'Server Infrastructure',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'Deploying Local LLMs with Ollama',
    'Step-by-step instructions for running Llama 3 locally and integrating it into your Node.js backend seamlessly.',
  ),
};

const tutorialAdvancedTypeScript: Article = {
  id: 'tut-6',
  slug: 'advanced-typescript',
  title: 'Advanced TypeScript Patterns',
  excerpt:
    'Elevate your codebase with advanced generics, utility types, and strict error handling strategies for large-scale apps.',
  publishedAt: 'Jan 4, 2026',
  readTimeMin: 7,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
  featuredImageAlt: 'TypeScript Code',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'Advanced TypeScript Patterns',
    'Elevate your codebase with advanced generics, utility types, and strict error handling strategies for large-scale apps.',
  ),
};

const tutorialDockerNode: Article = {
  id: 'tut-7',
  slug: 'docker-node-microservices',
  title: 'Dockerizing Node.js Microservices',
  excerpt:
    'Learn the best practices for containerizing scalable Node.js microservices with multi-stage builds and Docker Compose.',
  publishedAt: 'Jan 3, 2026',
  readTimeMin: 9,
  featuredImageUrl:
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=1200',
  featuredImageAlt: 'Docker Containers',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'Dockerizing Node.js Microservices',
    'Learn the best practices for containerizing scalable Node.js microservices with multi-stage builds and Docker Compose.',
  ),
};

const tutorialFullstackTrpc: Article = {
  id: 'tut-8',
  slug: 'fullstack-nextjs-trpc',
  title: 'End-to-End Type Safety with tRPC',
  excerpt:
    'Build a robust fullstack application where your database models, API, and frontend share the exact same types.',
  publishedAt: 'Jan 2, 2026',
  readTimeMin: 11,
  featuredImageUrl:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp',
  featuredImageAlt: 'Web Development',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'End-to-End Type Safety with tRPC',
    'Build a robust fullstack application where your database models, API, and frontend share the exact same types.',
  ),
};

const tutorialFramerMotion: Article = {
  id: 'tut-9',
  slug: 'framer-motion-mastery',
  title: 'Mastering Framer Motion UI',
  excerpt:
    'Create silky smooth layout animations, sophisticated drag interactions, and scroll-linked effects in React.',
  publishedAt: 'Jan 1, 2026',
  readTimeMin: 6,
  featuredImageUrl:
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
  featuredImageAlt: 'Abstract 3D Design',
  author: marcus,
  category: getCategory('guides-tutorials'),
  variant: 'standard',
  detail: makeGridTutorialDetail(
    'Mastering Framer Motion UI',
    'Create silky smooth layout animations, sophisticated drag interactions, and scroll-linked effects in React.',
  ),
};

/** Grid on `/tutorials` (order matches design HTML). */
export const tutorialMasterclassList: TutorialMasterclassListItem[] = [
  {
    slug: 'react-server-components',
    title: 'Mastering React Server Components',
    excerpt:
      'A complete guide to data fetching, suspense boundaries, and streaming architecture in Next.js 15.',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'React Code',
    badgeLabel: 'Walkthrough',
    badgeIcon: 'play',
    floatingIcon: 'code',
    durationLabel: '45:20',
    difficulty: 'intermediate',
    activeDots: 2,
    dotColor: 'indigo',
    topicPills: ['React 19', 'Next.js', 'Suspense'],
    authorName: 'Elena R.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    accent: 'indigo',
  },
  {
    slug: 'local-llms-ollama',
    title: 'Deploying Local LLMs with Ollama',
    excerpt:
      'Step-by-step instructions for running Llama 3 locally and integrating it into your Node.js backend seamlessly.',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    imageAlt: 'Server Infrastructure',
    badgeLabel: 'Architecture',
    badgeIcon: 'server',
    floatingIcon: 'cpu',
    durationLabel: '1:15:00',
    difficulty: 'advanced',
    activeDots: 3,
    dotColor: 'emerald',
    topicPills: ['Node.js', 'Llama 3', 'Ollama'],
    authorName: 'David K.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
    accent: 'emerald',
  },
  {
    slug: 'advanced-typescript',
    title: 'Advanced TypeScript Patterns',
    excerpt:
      'Elevate your codebase with advanced generics, utility types, and strict error handling strategies for large-scale apps.',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'TypeScript Code',
    badgeLabel: 'Development',
    badgeIcon: 'fileCode',
    floatingIcon: 'braces',
    durationLabel: '55:00',
    difficulty: 'advanced',
    activeDots: 3,
    dotColor: 'sky',
    topicPills: ['Generics', 'Utility Types', 'Architecture'],
    authorName: 'Marcus Dev',
    authorAvatarUrl: marcus.avatarUrl,
    accent: 'sky',
  },
  {
    slug: 'docker-node-microservices',
    title: 'Dockerizing Node.js Microservices',
    excerpt:
      'Learn the best practices for containerizing scalable Node.js microservices with multi-stage builds and Docker Compose.',
    imageUrl:
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=600',
    imageAlt: 'Docker Containers',
    badgeLabel: 'DevOps',
    badgeIcon: 'cloud',
    floatingIcon: 'box',
    durationLabel: '1:30:00',
    difficulty: 'intermediate',
    activeDots: 2,
    dotColor: 'amber',
    topicPills: ['Docker', 'Microservices', 'Node.js'],
    authorName: 'Sarah J.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg',
    accent: 'amber',
  },
  {
    slug: 'fullstack-nextjs-trpc',
    title: 'End-to-End Type Safety with tRPC',
    excerpt:
      'Build a robust fullstack application where your database models, API, and frontend share the exact same types.',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp',
    imageAlt: 'Web Development',
    badgeLabel: 'Fullstack',
    badgeIcon: 'monitor',
    floatingIcon: 'globe',
    durationLabel: '2:40:00',
    difficulty: 'intermediate',
    activeDots: 2,
    dotColor: 'violet',
    topicPills: ['Next.js', 'tRPC', 'Prisma'],
    authorName: 'David K.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
    accent: 'violet',
  },
  {
    slug: 'framer-motion-mastery',
    title: 'Mastering Framer Motion UI',
    excerpt:
      'Create silky smooth layout animations, sophisticated drag interactions, and scroll-linked effects in React.',
    imageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg',
    imageAlt: 'Abstract 3D Design',
    badgeLabel: 'UI / UX',
    badgeIcon: 'sparkles',
    floatingIcon: 'gallery',
    durationLabel: '32:15',
    difficulty: 'beginner',
    activeDots: 1,
    dotColor: 'fuchsia',
    topicPills: ['Animation', 'React', 'Framer'],
    authorName: 'Mia W.',
    authorAvatarUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg',
    accent: 'fuchsia',
  },
];

export const tutorialsListPagination = {
  showingFrom: 1,
  showingTo: 6,
  total: 42,
  currentPage: 1,
  lastPage: 7,
} as const;

export const tutorials: Article[] = [
  tutorialCompleteGuide,
  understandingEmbeddings,
  top5Vector,
  tutorialReactServerComponents,
  tutorialLocalLlmsOllama,
  tutorialAdvancedTypeScript,
  tutorialDockerNode,
  tutorialFullstackTrpc,
  tutorialFramerMotion,
];

export function getTutorialBySlug(slug: string): Article | undefined {
  return tutorials.find((t) => t.slug === slug);
}
