import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { createDatabase } from '../src/client';
import {
  articleCitations,
  articles,
  articleTranslations,
  authors,
  categories,
  categoryTranslations,
} from '../src/schema';

/** Deterministic UUIDs so `pnpm db:seed` is safe to re-run. */
const SEED = {
  authorId: 'b1111111-1111-4111-8111-111111111111',
  categoryEngineeringId: 'c1111111-1111-4111-8111-111111111111',
  categoryDesignId: 'c2222222-2222-4222-8222-222222222222',
  categoryGrowthId: 'c3333333-3333-4333-8333-333333333333',
  articleId: 'a1111111-1111-4111-8111-111111111111',
  citationEn1: 'f1111111-1111-4111-8111-111111111111',
  citationEn2: 'f2222222-2222-4222-8222-222222222222',
  citationEn3: 'f3333333-3333-4333-8333-333333333333',
} as const;

async function main() {
  const url = process.env['DATABASE_URL'] ?? process.env['DIRECT_DATABASE_URL'];
  if (!url) {
    throw new Error(
      'Set DATABASE_URL (pooled, for app/seed) or DIRECT_DATABASE_URL in .env.',
    );
  }

  const { db, sql } = createDatabase({ url, max: 5 });

  try {
    await db
      .insert(authors)
      .values({
        id: SEED.authorId,
        slug: 'owner',
        fullName: 'Site Owner',
        email: 'owner@blog-builder.local',
        bio: 'Seed author for local development and smoke tests.',
        photoUrl: 'https://placeholder.invalid/owner.jpg',
        expertise: ['Software', 'Technical writing'],
        sameAs: [
          'https://example.com/owner',
          'https://example.com/owner/writing',
        ],
      })
      .onConflictDoUpdate({
        target: authors.id,
        set: {
          slug: 'owner',
          fullName: 'Site Owner',
          email: 'owner@blog-builder.local',
          bio: 'Seed author for local development and smoke tests.',
          photoUrl: 'https://placeholder.invalid/owner.jpg',
          expertise: ['Software', 'Technical writing'],
          sameAs: [
            'https://example.com/owner',
            'https://example.com/owner/writing',
          ],
        },
      });

    const categorySpecs = [
      {
        id: SEED.categoryEngineeringId,
        translations: [
          {
            locale: 'en' as const,
            name: 'Engineering',
            slug: 'engineering',
            description: 'Build systems and ship reliably.',
          },
          {
            locale: 'pt-BR' as const,
            name: 'Engenharia',
            slug: 'engenharia',
            description: 'Construir sistemas e entregar com confiabilidade.',
          },
          {
            locale: 'es' as const,
            name: 'Ingeniería',
            slug: 'ingenieria',
            description: 'Construir sistemas y publicar con fiabilidad.',
          },
        ],
      },
      {
        id: SEED.categoryDesignId,
        translations: [
          {
            locale: 'en' as const,
            name: 'Design',
            slug: 'design',
            description: 'Product and editorial craft.',
          },
          {
            locale: 'pt-BR' as const,
            name: 'Design',
            slug: 'design-pt',
            description: 'Craft de produto e editorial.',
          },
          {
            locale: 'es' as const,
            name: 'Diseño',
            slug: 'diseno',
            description: 'Oficio de producto y editorial.',
          },
        ],
      },
      {
        id: SEED.categoryGrowthId,
        translations: [
          {
            locale: 'en' as const,
            name: 'Growth',
            slug: 'growth',
            description: 'Distribution and lifecycle.',
          },
          {
            locale: 'pt-BR' as const,
            name: 'Crescimento',
            slug: 'crescimento',
            description: 'Distribuição e ciclo de vida.',
          },
          {
            locale: 'es' as const,
            name: 'Crecimiento',
            slug: 'crecimiento',
            description: 'Distribución y ciclo de vida.',
          },
        ],
      },
    ] as const;

    for (const cat of categorySpecs) {
      await db.insert(categories).values({ id: cat.id }).onConflictDoNothing();

      for (const tr of cat.translations) {
        await db
          .insert(categoryTranslations)
          .values({
            categoryId: cat.id,
            locale: tr.locale,
            name: tr.name,
            slug: tr.slug,
            description: tr.description,
          })
          .onConflictDoNothing({
            target: [
              categoryTranslations.categoryId,
              categoryTranslations.locale,
            ],
          });
      }
    }

    const publishedAt = new Date('2020-06-15T12:00:00.000Z');

    await db
      .insert(articles)
      .values({
        id: SEED.articleId,
        authorId: SEED.authorId,
        categoryId: SEED.categoryEngineeringId,
        defaultLocale: 'en',
        status: 'published',
        publishedAt,
        coverImageUrl: 'https://placeholder.invalid/cover.jpg',
        wordCountTarget: 1200,
        wordCountActual: 800,
        tokenCostTotal: 0,
        sourcePrompt: 'Seed smoke article',
      })
      .onConflictDoNothing();

    const translationRows = [
      {
        locale: 'en' as const,
        slug: 'welcome-smoke-test',
        title: 'Welcome — smoke test article',
        subtitle: 'Local development seed content',
        tldr: 'This article exists to verify publishing, RLS, and translations.',
        keyTakeaways: ['Seed data is idempotent', 'Three locales are covered'],
        bodyMarkdown: '# Welcome\n\nThis is **seed** markdown.',
        bodyHtml: '<h1>Welcome</h1><p>This is <strong>seed</strong> HTML.</p>',
        faq: [
          {
            question: 'Is this real content?',
            answer: 'No — it is only for local smoke tests.',
          },
        ],
        metaTitle: 'Welcome — smoke test',
        metaDescription: 'Seed article for blog-builder local dev.',
        ogTitle: 'Welcome — smoke test',
        ogDescription: 'Seed article for blog-builder local dev.',
        readingTimeMinutes: 4,
      },
      {
        locale: 'pt-BR' as const,
        slug: 'bem-vindo-teste-de-fumaca',
        title: 'Bem-vindo — artigo de teste',
        subtitle: 'Conteúdo seed para desenvolvimento',
        tldr: 'Este artigo verifica publicação, RLS e traduções.',
        keyTakeaways: ['Dados seed são idempotentes', 'Três idiomas'],
        bodyMarkdown: '# Bem-vindo\n\nMarkdown **seed**.',
        bodyHtml: '<h1>Bem-vindo</h1><p>HTML <strong>seed</strong>.</p>',
        faq: [],
        metaTitle: 'Bem-vindo — teste',
        metaDescription: 'Artigo seed.',
        ogTitle: 'Bem-vindo — teste',
        ogDescription: 'Artigo seed.',
        readingTimeMinutes: 4,
      },
      {
        locale: 'es' as const,
        slug: 'bienvenida-prueba-de-humo',
        title: 'Bienvenida — artículo de prueba',
        subtitle: 'Contenido seed para desarrollo local',
        tldr: 'Este artículo verifica publicación, RLS y traducciones.',
        keyTakeaways: ['Datos seed idempotentes', 'Tres idiomas'],
        bodyMarkdown: '# Bienvenida\n\nMarkdown **seed**.',
        bodyHtml: '<h1>Bienvenida</h1><p>HTML <strong>seed</strong>.</p>',
        faq: [],
        metaTitle: 'Bienvenida — prueba',
        metaDescription: 'Artículo seed.',
        ogTitle: 'Bienvenida — prueba',
        ogDescription: 'Artículo seed.',
        readingTimeMinutes: 4,
      },
    ] as const;

    const translationIds: Record<string, string> = {};

    for (const row of translationRows) {
      const existing = await db.query.articleTranslations.findFirst({
        where: (t, { and, eq: eqFn }) =>
          and(eqFn(t.articleId, SEED.articleId), eqFn(t.locale, row.locale)),
      });

      if (existing) {
        translationIds[row.locale] = existing.id;
        continue;
      }

      const inserted = await db
        .insert(articleTranslations)
        .values({
          articleId: SEED.articleId,
          locale: row.locale,
          slug: row.slug,
          title: row.title,
          subtitle: row.subtitle,
          tldr: row.tldr,
          keyTakeaways: [...row.keyTakeaways],
          bodyMarkdown: row.bodyMarkdown,
          bodyHtml: row.bodyHtml,
          faq: [...row.faq],
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          ogTitle: row.ogTitle,
          ogDescription: row.ogDescription,
          readingTimeMinutes: row.readingTimeMinutes,
        })
        .returning({ id: articleTranslations.id });

      const id = inserted[0]?.id;
      if (!id) {
        throw new Error(`Failed to insert translation for ${row.locale}`);
      }
      translationIds[row.locale] = id;
    }

    const enId = translationIds['en'];
    if (!enId) {
      throw new Error('Missing English translation id');
    }

    const citations = [
      {
        id: SEED.citationEn1,
        url: 'https://example.com/source-one',
        title: 'Primary source',
        snippet: 'Supporting evidence one',
        publisher: 'Example Press',
        orderIndex: 0,
      },
      {
        id: SEED.citationEn2,
        url: 'https://example.com/source-two',
        title: 'Secondary source',
        snippet: 'Supporting evidence two',
        publisher: 'Example Press',
        orderIndex: 1,
      },
      {
        id: SEED.citationEn3,
        url: 'https://example.com/source-three',
        title: 'Tertiary source',
        snippet: 'Supporting evidence three',
        publisher: 'Example Press',
        orderIndex: 2,
      },
    ] as const;

    for (const c of citations) {
      await db
        .insert(articleCitations)
        .values({
          id: c.id,
          articleTranslationId: enId,
          url: c.url,
          title: c.title,
          snippet: c.snippet,
          publisher: c.publisher,
          orderIndex: c.orderIndex,
        })
        .onConflictDoNothing();
    }

    const [authorRow] = await db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.slug, 'owner'))
      .limit(1);

    console.log(
      `Seed complete. author=${authorRow?.id ?? SEED.authorId} article=${SEED.articleId}`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
