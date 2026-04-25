import { authors, type Author } from './authors';
import { categories, type Category } from './categories';

export type ArticleTocItem = {
  id: string;
  title: string;
};

export type ArticleTopicTag = {
  label: string;
  href?: string;
};

export type ArticleRelatedNav = {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

/** Inline paragraph segment: plain text or bold */
export type ArticleInlineSeg = { t: 'text' | 'strong'; v: string };

export type ArticleBodyBlock =
  | { type: 'lead'; text: string }
  | { type: 'p'; text: string }
  | { type: 'pInline'; segments: ArticleInlineSeg[] }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | {
      type: 'ul';
      items: { label: string; description: string }[];
    }
  | {
      type: 'ol';
      items: { label: string; description: string }[];
    }
  | {
      type: 'blockquote';
      text: string;
      attribution?: string;
      /** When no `attribution`: inset (default) vs gradient callout (tutorial design) */
      quoteStyle?: 'inset' | 'gradient';
    }
  | { type: 'inContentAd' }
  | { type: 'stats'; items: { value: string; label: string }[] }
  | {
      type: 'code';
      language: string;
      code: string;
      /** Clipboard text when `code` is HTML; defaults to `code` */
      plainText?: string;
      displayVariant?: 'default' | 'editorial';
    };

export type ArticleDetail = {
  /** e.g. Home / News / … */
  breadcrumb: { parentHref: string; parentLabel: string };
  /** Shown in hero under title */
  subhead: string;
  featuredImageCaption: string;
  leadParagraph: string;
  /** Optional: shown in category pill; defaults to article.category.name */
  categoryPillLabel?: string;
  /** When true, hero uses Newspaper icon in the pill (design: Tech News) */
  showCategoryNewspaperIcon?: boolean;
  toc: ArticleTocItem[];
  blocks: ArticleBodyBlock[];
  topicTags: ArticleTopicTag[];
  related: ArticleRelatedNav;
  /** E-E-A-T author box (article page) */
  authorRoleInArticle?: string;
  authorBioInArticle?: string;
  /** Breadcrumb last segment; defaults to truncated `title` */
  breadcrumbCurrentLabel?: string;
  /** When set, overrides `showCategoryNewspaperIcon` for hero pill */
  categoryPillIcon?: 'book' | 'bookOpen' | 'newspaper';
  /** Base path for related prev/next links (default: articles) */
  relatedPath?: 'articles' | 'tutorials' | 'news';
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  readTimeMin: number;
  featuredImageUrl: string;
  /** Featured image `alt` (defaults to `title` in the detail view) */
  featuredImageAlt?: string;
  author: Author;
  category: Category;
  variant: 'cornerstone' | 'standard';
  /** Present for every article that resolves on `/articles/[slug]` */
  detail: ArticleDetail;
};

const firstAuthor = authors[0];
if (!firstAuthor) {
  throw new Error('mocks/authors: need at least one author');
}
const marcus: Author = firstAuthor;
const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug) as Category;

