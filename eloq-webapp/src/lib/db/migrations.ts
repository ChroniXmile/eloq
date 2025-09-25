// Migration system for database schema updates

import { query } from './db/config';

// Migration interface
interface Migration {
  id: number;
  name: string;
  up: () => Promise<void>;
  down?: () => Promise<void>;
}

// Migration history table creation
const createMigrationTable = async (): Promise<void> => {
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Get executed migrations
const getExecutedMigrations = async (): Promise<number[]> => {
  try {
    const result = await query<{ id: number }>('SELECT id FROM migrations ORDER BY id');
    return result.rows.map(row => row.id);
  } catch (error) {
    // If table doesn't exist yet, return empty array
    return [];
  }
};

// Record executed migration
const recordMigration = async (id: number, name: string): Promise<void> => {
  await query('INSERT INTO migrations (id, name) VALUES ($1, $2)', [id, name]);
};

// Remove migration record
const removeMigration = async (id: number): Promise<void> => {
  await query('DELETE FROM migrations WHERE id = $1', [id]);
};

// Run migrations
export const runMigrations = async (migrations: Migration[]): Promise<void> => {
  await createMigrationTable();
  const executedMigrations = await getExecutedMigrations();
  
  // Filter out already executed migrations
  const pendingMigrations = migrations.filter(m => !executedMigrations.includes(m.id));
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations');
    return;
  }
  
  console.log(`Running ${pendingMigrations.length} migrations...`);
  
  for (const migration of pendingMigrations) {
    try {
      console.log(`Running migration ${migration.id}: ${migration.name}`);
      await migration.up();
      await recordMigration(migration.id, migration.name);
      console.log(`Migration ${migration.id}: ${migration.name} completed successfully`);
    } catch (error) {
      console.error(`Error running migration ${migration.id}: ${migration.name}`, error);
      throw error;
    }
  }
  
  console.log('All migrations completed successfully');
};

// Rollback migrations (for development only)
export const rollbackMigrations = async (migrations: Migration[], count: number = 1): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();
  
  // Get the last N executed migrations
  const migrationsToRollback = migrations
    .filter(m => executedMigrations.includes(m.id))
    .sort((a, b) => b.id - a.id)
    .slice(0, count);
  
  if (migrationsToRollback.length === 0) {
    console.log('No migrations to rollback');
    return;
  }
  
  console.log(`Rolling back ${migrationsToRollback.length} migrations...`);
  
  for (const migration of migrationsToRollback) {
    try {
      console.log(`Rolling back migration ${migration.id}: ${migration.name}`);
      if (migration.down) {
        await migration.down();
      } else {
        console.log(`No rollback function for migration ${migration.id}: ${migration.name}`);
      }
      await removeMigration(migration.id);
      console.log(`Migration ${migration.id}: ${migration.name} rolled back successfully`);
    } catch (error) {
      console.error(`Error rolling back migration ${migration.id}: ${migration.name}`, error);
      throw error;
    }
  }
  
  console.log('All rollback operations completed successfully');
};

export default {
  runMigrations,
  rollbackMigrations
};