-- Hand-written follow-up migration for feature-02.
--
-- Adds infrastructure the Drizzle schema cannot express directly:
--   1. Required Postgres extensions (idempotent).
--   2. Generic updated_at trigger function + triggers.
--   3. Full-text search: convert article_translations.search_vector into a
--      GENERATED STORED tsvector, plus supporting GIN/trigram indexes.
--   4. RLS policies for public-readable tables (anon role).

-- 1. Extensions (no-op if already present)
-- Supabase provides the `extensions` schema; vanilla Postgres (CI/Testcontainers) does not.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS citext;
-- pg_net ships with Supabase; skip when unavailable (local Postgres / Testcontainers).
DO $pg_net$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_net') THEN
    CREATE EXTENSION IF NOT EXISTS pg_net;
  END IF;
END
$pg_net$;
--> statement-breakpoint

-- 2. Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
--> statement-breakpoint

-- Apply trigger to every table with an updated_at column.
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT format('%I.%I', table_schema, table_name)
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'updated_at'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %s;',
      tbl
    );
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      tbl
    );
  END LOOP;
END;
$$;
--> statement-breakpoint

-- 3. Full-text search vector on article_translations
-- Convert the plain tsvector column to a GENERATED STORED column that tracks
-- title/subtitle/tldr/body_markdown. Language is picked per-row via a locale
-- lookup (simple English default; pt-BR and es use their own configs).
ALTER TABLE public.article_translations DROP COLUMN IF EXISTS search_vector;
ALTER TABLE public.article_translations
  ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    setweight(
      to_tsvector(
        CASE locale
          WHEN 'pt-BR' THEN 'portuguese'::regconfig
          WHEN 'es'    THEN 'spanish'::regconfig
          ELSE 'english'::regconfig
        END,
        coalesce(title, '')
      ),
      'A'
    ) ||
    setweight(
      to_tsvector(
        CASE locale
          WHEN 'pt-BR' THEN 'portuguese'::regconfig
          WHEN 'es'    THEN 'spanish'::regconfig
          ELSE 'english'::regconfig
        END,
        coalesce(subtitle, '') || ' ' || coalesce(tldr, '')
      ),
      'B'
    ) ||
    setweight(
      to_tsvector(
        CASE locale
          WHEN 'pt-BR' THEN 'portuguese'::regconfig
          WHEN 'es'    THEN 'spanish'::regconfig
          ELSE 'english'::regconfig
        END,
        coalesce(body_markdown, '')
      ),
      'C'
    )
  ) STORED;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS article_translations_search_vector_idx
  ON public.article_translations
  USING GIN (search_vector);
--> statement-breakpoint

-- Trigram indexes for fast slug / title prefix search.
CREATE INDEX IF NOT EXISTS article_translations_title_trgm_idx
  ON public.article_translations
  USING GIN (title gin_trgm_ops);
--> statement-breakpoint

-- 4. Row-level security: enable on all public tables, then add explicit
-- policies for anon read access to *published, non-deleted* content. Writes
-- always happen through the API (service role), which bypasses RLS.

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_digest_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Public-read policies for the anon + authenticated roles.
CREATE POLICY "public_read_authors"
  ON public.authors FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);
--> statement-breakpoint

CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);
--> statement-breakpoint

CREATE POLICY "public_read_category_translations"
  ON public.category_translations FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.categories c
      WHERE c.id = category_translations.category_id
        AND c.deleted_at IS NULL
    )
  );
--> statement-breakpoint

CREATE POLICY "public_read_tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);
--> statement-breakpoint

CREATE POLICY "public_read_tag_translations"
  ON public.tag_translations FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tags t
      WHERE t.id = tag_translations.tag_id
        AND t.deleted_at IS NULL
    )
  );
--> statement-breakpoint

CREATE POLICY "public_read_published_articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );
--> statement-breakpoint

CREATE POLICY "public_read_article_translations"
  ON public.article_translations FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_translations.article_id
        AND a.deleted_at IS NULL
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= now()
    )
  );
--> statement-breakpoint

CREATE POLICY "public_read_article_citations"
  ON public.article_citations FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.article_translations at
      JOIN public.articles a ON a.id = at.article_id
      WHERE at.id = article_citations.article_translation_id
        AND a.deleted_at IS NULL
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= now()
    )
  );
--> statement-breakpoint

CREATE POLICY "public_read_article_tags"
  ON public.article_tags FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_tags.article_id
        AND a.deleted_at IS NULL
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= now()
    )
  );
--> statement-breakpoint

-- All other tables (generation_*, newsletter_*, contact_messages, admin_users,
-- analytics) stay locked down: no anon policies, service role bypasses RLS.
