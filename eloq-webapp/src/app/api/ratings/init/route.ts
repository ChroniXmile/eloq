// API route to initialize the database with Python-generated ratings
// This route can be called to initialize the database with player ratings from the Python script

import { NextRequest } from 'next/server';
import { initDatabaseFromPythonCSV } from '@/lib/db/init-from-python';
import { initializeDataConnection } from '@/lib/data-connection';

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDataConnection();
    
    // For now, we'll use a hardcoded path to the CSV file
    // In a production environment, this would be configurable or uploaded by the user
    const csvFilePath = './data/pool_final_ratings.csv';
    
    // Check if CSV file exists
    const fs = (await import('fs')).default;
    if (!fs.existsSync(csvFilePath)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Ratings CSV file not found',
          error: `File ${csvFilePath} does not exist`
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Initialize the database with player ratings from CSV
    const result = await initDatabaseFromPythonCSV(csvFilePath);
    
    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message,
          playerCount: result.playerCount
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message,
          error: result.error
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error initializing database with Python ratings:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: (error as Error).message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Allow GET requests for testing purposes
export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Database initialization endpoint. Send a POST request to initialize the database with Python-generated ratings.',
      usage: 'POST /api/ratings/init'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}