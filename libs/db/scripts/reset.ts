import 'dotenv/config';
import postgres from 'postgres';

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
      'Set DIRECT_DATABASE_URL or DATABASE_URL in .env before reset.',
    );
  }

  if (url.includes('supabase.co') && process.env['FORCE_DB_RESET'] !== '1') {
    throw new Error(
      'Refusing to reset a Supabase-hosted database. Use a local URL, or set FORCE_DB_RESET=1 to override.',
    );
  }

  const sql = postgres(url, connectionOptions(url));
  try {
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO PUBLIC`;
    await sql`GRANT ALL ON SCHEMA public TO postgres`;
  } finally {
    await sql.end({ timeout: 5 });
  }

  console.log(
    'Public schema dropped and recreated. Run `pnpm db:migrate`, then `pnpm db:seed` if needed.',
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
