# RLS And Supabase

Use this file for policy design, tenant isolation, and Supabase-specific security or performance issues.

## RLS Rules

- Enable RLS for multi-tenant or user-scoped tables.
- Write policies that match the real access model instead of trusting application-side filtering alone.
- Keep policy predicates simple and index the columns they rely on.
- Be explicit about which operations each policy covers: `select`, `insert`, `update`, `delete`.
- Treat service-role access as privileged infrastructure access, not normal user access.

## Supabase-Specific Checks

- Confirm whether access should use `auth.uid()`, a service role, or a trusted backend path.
- Check whether edge functions, server actions, and client-side calls are using the right role for the job.
- Keep migrations, policies, and functions consistent; do not ship one without the others when behavior depends on them.
- Watch for policy regressions that look like performance issues because the wrong role can bypass or over-trigger policy work.

## Common Failures

- policies that reference unindexed tenant or ownership columns
- app code filtering rows correctly while the database still allows broader access
- mixing privileged and unprivileged access patterns without clear boundaries

## Validate

- prove the allowed path works
- prove the forbidden path fails
- re-check query cost after adding or changing policy predicates
