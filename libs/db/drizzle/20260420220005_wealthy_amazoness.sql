CREATE TYPE "public"."admin_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contact_message_status" AS ENUM('new', 'read', 'replied', 'spam');--> statement-breakpoint
CREATE TYPE "public"."generation_job_status" AS ENUM('pending', 'running', 'succeeded', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."generation_step_name" AS ENUM('topic_research', 'outline', 'drafting', 'fact_check', 'tldr_and_faq', 'seo_meta', 'translation', 'quality_review');--> statement-breakpoint
CREATE TYPE "public"."generation_step_status" AS ENUM('pending', 'running', 'succeeded', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'pt-BR', 'es');--> statement-breakpoint
CREATE TYPE "public"."newsletter_digest_status" AS ENUM('pending', 'sending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."newsletter_subscriber_status" AS ENUM('pending', 'confirmed', 'unsubscribed', 'bounced');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"bio" text NOT NULL,
	"photo_url" text,
	"expertise" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"same_as" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "category_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "article_analytics_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"sessions" integer DEFAULT 0 NOT NULL,
	"pageviews" integer DEFAULT 0 NOT NULL,
	"average_engagement_seconds" integer DEFAULT 0 NOT NULL,
	"bounce_rate_bps" integer DEFAULT 0 NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_citations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_translation_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"snippet" text,
	"publisher" text,
	"published_at" timestamp with time zone,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"article_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "article_tags_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "article_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"tldr" text NOT NULL,
	"key_takeaways" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"body_markdown" text NOT NULL,
	"body_html" text NOT NULL,
	"faq" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"og_title" text,
	"og_description" text,
	"reading_time_minutes" integer DEFAULT 0 NOT NULL,
	"search_vector" "tsvector",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"category_id" uuid,
	"default_locale" "locale" DEFAULT 'en' NOT NULL,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"cover_image_url" text,
	"og_image_url" text,
	"word_count_target" integer DEFAULT 1500 NOT NULL,
	"word_count_actual" integer,
	"token_cost_total" integer DEFAULT 0 NOT NULL,
	"source_prompt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "generation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"topic" text NOT NULL,
	"target_locales" jsonb DEFAULT '["en"]'::jsonb NOT NULL,
	"status" "generation_job_status" DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"total_cost_usd" numeric(12, 6) DEFAULT '0' NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"step_name" "generation_step_name" NOT NULL,
	"step_order" integer NOT NULL,
	"locale" "locale",
	"status" "generation_step_status" DEFAULT 'pending' NOT NULL,
	"model" text,
	"input" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output" jsonb,
	"tokens_input" integer DEFAULT 0 NOT NULL,
	"tokens_output" integer DEFAULT 0 NOT NULL,
	"cost_usd" numeric(12, 6) DEFAULT '0' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_digest_articles" (
	"digest_id" uuid NOT NULL,
	"article_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_digest_articles_digest_id_article_id_pk" PRIMARY KEY("digest_id","article_id")
);
--> statement-breakpoint
CREATE TABLE "newsletter_digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" "locale" NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"status" "newsletter_digest_status" DEFAULT 'pending' NOT NULL,
	"subject" text NOT NULL,
	"preview_text" text,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"article_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"provider_message_id" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" "citext" NOT NULL,
	"locale" "locale" DEFAULT 'en' NOT NULL,
	"status" "newsletter_subscriber_status" DEFAULT 'pending' NOT NULL,
	"confirmation_token" text NOT NULL,
	"confirmed_at" timestamp with time zone,
	"unsubscribe_token" text NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"locale" "locale",
	"status" "contact_message_status" DEFAULT 'new' NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"replied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"role" "admin_role" DEFAULT 'editor' NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_translations" ADD CONSTRAINT "tag_translations_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_analytics_snapshots" ADD CONSTRAINT "article_analytics_snapshots_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_citations" ADD CONSTRAINT "article_citations_article_translation_id_article_translations_id_fk" FOREIGN KEY ("article_translation_id") REFERENCES "public"."article_translations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_jobs" ADD CONSTRAINT "generation_jobs_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_steps" ADD CONSTRAINT "generation_steps_job_id_generation_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."generation_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_digest_articles" ADD CONSTRAINT "newsletter_digest_articles_digest_id_newsletter_digests_id_fk" FOREIGN KEY ("digest_id") REFERENCES "public"."newsletter_digests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_digest_articles" ADD CONSTRAINT "newsletter_digest_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "authors_slug_unique" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "authors_email_unique" ON "authors" USING btree ("email");--> statement-breakpoint
CREATE INDEX "authors_deleted_at_idx" ON "authors" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "categories_deleted_at_idx" ON "categories" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "category_translations_category_locale_unique" ON "category_translations" USING btree ("category_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "category_translations_slug_locale_unique" ON "category_translations" USING btree ("locale","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_translations_tag_locale_unique" ON "tag_translations" USING btree ("tag_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_translations_slug_locale_unique" ON "tag_translations" USING btree ("locale","slug");--> statement-breakpoint
CREATE INDEX "tags_deleted_at_idx" ON "tags" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "article_analytics_article_period_idx" ON "article_analytics_snapshots" USING btree ("article_id","period_start");--> statement-breakpoint
CREATE INDEX "article_analytics_locale_period_idx" ON "article_analytics_snapshots" USING btree ("locale","period_start");--> statement-breakpoint
CREATE INDEX "article_citations_translation_idx" ON "article_citations" USING btree ("article_translation_id");--> statement-breakpoint
CREATE INDEX "article_tags_tag_idx" ON "article_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "article_translations_article_locale_unique" ON "article_translations" USING btree ("article_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "article_translations_slug_locale_unique" ON "article_translations" USING btree ("locale","slug");--> statement-breakpoint
CREATE INDEX "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "articles_deleted_at_idx" ON "articles" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "generation_jobs_status_idx" ON "generation_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "generation_jobs_article_idx" ON "generation_jobs" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "generation_jobs_created_at_idx" ON "generation_jobs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "generation_steps_job_order_idx" ON "generation_steps" USING btree ("job_id","step_order");--> statement-breakpoint
CREATE INDEX "generation_steps_status_idx" ON "generation_steps" USING btree ("status");--> statement-breakpoint
CREATE INDEX "newsletter_digest_articles_article_idx" ON "newsletter_digest_articles" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "newsletter_digests_locale_scheduled_idx" ON "newsletter_digests" USING btree ("locale","scheduled_for");--> statement-breakpoint
CREATE INDEX "newsletter_digests_status_idx" ON "newsletter_digests" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_email_locale_unique" ON "newsletter_subscribers" USING btree ("email","locale");--> statement-breakpoint
CREATE INDEX "newsletter_subscribers_status_idx" ON "newsletter_subscribers" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_confirmation_token_unique" ON "newsletter_subscribers" USING btree ("confirmation_token");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribe_token_unique" ON "newsletter_subscribers" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "contact_messages_status_idx" ON "contact_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_auth_user_id_unique" ON "admin_users" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_unique" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_role_idx" ON "admin_users" USING btree ("role");