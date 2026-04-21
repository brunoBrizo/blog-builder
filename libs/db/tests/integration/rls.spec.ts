import { randomUUID } from 'node:crypto';

import {
  articles,
  articleTranslations,
  authors,
  categories,
  categoryTranslations,
  contactMessages,
  createDatabase,
  generationJobs,
  adminUsers,
  newsletterSubscribers,
} from '../../src/index';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { afterAll, beforeAll, expect, test } from 'vitest';

const superUrl = process.env['TEST_DATABASE_URL'];
const anonUrl = process.env['TEST_ANON_DATABASE_URL'];

let sql: ReturnType<typeof createDatabase>['sql'] | undefined;

beforeAll(() => {
  if (!superUrl || !anonUrl) {
    throw new Error(
      'TEST_DATABASE_URL / TEST_ANON_DATABASE_URL missing (globalSetup failed?)',
    );
  }
});

afterAll(async () => {
  await sql?.end({ timeout: 5 });
});

test('anon role cannot read protected rows; can read published content', async () => {
  if (!superUrl || !anonUrl) {
    throw new Error('TEST_DATABASE_URL / TEST_ANON_DATABASE_URL is not set');
  }
  const suf = randomUUID().slice(0, 8);
  const client = createDatabase({ url: superUrl, max: 5 });
  sql = client.sql;
  const { db } = client;

  await db.insert(generationJobs).values({
    topic: `secret-job-${suf}`,
    status: 'pending',
  });

  await db.insert(contactMessages).values({
    name: 'X',
    email: `x-${suf}@example.com`,
    subject: 'S',
    message: 'M',
    status: 'new',
  });

  await db.insert(adminUsers).values({
    authUserId: randomUUID(),
    email: `admin-secret-${suf}@example.com`,
    role: 'viewer',
  });

  await db.insert(newsletterSubscribers).values({
    email: `secret-${suf}@example.com`,
    locale: 'en',
    confirmationToken: randomUUID(),
    unsubscribeToken: randomUUID(),
    status: 'pending',
  });

  const [author] = await db
    .insert(authors)
    .values({
      slug: `rls-author-${suf}`,
      fullName: 'RLS Author',
      email: `rls-author-${suf}@example.com`,
      bio: 'Bio',
    })
    .returning({ id: authors.id });
  const authorId = author?.id;
  expect(authorId).toBeDefined();
  if (!authorId) {
    return;
  }

  const [category] = await db.insert(categories).values({}).returning({
    id: categories.id,
  });
  const categoryId = category?.id;
  expect(categoryId).toBeDefined();
  if (!categoryId) {
    return;
  }

  await db.insert(categoryTranslations).values({
    categoryId,
    locale: 'en',
    name: 'RLS Cat',
    slug: `rls-cat-${suf}`,
  });

  const publishedAt = new Date('2019-01-01T00:00:00.000Z');

  const [article] = await db
    .insert(articles)
    .values({
      authorId,
      categoryId,
      status: 'published',
      publishedAt,
      defaultLocale: 'en',
    })
    .returning({ id: articles.id });
  const articleId = article?.id;
  expect(articleId).toBeDefined();
  if (!articleId) {
    return;
  }

  await db.insert(articleTranslations).values({
    articleId,
    locale: 'en',
    slug: `rls-pub-${suf}`,
    title: 'Public',
    tldr: 'Tldr',
    bodyMarkdown: 'm',
    bodyHtml: '<p>x</p>',
    metaTitle: 'T',
    metaDescription: 'D',
  });

  const anon = postgres(anonUrl, { max: 2, prepare: false });

  try {
    await anon`SET ROLE anon`;

    const jobs =
      await anon`SELECT id FROM generation_jobs WHERE topic = ${`secret-job-${suf}`}`;
    expect(jobs.length).toBe(0);

    const contacts =
      await anon`SELECT id FROM contact_messages WHERE email = ${`x-${suf}@example.com`}`;
    expect(contacts.length).toBe(0);

    const admins =
      await anon`SELECT id FROM admin_users WHERE email = ${`admin-secret-${suf}@example.com`}`;
    expect(admins.length).toBe(0);

    const subs =
      await anon`SELECT email FROM newsletter_subscribers WHERE email = ${`secret-${suf}@example.com`}`;
    expect(subs.length).toBe(0);

    const pubArticles =
      await anon`SELECT id FROM articles WHERE id = ${articleId}`;
    expect(pubArticles.length).toBe(1);

    const pubTr = await anon`
      SELECT slug FROM article_translations
      WHERE article_id = ${articleId} AND locale = 'en'
    `;
    expect(pubTr.length).toBe(1);
    expect(pubTr[0]?.['slug']).toBe(`rls-pub-${suf}`);
  } finally {
    await anon.end({ timeout: 5 });
  }

  await db
    .delete(articleTranslations)
    .where(eq(articleTranslations.articleId, articleId));
  await db.delete(articles).where(eq(articles.id, articleId));
  await db
    .delete(categoryTranslations)
    .where(eq(categoryTranslations.categoryId, categoryId));
  await db.delete(categories).where(eq(categories.id, categoryId));
  await db.delete(authors).where(eq(authors.id, authorId));
});
