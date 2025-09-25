import { NextRequest } from 'next/server';
import { testDatabaseConnection } from '@/lib/db/test-connection';

export async function GET(request: NextRequest) {
  try {
    const result = await testDatabaseConnection();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error testing database connection',
      error: (error as Error).message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}