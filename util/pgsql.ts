import { neon } from '@neondatabase/serverless';

export function getPGSQLClient() {
  if (!process.env.PGSQL_DATABASE_URL) throw new Error('PGSQL_DATABASE_URL not set');
  return neon(process.env.PGSQL_DATABASE_URL); // Or your direct connection string
}
