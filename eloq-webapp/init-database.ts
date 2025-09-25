// Script to initialize the database and populate it with mock data

import { createTables, populateMockData } from './src/lib/db/init';
import { testConnection } from './src/lib/db/config';

async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }
    
    console.log('Database connection successful!');
    
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully!');
    
    console.log('Populating database with mock data...');
    await populateMockData();
    console.log('Database populated with mock data successfully!');
    
    console.log('Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();