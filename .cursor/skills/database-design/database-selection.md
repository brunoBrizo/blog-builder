# Database Selection

Use the repo's existing persistence path unless there is a strong reason not to.

## Repo Order Of Preference

1. Prisma + PostgreSQL for services that already use Prisma
2. Supabase/Postgres for apps and functions already tied to Supabase auth, RLS, or SQL migrations
3. MongoDB only when the task clearly belongs to the existing Mongoose-based service

## Decision Guide

Choose Prisma + PostgreSQL when:

- the service is Nest-based and already models data through Prisma
- relational integrity and structured migrations matter
- the task is normal schema or API-backed product work

Choose Supabase/Postgres when:

- the affected area already depends on Supabase clients, migrations, or functions
- database-level auth and RLS are part of the design
- the operational model is already Supabase-driven

Choose Mongo only when:

- the work stays inside the existing Mongo service
- document-style storage is already established there

## Questions To Ask

1. Which app or service owns this data?
2. Is the persistence path already fixed by that app?
3. Does the task need Supabase auth or RLS?
4. Is this actually a Mongo-scoped change, or should it follow the repo's SQL defaults?
