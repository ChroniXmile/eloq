// Test database connection

import { testConnection } from './src/lib/db/config';
import { getPlayers } from './src/lib/db/database-service';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connection successful!');
    
    console.log('Testing data retrieval...');
    const players = await getPlayers();
    console.log(`Retrieved ${players.length} players from database`);
    
    console.log('Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing database:', error);
    process.exit(1);
  }
}

testDatabase();