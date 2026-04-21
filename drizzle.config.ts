import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Prefer DIRECT_DATABASE_URL (port 5432) for drizzle-kit — pooled connections
// don't reliably support the DDL transactions that generate/migrate need.
const databaseUrl =
  process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error(
    'DIRECT_DATABASE_URL (preferred) or DATABASE_URL is required for drizzle-kit. Set it in .env (see .env.example).',
  );
}

export default defineConfig({
  schema: './libs/db/src/schema/index.ts',
  out: './libs/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
  casing: 'snake_case',
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations',
    schema: 'public',
  },
});
