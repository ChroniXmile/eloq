import { testConnection } from '@/lib/db/config';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('Database connection successful!');
      return { success: true, message: 'Database connected successfully' };
    } else {
      console.log('Failed to connect to database');
      return { success: false, message: 'Failed to connect to database' };
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, message: 'Database connection error', error: (error as Error).message };
  }
}