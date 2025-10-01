import { NextRequest } from 'next/server';
import { getPlayers } from '@/lib/db/database-service';
import { getPlayers as getMockPlayers } from '@/services/mock-data-service';

export async function GET(request: NextRequest) {
  try {
    const players = await getPlayers();
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching players from database:', error);
    
    // Fallback to mock data
    try {
      const mockPlayers = getMockPlayers();
      return new Response(JSON.stringify(mockPlayers), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (mockError) {
      console.error('Error fetching mock players:', mockError);
    }
    
    return new Response(JSON.stringify({ error: 'Failed to fetch players' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}