import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@blog-builder/ui';
import { AuthorBox } from '../../../../components/author-box';
import { ShareButtons } from '../../../../components/share-buttons';
import { TableOfContents } from '../../../../components/table-of-contents';
import { NewsletterCard } from '../../../../components/newsletter-card';
import { AdPlaceholder } from '../../../../components/ad-placeholder';
import { CodeBlock } from '../../../../components/code-block';

import { notFound } from 'next/navigation';

import { articles } from '../../../../mocks/articles';

// In Next.js 15+ we need to use 'params' as a Promise
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // In a real app, this would be a database fetch
  const article = articles.find((a) => a.slug === slug);

  // If not found, show the cornerstone article by default for preview purposes if slug doesn't match
  // This is just to satisfy the mockup when hitting arbitrary URLs
  const activeArticle = article ?? articles[0];
  if (!activeArticle) {
    notFound();
  }

  const tocItems = [
    { id: 'core-architecture', title: 'Core Architecture Overview' },
    { id: 'chunking-strategies', title: 'Advanced Chunking Strategies' },
    { id: 'evaluating-retrieval', title: 'Evaluating Retrieval Performance' },
  ];

  const sampleCode = `from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=<span class="text-emerald-400">1000</span>,
    chunk_overlap=<span class="text-emerald-400">200</span>,
    length_function=<span class="text-indigo-400">len</span>,
    separators=[<span class="text-amber-300">"\\n\\n"</span>, <span class="text-amber-300">"\\n"</span>, <span class="text-amber-300">" "</span>, <span class="text-amber-300">""</span>]
)

chunks = text_splitter.split_text(document_content)
<span class="text-zinc-500"># Analyze chunk distribution before embedding</span>
<span class="text-indigo-400">print</span>(<span class="text-amber-300">f"Generated {len(chunks)} semantic chunks."</span>)`;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" strokeWidth={1.5} />
        <Link href="#" className="hover:text-indigo-600 transition-colors">
          Guides & Tutorials
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" strokeWidth={1.5} />
        <span className="text-zinc-900 truncate max-w-[200px] sm:max-w-xs">
          {activeArticle.title}
        </span>
      </nav>

      {/* Leaderboard Ad Placeholder */}
      <div className="hidden sm:block mb-10">
        <AdPlaceholder type="leaderboard" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Article Content (Left Column) */}
        <article className="lg:col-span-8 flex flex-col min-w-0">
          {/* Article Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Badge
                variant={
                  activeArticle.category.color as
                    | 'violet'
                    | 'emerald'
                    | 'blue'
                    | 'amber'
                    | 'rose'
                    | 'zinc'
                }
              >
                {activeArticle.category.name}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 mb-6 leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
              {activeArticle.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-zinc-100">
              <div className="flex items-center gap-3">
                <Image
                  src={activeArticle.author.avatarUrl}
                  alt={activeArticle.author.name}
                  width={40}
                  height={40}
                  className="rounded-full grayscale opacity-90 object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-zinc-900">
                    {activeArticle.author.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                    <span>{activeArticle.publishedAt}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                    <span>{activeArticle.readTimeMin} min read</span>
                  </div>
                </div>
              </div>

              <ShareButtons />
            </div>
          </header>

          {/* Featured Image */}
          <figure className="mb-10">
            <div className="aspect-[16/9] w-full bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200/50 relative">
              <Image
                src={activeArticle.featuredImageUrl}
                alt="Abstract data flow representing RAG architecture"
                fill
                className="object-cover w-full h-full"
              />
            </div>
            <figcaption className="text-xs text-center text-zinc-500 mt-3">
              Visualizing the data retrieval and embedding generation process in
              a modern LLM architecture.
            </figcaption>
          </figure>

          {/* Article Body */}
          <div className="prose prose-zinc max-w-none text-base text-zinc-600 leading-relaxed space-y-6">
            <p>
              Large Language Models (LLMs) are incredibly powerful, but they
              suffer from a fundamental limitation: their knowledge is frozen at
              the time of training. To build applications that can reason over
              proprietary or real-time data, we need{' '}
              <strong>Retrieval-Augmented Generation (RAG)</strong>.
            </p>

            <p>
              In this guide, we'll walk through the modern stack for building
              production-ready RAG pipelines, bypassing the common pitfalls
              developers face when moving from prototypes to scaled
              applications.
            </p>

            <h2
              id="core-architecture"
              className="text-2xl font-medium tracking-tight text-zinc-900 mt-12 mb-5 scroll-mt-20"
            >
              1. Core Architecture Overview
            </h2>

            <p>
              A typical RAG system consists of two primary pipelines working in
              tandem: the ingestion pipeline and the retrieval/generation
              pipeline. Understanding the separation of concerns here is vital
              for scalability.
            </p>

            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>
                <strong className="text-zinc-900 font-medium">
                  Ingestion:
                </strong>{' '}
                Document parsing, chunking, embedding generation, and vector
                indexing.
              </li>
              <li>
                <strong className="text-zinc-900 font-medium">
                  Retrieval:
                </strong>{' '}
                Query processing, semantic search, re-ranking, and context
                window assembly.
              </li>
              <li>
                <strong className="text-zinc-900 font-medium">
                  Generation:
                </strong>{' '}
                Prompt formatting and LLM inference.
              </li>
            </ul>

            <blockquote className="border-l-2 border-indigo-600 pl-4 py-3 pr-4 bg-indigo-50/30 rounded-r-lg my-8 text-zinc-700 italic">
              "The quality of your RAG output is strictly bounded by the quality
              of your retrieval. An LLM cannot generate accurate answers from
              irrelevant context."
            </blockquote>

            {/* In-content Ad Placeholder */}
            <AdPlaceholder type="content" />

            <h2
              id="chunking-strategies"
              className="text-2xl font-medium tracking-tight text-zinc-900 mt-12 mb-5 scroll-mt-20"
            >
              2. Advanced Chunking Strategies
            </h2>

            <p>
              Naive fixed-size chunking (e.g., splitting every 500 characters)
              often destroys semantic boundaries. Instead, modern systems
              utilize semantic or document-aware chunking.
            </p>

            <h3 className="text-xl font-medium tracking-tight text-zinc-900 mt-8 mb-4">
              Implementation with LangChain
            </h3>

            <p>
              Here's how to implement a recursive character text splitter that
              respects natural paragraph boundaries before falling back to word
              boundaries.
            </p>

            <CodeBlock language="python" code={sampleCode} />

            <h2
              id="evaluating-retrieval"
              className="text-2xl font-medium tracking-tight text-zinc-900 mt-12 mb-5 scroll-mt-20"
            >
              3. Evaluating Retrieval Performance
            </h2>

            <p>
              Don't guess if your RAG pipeline is working. Use frameworks like
              Ragas or TruLens to quantify performance across three metrics:
            </p>

            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>
                <strong className="text-zinc-900 font-medium">
                  Context Precision:
                </strong>{' '}
                Is the retrieved context relevant to the query?
              </li>
              <li>
                <strong className="text-zinc-900 font-medium">
                  Context Recall:
                </strong>{' '}
                Did we retrieve all the necessary information to answer the
                query?
              </li>
              <li>
                <strong className="text-zinc-900 font-medium">
                  Faithfulness:
                </strong>{' '}
                Is the LLM's answer directly derived from the provided context
                (avoiding hallucination)?
              </li>
            </ol>

            <p>
              By setting up automated evaluation pipelines during CI/CD, you can
              confidently swap out embedding models (like moving from OpenAI's
              `text-embedding-ada-002` to `text-embedding-3-small`) and measure
              the exact impact on your application's accuracy.
            </p>
          </div>

          {/* Article Footer / Tags */}
          <div className="mt-12 pt-8 border-t border-zinc-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 mr-2">
                Topics:
              </span>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-zinc-600 bg-zinc-100 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Python
              </Link>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-zinc-600 bg-zinc-100 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                LLMs
              </Link>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-zinc-600 bg-zinc-100 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Vector Databases
              </Link>
              <Link
                href="#"
                className="px-2.5 py-1 text-xs text-zinc-600 bg-zinc-100 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Architecture
              </Link>
            </div>
          </div>

          {/* E-E-A-T Author Box (Expanded for article page) */}
          <div className="mt-10">
            <AuthorBox author={activeArticle.author} variant="expanded" />
          </div>

          {/* Related Articles Navigation */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="#"
              className="group p-5 border border-zinc-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
            >
              <span className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Previous
              </span>
              <span className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
                Understanding Embeddings: The Math Behind the Magic
              </span>
            </Link>
            <Link
              href="#"
              className="group p-5 border border-zinc-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex flex-col justify-between text-right"
            >
              <span className="text-xs text-zinc-500 mb-2 flex items-center justify-end gap-1">
                Next <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
                Top 5 Open-Source Vector Databases Evaluated
              </span>
            </Link>
          </div>
        </article>

        {/* Sidebar (Right Column) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            {/* Table of Contents */}
            <TableOfContents items={tocItems} />

            {/* Sidebar Ad Placeholder */}
            <AdPlaceholder type="sidebar" />

            {/* Newsletter CTA */}
            <NewsletterCard />
          </div>
        </aside>
      </div>
    </main>
  );
}
