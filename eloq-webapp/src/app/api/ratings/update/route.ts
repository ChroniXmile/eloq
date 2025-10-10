// API route to trigger rating updates
// This route can be called to run the Python rating calculation and update player ratings in the database

import { NextRequest } from 'next/server';
import { updatePlayerRatings } from '@/lib/rating-coordinator';
import { initializeDataConnection } from '@/lib/data-connection';

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDataConnection();
    
    // For now, we'll use hardcoded paths to the CSV files
    // In a production environment, these would be configurable or uploaded by the user
    const matchesFile = './data/matches.csv';
    const seedsFile = './data/seeds.csv';
    
    // Check if matches file exists
    const fs = (await import('fs')).default;
    if (!fs.existsSync(matchesFile)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Matches file not found',
          error: `File ${matchesFile} does not exist`
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Run the rating update process
    const result = await updatePlayerRatings(matchesFile, seedsFile);
    
    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message
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
    console.error('Error updating ratings:', error);
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
      message: 'Rating update endpoint. Send a POST request to trigger rating updates.',
      usage: 'POST /api/ratings/update'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}