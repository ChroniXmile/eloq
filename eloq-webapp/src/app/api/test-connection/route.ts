import { NextRequest } from 'next/server';
import { testConnection } from '@/lib/db/config';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Database connection successful' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Failed to connect to database' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
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