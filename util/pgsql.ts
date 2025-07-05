import { neon } from '@neondatabase/serverless';

export function getPGSQLClient() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  return neon(process.env.DATABASE_URL); // Or your direct connection string
}
