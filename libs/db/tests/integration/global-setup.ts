import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import {
  ensureMigrationPrerequisites,
  ensurePolicyRoles,
} from '../../scripts/prerequisites';

function resolveMigrationsFolder(): string {
  const fromRepoRoot = path.join(process.cwd(), 'libs/db/drizzle');
  const fromDbLib = path.join(process.cwd(), 'drizzle');
  if (existsSync(path.join(fromRepoRoot, 'meta', '_journal.json'))) {
    return fromRepoRoot;
  }
  if (existsSync(path.join(fromDbLib, 'meta', '_journal.json'))) {
    return fromDbLib;
  }
  return fromRepoRoot;
}

let container: StartedPostgreSqlContainer;

function quoteIdent(ident: string): string {
  return `"${ident.replace(/"/g, '""')}"`;
}

function anonConnectionUrl(superuserUrl: string): string {
  const u = new URL(superuserUrl);
  u.username = 'test_anon';
  u.password = 'test_anon_secret';
  return u.toString();
}

export async function setup(): Promise<() => Promise<void>> {
  container = await new PostgreSqlContainer('postgres:17-alpine').start();
  const url = container.getConnectionUri();
  process.env['TEST_DATABASE_URL'] = url;

  const migrationsFolder = resolveMigrationsFolder();

  const prep = postgres(url, { max: 1, prepare: false });
  try {
    await ensureMigrationPrerequisites(prep);
    await ensurePolicyRoles(prep);
  } finally {
    await prep.end({ timeout: 5 });
  }

  const migrationClient = postgres(url, { max: 1, prepare: false });
  try {
    await migrate(drizzle(migrationClient), { migrationsFolder });
  } finally {
    await migrationClient.end({ timeout: 5 });
  }

  const admin = postgres(url, { max: 1, prepare: false });
  try {
    const dbUrl = new URL(url);
    const databaseName = dbUrl.pathname.replace(/^\//, '') || 'postgres';

    /** Match Supabase-style grants: RLS still filters what `anon` can see. */
    await admin.unsafe('GRANT USAGE ON SCHEMA public TO anon');
    await admin.unsafe('GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon');
    await admin.unsafe(
      'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon',
    );
    await admin.unsafe('GRANT USAGE ON SCHEMA public TO authenticated');
    await admin.unsafe(
      'GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated',
    );
    await admin.unsafe(
      'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO authenticated',
    );

    await admin.unsafe('DROP ROLE IF EXISTS test_anon');
    await admin.unsafe(
      "CREATE ROLE test_anon WITH LOGIN PASSWORD 'test_anon_secret'",
    );
    await admin.unsafe(
      `GRANT CONNECT ON DATABASE ${quoteIdent(databaseName)} TO test_anon`,
    );
    await admin.unsafe('GRANT USAGE ON SCHEMA public TO test_anon');
    await admin.unsafe(
      'GRANT SELECT ON ALL TABLES IN SCHEMA public TO test_anon',
    );
    await admin.unsafe(
      'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO test_anon',
    );
    /** Policies are defined FOR ROLE `anon`; allow the test login to assume it. */
    await admin.unsafe('GRANT anon TO test_anon');
  } finally {
    await admin.end({ timeout: 5 });
  }

  process.env['TEST_ANON_DATABASE_URL'] = anonConnectionUrl(url);

  return async () => {
    await container.stop();
  };
}
