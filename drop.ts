import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  await sql`DROP TABLE IF EXISTS "demo_users" CASCADE`;
  await sql`DROP TABLE IF EXISTS "drizzle"."__drizzle_migrations" CASCADE`;
  await sql`DROP SCHEMA IF EXISTS "drizzle" CASCADE`;
  console.log('Tables dropped!');
  process.exit(0);
}
main();
