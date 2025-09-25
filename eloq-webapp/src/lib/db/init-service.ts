// Database initialization service
// This service handles one-time database initialization

import { initDatabase } from '@/lib/db';
import dbInit from '@/lib/db/init';

let isInitialized = false;

/**
 * Initialize the database connection and tables
 * This function should only be called once
 */
export async function initializeDatabaseOnce(): Promise<void> {
  if (isInitialized) {
    console.log('Database already initialized');
    return;
  }

  try {
    console.log('Initializing database...');
    await initDatabase();
    
    // Create tables if they don't exist
    await dbInit.createTables();
    
    // Populate with mock data if tables are empty
    // Note: In a production environment, you might want to skip this
    await dbInit.populateMockData();
    
    isInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
}