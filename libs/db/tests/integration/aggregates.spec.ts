import { randomUUID } from 'node:crypto';

import { count, eq } from 'drizzle-orm';
import { afterAll, beforeAll, expect, test } from 'vitest';

import {
  adminUsers,
  articleAnalyticsSnapshots,
  articleCitations,
  articles,
  articleTags,
  articleTranslations,
  authors,
  categories,
  categoryTranslations,
  contactMessages,
  createDatabase,
  generationJobs,
  generationSteps,
  newsletterDigestArticles,
  newsletterDigests,
  newsletterSubscribers,
  tags,
  tagTranslations,
} from '../../src/index';

const url = process.env['TEST_DATABASE_URL'];

let sql: ReturnType<typeof createDatabase>['sql'] | undefined;

beforeAll(() => {
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set (globalSetup failed?)');
  }
});

afterAll(async () => {
  await sql?.end({ timeout: 5 });
});

test('insert and read back every aggregate root', async () => {
  if (!url) {
    throw new Error('TEST_DATABASE_URL is not set');
  }
  const suf = randomUUID().slice(0, 8);
  const client = createDatabase({ url, max: 5 });
  sql = client.sql;
  const { db } = client;

  const [author] = await db
    .insert(authors)
    .values({
      slug: `author-${suf}`,
      fullName: 'Integration Author',
      email: `author-${suf}@example.com`,
      bio: 'Bio',
    })
    .returning({ id: authors.id });
  expect(author?.id).toBeDefined();
  const authorId = author?.id;
  if (!authorId) {
    return;
  }

  const [category] = await db.insert(categories).values({}).returning({
    id: categories.id,
  });
  expect(category?.id).toBeDefined();
  const categoryId = category?.id;
  if (!categoryId) {
    return;
  }

  await db.insert(categoryTranslations).values({
    categoryId,
    locale: 'en',
    name: 'Cat EN',
    slug: `cat-en-${suf}`,
  });

  const [tag] = await db.insert(tags).values({}).returning({ id: tags.id });
  expect(tag?.id).toBeDefined();
  const tagId = tag?.id;
  if (!tagId) {
    return;
  }

  await db.insert(tagTranslations).values({
    tagId,
    locale: 'en',
    name: 'Tag EN',
    slug: `tag-en-${suf}`,
  });

  const [article] = await db
    .insert(articles)
    .values({
      authorId,
      categoryId,
      status: 'draft',
      defaultLocale: 'en',
    })
    .returning({ id: articles.id });
  const articleId = article?.id;
  expect(articleId).toBeDefined();
  if (!articleId) {
    return;
  }

  const [translation] = await db
    .insert(articleTranslations)
    .values({
      articleId,
      locale: 'en',
      slug: `article-${suf}`,
      title: 'Title',
      tldr: 'Tldr',
      bodyMarkdown: 'md',
      bodyHtml: '<p>html</p>',
      metaTitle: 'Meta',
      metaDescription: 'Desc',
    })
    .returning({ id: articleTranslations.id });
  const translationId = translation?.id;
  expect(translationId).toBeDefined();
  if (!translationId) {
    return;
  }

  await db.insert(articleTags).values({
    articleId,
    tagId,
  });

  await db.insert(articleCitations).values({
    articleTranslationId: translationId,
    url: 'https://example.com/cite',
    title: 'Cite',
    orderIndex: 0,
  });

  await db.insert(articleAnalyticsSnapshots).values({
    articleId,
    locale: 'en',
    periodStart: new Date('2025-01-01T00:00:00.000Z'),
    periodEnd: new Date('2025-01-31T23:59:59.000Z'),
    pageviews: 10,
  });

  const [job] = await db
    .insert(generationJobs)
    .values({
      articleId,
      topic: 'Topic',
      status: 'pending',
    })
    .returning({ id: generationJobs.id });
  const jobId = job?.id;
  expect(jobId).toBeDefined();
  if (!jobId) {
    return;
  }

  await db.insert(generationSteps).values({
    jobId,
    stepName: 'topic_research',
    stepOrder: 0,
    status: 'pending',
  });

  await db.insert(newsletterSubscribers).values({
    email: `sub-${suf}@example.com`,
    locale: 'en',
    confirmationToken: randomUUID(),
    unsubscribeToken: randomUUID(),
    status: 'pending',
  });

  const [digest] = await db
    .insert(newsletterDigests)
    .values({
      locale: 'en',
      scheduledFor: new Date('2025-02-01T00:00:00.000Z'),
      subject: 'Weekly',
      status: 'pending',
    })
    .returning({ id: newsletterDigests.id });
  const digestId = digest?.id;
  expect(digestId).toBeDefined();
  if (!digestId) {
    return;
  }

  await db.insert(newsletterDigestArticles).values({
    digestId,
    articleId,
    orderIndex: 0,
  });

  await db.insert(contactMessages).values({
    name: 'Visitor',
    email: `visitor-${suf}@example.com`,
    subject: 'Hello',
    message: 'Body',
    locale: 'en',
    status: 'new',
  });

  await db.insert(adminUsers).values({
    authUserId: randomUUID(),
    email: `admin-${suf}@example.com`,
    role: 'editor',
  });

  const [authorCount] = await db
    .select({ n: count() })
    .from(authors)
    .where(eq(authors.id, authorId));
  expect(authorCount?.n).toBe(1);

  const [stepCount] = await db
    .select({ n: count() })
    .from(generationSteps)
    .where(eq(generationSteps.jobId, jobId));
  expect(stepCount?.n).toBe(1);
});
