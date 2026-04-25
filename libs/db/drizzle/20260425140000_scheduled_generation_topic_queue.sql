-- Feature 06: scheduled article generation — topic queue + job metadata.
-- Safe to re-run: IF NOT EXISTS / DO blocks where needed.

DO $enum$
BEGIN
  CREATE TYPE "generation_trigger_kind" AS ENUM ('manual', 'scheduled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$enum$;
--> statement-breakpoint

ALTER TABLE "generation_jobs" ADD COLUMN IF NOT EXISTS "trigger_kind" "generation_trigger_kind" DEFAULT 'manual' NOT NULL;
--> statement-breakpoint
ALTER TABLE "generation_jobs" ADD COLUMN IF NOT EXISTS "auto_publish" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "generation_jobs" ADD COLUMN IF NOT EXISTS "failure_class" text;
--> statement-breakpoint
ALTER TABLE "generation_jobs" ADD COLUMN IF NOT EXISTS "retry_after" timestamptz;
--> statement-breakpoint
ALTER TABLE "generation_jobs" ADD COLUMN IF NOT EXISTS "retry_attempt" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "generation_jobs_retry_idx" ON "generation_jobs" ("status", "failure_class", "retry_after");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "topic_queue" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "normalized_topic" text NOT NULL,
  "display_title" text NOT NULL,
  "score" numeric(8, 2) DEFAULT '0' NOT NULL,
  "source" text DEFAULT 'research' NOT NULL,
  "status" text DEFAULT 'available' NOT NULL,
  "generation_job_id" uuid,
  "article_id" uuid,
  "last_error" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $fk$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'topic_queue_generation_job_id_generation_jobs_id_fk'
  ) THEN
    ALTER TABLE "topic_queue"
      ADD CONSTRAINT "topic_queue_generation_job_id_generation_jobs_id_fk"
      FOREIGN KEY ("generation_job_id") REFERENCES "public"."generation_jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'topic_queue_article_id_articles_id_fk'
  ) THEN
    ALTER TABLE "topic_queue"
      ADD CONSTRAINT "topic_queue_article_id_articles_id_fk"
      FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;
END
$fk$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "topic_queue_normalized_topic_uq" ON "topic_queue" ("normalized_topic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_queue_status_score_idx" ON "topic_queue" ("status", "score");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_queue_generation_job_idx" ON "topic_queue" ("generation_job_id");
--> statement-breakpoint

DO $trig$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'public.topic_queue'::regclass
    ) THEN
      CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.topic_queue
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
  END IF;
END
$trig$;
