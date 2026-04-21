import postgres from 'postgres';

/**
 * Drizzle migration `20260420220005` references `citext` before the
 * infrastructure migration enables extensions. Run these statements against a
 * fresh database before `drizzle-orm/migrator` applies SQL files.
 */
export async function ensureMigrationPrerequisites(
  sql: ReturnType<typeof postgres>,
): Promise<void> {
  await sql`CREATE SCHEMA IF NOT EXISTS extensions`;
  await sql`CREATE EXTENSION IF NOT EXISTS citext`;
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions`;
}

/**
 * RLS policies reference Supabase's `anon` and `authenticated` roles. Vanilla
 * Postgres (Testcontainers / local) does not define them — create no-login
 * stubs so migrations apply. On Supabase, roles already exist and this is a
 * no-op.
 */
export async function ensurePolicyRoles(
  sql: ReturnType<typeof postgres>,
): Promise<void> {
  await sql.unsafe(`
DO $policy_roles$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
END
$policy_roles$;
`);
}
