import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Missing required environment variable: DATABASE_URL');
  return drizzle(neon(databaseUrl), { schema });
}
