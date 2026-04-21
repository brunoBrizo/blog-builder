import 'dotenv/config';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import {
  ensureMigrationPrerequisites,
  ensurePolicyRoles,
} from './prerequisites';

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

function connectionOptions(url: string) {
  const local =
    url.includes('127.0.0.1') ||
    url.includes('localhost') ||
    url.includes('::1');
  return {
    max: 1,
    prepare: false as const,
    ssl: local ? (false as const) : ('require' as const),
  };
}

async function main() {
  const url = process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
  if (!url) {
    throw new Error(
      'Set DIRECT_DATABASE_URL (preferred) or DATABASE_URL in .env (see .env.example).',
    );
  }

  const migrationsFolder = resolveMigrationsFolder();

  const prep = postgres(url, connectionOptions(url));
  try {
    await ensureMigrationPrerequisites(prep);
    await ensurePolicyRoles(prep);
  } finally {
    await prep.end({ timeout: 5 });
  }

  const migrationClient = postgres(url, connectionOptions(url));
  try {
    const db = drizzle(migrationClient);
    await migrate(db, { migrationsFolder });
  } finally {
    await migrationClient.end({ timeout: 5 });
  }

  console.log('Migrations applied successfully.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
