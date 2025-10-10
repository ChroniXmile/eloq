// Script to test the database connection
// This script verifies that the database is accessible and can run queries

import { testConnection } from '../src/lib/db/config';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✓ Database connection successful!');
      console.log('✓ Database is accessible and can run queries');
      process.exit(0);
    } else {
      console.error('✗ Failed to connect to database');
      console.error('Please check your database configuration in .env.local');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error testing database connection:', error);
    process.exit(1);
  }
}

// Run the test if called directly
if (require.main === module) {
  testDatabaseConnection();
}

export default testDatabaseConnection;