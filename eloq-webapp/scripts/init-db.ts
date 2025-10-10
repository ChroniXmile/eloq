#!/usr/bin/env tsx

// Script to initialize the database with sample data
// This script creates the database tables and populates them with sample data

import { initializeDataConnection } from '../src/lib/data-connection';
import { createTables, populateMockData } from '../src/lib/db/init';

async function main() {
  try {
    console.log('Initializing database...');
    
    // Initialize data connection
    await initializeDataConnection();
    
    // Create database tables
    console.log('Creating database tables...');
    await createTables();
    console.log('Database tables created successfully');
    
    // Populate with mock data
    console.log('Populating database with mock data...');
    await populateMockData();
    console.log('Database populated with mock data successfully');
    
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export default main;