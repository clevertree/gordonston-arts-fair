import { initDatabase } from '@util/models';

// Initialize database connection on the first import
let dbInitialized = false;

export async function ensureDatabase() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}