const RAG_CODE = `from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\\n\\n", "\\n", " ", ""]
)

chunks = text_splitter.split_text(document_content)
# Analyze chunk distribution before embedding
print(f"Generated {len(chunks)} semantic chunks.")`;

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
    detail: {
      breadcrumb: {
        parentHref: '/articles',
        parentLabel: 'Guides & Tutorials',
      },
      subhead:
        'A comprehensive walkthrough to architecting production-ready retrieval pipelines — from document ingestion to evaluation — using modern embedding models and vector databases.',
      featuredImageCaption:
        'Visualizing the data retrieval and embedding generation process in a modern LLM architecture.',
      leadParagraph: '',
      toc: [
        { id: 'core-architecture', title: 'Core Architecture Overview' },
        { id: 'chunking-strategies', title: 'Advanced Chunking Strategies' },
        {
          id: 'evaluating-retrieval',
          title: 'Evaluating Retrieval Performance',
        },
      ],
      blocks: [
        {
          type: 'p',
          text: 'Large Language Models (LLMs) are incredibly powerful, but they suffer from a fundamental limitation: their knowledge is frozen at the time of training. To build applications that can reason over proprietary or real-time data, we need Retrieval-Augmented Generation (RAG).',
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
        { type: 'code', language: 'python', code: RAG_CODE },
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
      ],
      topicTags: [
        { label: 'RAG' },
        { label: 'LangChain' },
        { label: 'Vector DB' },
        { label: 'LLM' },
        { label: 'Python' },
      ],
      related: {
        previous: {
          slug: 'zapier-alternatives',
          title: '5 Open-Source Alternatives to Zapier',
        },
        next: {
          slug: 'cursor-vs-copilot',
          title:
            'Cursor vs GitHub Copilot: Which is the Better AI Coding Assistant?',
        },
      },
    },
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
    detail: {
      breadcrumb: {
        parentHref: '/articles',
        parentLabel: 'AI Tools & Reviews',
      },
      subhead:
        'A practical comparison of two leading coding assistants, focused on what matters for day-to-day shipping: latency, project awareness, and refactor quality.',
      featuredImageCaption:
        'Comparing how different assistants surface suggestions in a typical full-stack TypeScript project.',
      leadParagraph: '',
      toc: [
        { id: 'autocomplete', title: 'Autocomplete quality' },
        { id: 'codebase', title: 'Codebase context' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'Choosing an AI pair programmer is as much about workflow fit as it is about raw model strength.',
        },
        {
          type: 'p',
          text: 'This review distills a month of daily use on real repositories: Next.js monorepos, small libraries, and legacy JavaScript you did not ask for.',
        },
        { type: 'h2', id: 'autocomplete', text: '1. Autocomplete quality' },
        {
          type: 'p',
          text: 'We measured how often a suggestion was accepted as-is, how often it required edits, and how many keystrokes it saved versus vanilla typing.',
        },
        { type: 'h2', id: 'codebase', text: '2. Codebase context' },
        {
          type: 'p',
          text: 'Larger codebases stress retrieval and file awareness. The winner here is the tool that keeps symbols consistent across refactors and imports.',
        },
        { type: 'inContentAd' },
        {
          type: 'p',
          text: 'We will cover pricing, team policies, and where each tool still feels rough around the edges in a follow-up piece.',
        },
      ],
      topicTags: [
        { label: 'Cursor' },
        { label: 'GitHub Copilot' },
        { label: 'Productivity' },
      ],
      related: {
        previous: {
          slug: 'complete-guide-to-rag',
          title: 'The Definitive Guide to Building RAG Applications in 2025',
        },
        next: {
          slug: 'nextjs-15-features',
          title: 'Optimizing Core Web Vitals in Next.js 15',
        },
      },
    },
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
    detail: {
      breadcrumb: {
        parentHref: '/articles',
        parentLabel: 'Development & Coding',
      },
      subhead:
        'A focused playbook for LCP, CLS, and INP: caching boundaries, image discipline, and font loading in App Router–first apps.',
      featuredImageCaption:
        'Lighthouse and field data agree: the biggest wins are usually images, fonts, and long tasks on the main thread.',
      leadParagraph: '',
      toc: [
        { id: 'lcp', title: 'LCP breakdown' },
        { id: 'cls', title: 'Eliminating layout shift' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'Core Web Vitals are not a buzzword if your business depends on conversion and SEO.',
        },
        { type: 'h2', id: 'lcp', text: '1. LCP' },
        {
          type: 'p',
          text: 'Start with the largest above-the-fold image. Prefer explicit width and height, modern formats, and a sane priority hint for the hero only.',
        },
        { type: 'h2', id: 'cls', text: '2. CLS' },
        {
          type: 'p',
          text: 'Reserve space for embeds, avoid injecting banners above content without layout space, and audit web fonts for FOIT and swap behavior.',
        },
        { type: 'inContentAd' },
        {
          type: 'p',
          text: 'Next step: connect RUM in production so you optimize what users actually experience, not just the lab score.',
        },
      ],
      topicTags: [
        { label: 'Next.js' },
        { label: 'Performance' },
        { label: 'CWV' },
      ],
      related: {
        previous: {
          slug: 'cursor-vs-copilot',
          title:
            'Cursor vs GitHub Copilot: Which is the Better AI Coding Assistant?',
        },
        next: {
          slug: 'zapier-alternatives',
          title: '5 Open-Source Alternatives to Zapier for Local Workflows',
        },
      },
    },
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
    detail: {
      breadcrumb: {
        parentHref: '/articles',
        parentLabel: 'Productivity & Automation',
      },
      subhead:
        'Self-hosting workflow automation is easier than it used to be. Here is a short list of tools we would actually run in production today.',
      featuredImageCaption:
        'A local automation stack can keep PII in your network and cut variable costs on high-volume runs.',
      leadParagraph: '',
      toc: [
        { id: 'n8n', title: 'n8n' },
        { id: 'ops', title: 'Operations reality' },
      ],
      blocks: [
        {
          type: 'p',
          text: 'Zapier is a great on-ramp. The bill grows quickly when you fan out to dozens of small tasks. Open-source options trade hosted convenience for control.',
        },
        { type: 'h2', id: 'n8n', text: '1. n8n' },
        {
          type: 'p',
          text: 'Visual flow editor, fair licensing for self-hosting, and a large template library. Expect to run your own worker tier for reliability.',
        },
        { type: 'h2', id: 'ops', text: '2. Operations reality' },
        {
          type: 'p',
          text: 'Back up credentials, log executions, and cap concurrency so a bad loop does not take down a database. Treat workflows like deployable code.',
        },
        { type: 'inContentAd' },
      ],
      topicTags: [
        { label: 'Automation' },
        { label: 'n8n' },
        { label: 'Self-host' },
      ],
      related: {
        previous: {
          slug: 'nextjs-15-features',
          title: 'Optimizing Core Web Vitals in Next.js 15',
        },
        next: {
          slug: 'complete-guide-to-rag',
          title: 'The Definitive Guide to Building RAG Applications in 2025',
        },
      },
    },
  },
  {
    id: '5',
    slug: 'anthropic-claude-4',
    title: 'Anthropic Unveils Claude 4: A Paradigm Shift in Enterprise AI',
    excerpt:
      'The latest release from Anthropic promises a dramatic leap in reasoning capabilities, deeply integrating with existing enterprise workflows and setting a new benchmark for autonomous AI agents.',
    publishedAt: 'Nov 12, 2025',
    readTimeMin: 5,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'standard',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        'The latest release from Anthropic promises a dramatic leap in reasoning capabilities, deeply integrating with existing enterprise workflows and setting a new benchmark for autonomous AI agents.',
      featuredImageCaption:
        'The new Claude 4 architecture operates across globally distributed data centers, ensuring unprecedented low-latency inference.',
      leadParagraph: '',
      categoryPillLabel: 'Tech News',
      showCategoryNewspaperIcon: true,
      toc: [
        { id: 'reasoning-leap', title: 'The Leap in Reasoning Capabilities' },
        {
          id: 'enterprise-integration',
          title: 'Enterprise Integration at Scale',
        },
        {
          id: 'market-impact',
          title: 'Market Impact & Competitor Response',
        },
      ],
      authorRoleInArticle: 'Senior Tech Correspondent',
      authorBioInArticle:
        'Marcus has spent the last 5 years covering artificial intelligence and enterprise technology. He regularly interviews industry leaders and breaks news on the latest AI advancements.',
      blocks: [
        {
          type: 'lead',
          text: 'In a move that caught many industry analysts by surprise, Anthropic has officially unveiled Claude 4, a next-generation foundational model designed from the ground up for enterprise autonomy and advanced reasoning.',
        },
        {
          type: 'p',
          text: 'Following months of speculation, the highly anticipated announcement was made Tuesday morning. The new model represents a significant departure from iterative updates, introducing what the company calls "Dynamic Contextual Reasoning"—a novel architecture that allows the AI to autonomously fetch, verify, and synthesize information across thousands of corporate documents in real-time.',
        },
        {
          type: 'h2',
          id: 'reasoning-leap',
          text: '1. The Leap in Reasoning Capabilities',
        },
        {
          type: 'pInline',
          segments: [
            {
              t: 'text',
              v: "Unlike its predecessor, Claude 4 isn't just about parameter size. Benchmark tests released by Anthropic show a staggering ",
            },
            { t: 'strong', v: '45% improvement' },
            {
              t: 'text',
              v: ' on complex multi-step reasoning tasks (such as the SWE-bench and MATH datasets).',
            },
          ],
        },
        {
          type: 'p',
          text: 'Early beta testers report that the model is significantly less prone to hallucinations when dealing with highly technical or proprietary datasets, a notorious pain point for enterprise adoption.',
        },
        {
          type: 'blockquote',
          text: 'We are no longer building chatbots. With Claude 4, we are deploying digital cognitive workers capable of operating alongside human teams with full context of the business.',
          attribution: 'Dario Amodei, CEO of Anthropic',
        },
        { type: 'inContentAd' },
        {
          type: 'h2',
          id: 'enterprise-integration',
          text: '2. Enterprise Integration at Scale',
        },
        {
          type: 'p',
          text: 'Perhaps the most compelling feature of the new release is its out-of-the-box integration ecosystem. Rather than requiring developers to build complex middleware, Claude 4 features native connectors for AWS, Salesforce, GitHub, and major ERP systems.',
        },
        {
          type: 'stats',
          items: [
            { value: '200K', label: 'Context Window' },
            { value: '3.5x', label: 'Faster Inference' },
            { value: '$15/M', label: 'Input Tokens' },
          ],
        },
        {
          type: 'h2',
          id: 'market-impact',
          text: '3. Market Impact & Competitor Response',
        },
        {
          type: 'p',
          text: 'The launch places immediate pressure on competitors. While OpenAI continues to dominate consumer mindshare with ChatGPT, Anthropic is aggressively courting the Fortune 500.',
        },
        {
          type: 'p',
          text: "Financial analysts predict this move could shift the balance of power in enterprise AI deployments. As companies move beyond pilot programs and look for concrete ROI, models that offer reliability, privacy guarantees, and native workflow integrations are positioned to win the lion's share of enterprise budgets.",
        },
      ],
      topicTags: [
        { label: 'AI Models' },
        { label: 'Enterprise' },
        { label: 'Anthropic' },
        { label: 'Industry News' },
      ],
      related: {
        previous: {
          slug: 'cursor-vs-copilot',
          title: 'OpenAI Responds with Surprising Price Cuts Across API Tiers',
        },
        next: {
          slug: 'nextjs-15-features',
          title:
            "Google's Gemini Integration: What Enterprise Users Need to Know",
        },
      },
    },
  },
  {
    id: '6',
    slug: 'openai-gpt-5-announcement',
    title: 'OpenAI Unveils GPT-5: A New Era of Reasoning',
    excerpt:
      'The next-generation model introduces unprecedented logical reasoning, real-time multimodal processing, and a reinforced alignment protocol that sets a new industry benchmark.',
    publishedAt: 'Apr 24, 2026',
    readTimeMin: 7,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    featuredImageAlt: 'Abstract representation of a neural network',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'cornerstone',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        'The next-generation model introduces unprecedented logical reasoning capabilities, real-time multimodal processing, and a heavily reinforced alignment protocol that sets a new industry standard.',
      featuredImageCaption:
        'OpenAI’s latest flagship emphasizes long-horizon reasoning and safer refusal behavior in production settings.',
      leadParagraph: '',
      categoryPillLabel: 'Tech News',
      showCategoryNewspaperIcon: true,
      relatedPath: 'news',
      toc: [
        { id: 'overview', title: 'What changed' },
        { id: 'takeaways', title: 'What to watch' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'OpenAI’s GPT-5 announcement focuses on reliable reasoning, tighter alignment, and multimodal throughput suitable for production assistants.',
        },
        {
          type: 'h2',
          id: 'overview',
          text: '1. What changed',
        },
        {
          type: 'p',
          text: 'The release highlights stronger chain-of-thought style answers, better tool use, and improved latency for vision plus text bundles—details will firm up as the API and policy docs stabilize.',
        },
        {
          type: 'h2',
          id: 'takeaways',
          text: '2. What to watch',
        },
        {
          type: 'p',
          text: 'Enterprises should validate safety policies, log retention, and data residency requirements before wide rollout, especially for customer-facing automations.',
        },
      ],
      topicTags: [
        { label: 'OpenAI' },
        { label: 'Foundation models' },
        { label: 'Industry News' },
      ],
      related: {
        previous: null,
        next: {
          slug: 'apple-intelligence-rollout',
          title:
            'Apple Intelligence Begins Global Rollout: What You Need to Know',
        },
      },
    },
  },
  {
    id: '7',
    slug: 'apple-intelligence-rollout',
    title: 'Apple Intelligence Begins Global Rollout: What You Need to Know',
    excerpt:
      'Following months of beta testing, Apple is finally releasing its deeply integrated AI features to iOS 18 users worldwide, bringing local on-device processing to the masses.',
    publishedAt: 'Apr 24, 2026',
    readTimeMin: 6,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'standard',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        'Following months of beta testing, Apple is finally releasing its deeply integrated AI features to iOS 18 users worldwide, bringing local on-device processing to the masses.',
      featuredImageCaption:
        'On-device models aim to keep sensitive prompts and media processing closer to the user’s hardware.',
      leadParagraph: '',
      showCategoryNewspaperIcon: true,
      relatedPath: 'news',
      toc: [
        { id: 'rollout', title: 'Rollout scope' },
        { id: 'privacy', title: 'Privacy posture' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'Apple is expanding its AI feature set to more regions with an emphasis on on-device processing and system-level integrations.',
        },
        { type: 'h2', id: 'rollout', text: '1. Rollout scope' },
        {
          type: 'p',
          text: 'Expect staged availability by region, device, and language pack. Verify feature flags in Settings before publishing guides that assume uniform behavior.',
        },
        { type: 'h2', id: 'privacy', text: '2. Privacy posture' },
        {
          type: 'p',
          text: 'Private Cloud Compute and on-device models remain central to Apple’s story—treat any third-party data flows as a separate review step.',
        },
      ],
      topicTags: [
        { label: 'Apple' },
        { label: 'On-device AI' },
        { label: 'Consumer' },
      ],
      related: {
        previous: {
          slug: 'openai-gpt-5-announcement',
          title: 'OpenAI Unveils GPT-5: A New Era of Reasoning',
        },
        next: {
          slug: 'mistral-large-3',
          title: 'Mistral Open-Sources Large 3 Model',
        },
      },
    },
  },
  {
    id: '8',
    slug: 'mistral-large-3',
    title: 'Mistral Open-Sources Large 3 Model',
    excerpt:
      'The European AI champion drops its most powerful open-weight model yet, matching GPT-4 class performance on most benchmarks.',
    publishedAt: 'Apr 24, 2026',
    readTimeMin: 5,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'standard',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        'The European AI champion drops its most powerful open-weight model yet, matching GPT-4 class performance on most benchmarks.',
      featuredImageCaption:
        'Open-weight models continue to close the gap on closed API leaders for many retrieval and coding tasks.',
      leadParagraph: '',
      showCategoryNewspaperIcon: true,
      relatedPath: 'news',
      toc: [
        { id: 'license', title: 'Licensing' },
        { id: 'adoption', title: 'Adoption notes' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'A new open-weights release from Mistral targets production deployments that need self-hosting and verifiable supply chains.',
        },
        { type: 'h2', id: 'license', text: '1. Licensing' },
        {
          type: 'p',
          text: 'Confirm the exact license and acceptable use for your org before you fork fine-tunes or redistribute weights internally.',
        },
        { type: 'h2', id: 'adoption', text: '2. Adoption notes' },
        {
          type: 'p',
          text: 'You will still need an inference stack, evaluation harness, and update policy that matches your security requirements.',
        },
      ],
      topicTags: [
        { label: 'Mistral' },
        { label: 'Open source' },
        { label: 'EU' },
      ],
      related: {
        previous: {
          slug: 'apple-intelligence-rollout',
          title:
            'Apple Intelligence Begins Global Rollout: What You Need to Know',
        },
        next: {
          slug: 'eu-ai-act-updates',
          title: 'EU AI Act Enters Final Implementation Phase',
        },
      },
    },
  },
  {
    id: '9',
    slug: 'eu-ai-act-updates',
    title: 'EU AI Act Enters Final Implementation Phase',
    excerpt:
      'Companies face new compliance deadlines as the European Union finalizes technical standards for high-risk AI systems.',
    publishedAt: 'Apr 24, 2026',
    readTimeMin: 6,
    featuredImageUrl:
      'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'standard',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        'Companies face new compliance deadlines as the European Union finalizes technical standards for high-risk AI systems.',
      featuredImageCaption:
        'Regulatory text is only part of the story; harmonized standards and market surveillance will shape day-to-day obligations.',
      leadParagraph: '',
      showCategoryNewspaperIcon: true,
      relatedPath: 'news',
      toc: [
        { id: 'timeline', title: 'Timelines' },
        { id: 'risk', title: 'High-risk systems' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'EU AI Act implementation is converging on concrete deadlines for high-risk use cases, documentation, and post-market monitoring.',
        },
        { type: 'h2', id: 'timeline', text: '1. Timelines' },
        {
          type: 'p',
          text: 'Check official texts and your legal counsel for the exact effective dates and sector-specific requirements that apply to you.',
        },
        { type: 'h2', id: 'risk', text: '2. High-risk systems' },
        {
          type: 'p',
          text: 'If your system is classified as high risk, start mapping data lineage, model validation evidence, and human oversight workflows now.',
        },
      ],
      topicTags: [
        { label: 'Policy' },
        { label: 'EU' },
        { label: 'Compliance' },
      ],
      related: {
        previous: {
          slug: 'mistral-large-3',
          title: 'Mistral Open-Sources Large 3 Model',
        },
        next: {
          slug: 'robotics-breakthrough',
          title: 'Figure 02 Demonstrates Autonomous Manufacturing Capabilities',
        },
      },
    },
  },
  {
    id: '10',
    slug: 'robotics-breakthrough',
    title: 'Figure 02 Demonstrates Autonomous Manufacturing Capabilities',
    excerpt:
      "In a massive leap for humanoid robotics, Figure's latest iteration successfully performed complex, multi-step automotive assembly tasks autonomously.",
    publishedAt: 'Apr 24, 2026',
    readTimeMin: 8,
    featuredImageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    author: marcus,
    category: getCategory('tech-news-trends'),
    variant: 'standard',
    detail: {
      breadcrumb: { parentHref: '/news', parentLabel: 'News' },
      subhead:
        "In a massive leap for humanoid robotics, Figure's latest iteration successfully performed complex, multi-step automotive assembly tasks completely autonomously, powered by an end-to-end neural network.",
      featuredImageCaption:
        'Field demos highlight long-horizon physical tasks with less teleoperation than prior generations.',
      leadParagraph: '',
      showCategoryNewspaperIcon: true,
      relatedPath: 'news',
      toc: [
        { id: 'task', title: 'Task scope' },
        { id: 'safety', title: 'Deployment caveats' },
      ],
      blocks: [
        {
          type: 'lead',
          text: 'A humanoid platform reaching reliable multi-minute manipulation loops is a notable milestone for applied robotics teams.',
        },
        { type: 'h2', id: 'task', text: '1. Task scope' },
        {
          type: 'p',
          text: 'Automotive sub-assemblies are structured environments; generalization to new lines and error recovery remain open engineering problems.',
        },
        { type: 'h2', id: 'safety', text: '2. Deployment caveats' },
        {
          type: 'p',
          text: 'Safety interlocks, training data consent, and union workflows will influence how quickly similar systems appear beyond pilots.',
        },
      ],
      topicTags: [
        { label: 'Robotics' },
        { label: 'Manufacturing' },
        { label: 'Embodied AI' },
      ],
      related: {
        previous: {
          slug: 'eu-ai-act-updates',
          title: 'EU AI Act Enters Final Implementation Phase',
        },
        next: null,
      },
    },
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
