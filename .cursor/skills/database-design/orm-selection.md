# ORM Selection

Choose the ORM already established by the affected app unless there is a compelling reason not to.

## Repo Bias

- Prisma is the default ORM guidance for this repo's SQL services.
- Supabase-driven areas may not need a separate ORM at all; the client, SQL migrations, and policies can be the correct boundary.
- Raw SQL is an escape hatch for queries Prisma cannot express cleanly or efficiently.

## Decision Guide

Choose Prisma when:

- the service already has a Prisma schema
- the task is model, relation, or migration oriented
- type-safe application-side data access matters

Choose Supabase client + SQL when:

- the app already uses Supabase directly
- RLS, policies, or database functions are central to the feature
- the work is operationally tied to Supabase migrations or edge functions

Choose raw SQL selectively when:

- a query is performance-critical
- the query shape is awkward in Prisma
- you still keep schema ownership and migration rules clear

## Avoid

- introducing a second ORM into a service without a hard reason
- using raw SQL everywhere when the existing Prisma model layer is already correct
