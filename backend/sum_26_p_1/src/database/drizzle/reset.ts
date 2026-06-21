import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

const runReset = async () => {
  // Check for required environment variable
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Initialize drizzle with the pool
  const db = drizzle(pool);

  console.log('🗑️  Resetting database...');

  // Reset the database - removes all data from tables
  await reset(db, schema);

  console.log('✅ Database reset successfully');

  // Close the pool
  await pool.end();
};

// Run the reset function
if (require.main === module) {
  runReset()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Error resetting database:', error);
      process.exit(1);
    });
}

// Export for programmatic usage
export { runReset };
