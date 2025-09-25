// Migration runner script

import { runMigrations, rollbackMigrations } from './src/lib/db/migrations';
import migration001 from './src/lib/db/migrations/001-create-initial-schema';

const migrations = [migration001];

async function run() {
  const action = process.argv[2] || 'up';
  const count = parseInt(process.argv[3] || '1', 10);
  
  try {
    if (action === 'up') {
      await runMigrations(migrations);
    } else if (action === 'down') {
      await rollbackMigrations(migrations, count);
    } else {
      console.error('Invalid action. Use "up" or "down"');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();