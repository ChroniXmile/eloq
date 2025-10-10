// Script to reset the database
// This script drops all tables and recreates them with mock data

import { dropTables, createTables, populateMockData } from '../src/lib/db/init';
import { testConnection } from '../src/lib/db/config';

async function resetDatabase() {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }
    
    console.log('Database connection successful!');
    
    console.log('Dropping existing database tables...');
    await dropTables();
    console.log('Database tables dropped successfully!');
    
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully!');
    
    console.log('Populating database with mock data...');
    await populateMockData();
    console.log('Database populated with mock data successfully!');
    
    console.log('Database reset completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset if called directly
if (require.main === module) {
  resetDatabase();
}

export default resetDatabase;