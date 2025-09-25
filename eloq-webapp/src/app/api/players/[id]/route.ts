import { NextRequest } from 'next/server';
import { getPlayerById } from '@/lib/db/database-service';
import { getPlayerById as getMockPlayerById } from '@/services/mock-data-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await getPlayerById(params.id);
    
    if (!player) {
      // Try mock data as fallback
      try {
        const mockPlayer = getMockPlayerById(params.id);
        if (mockPlayer) {
          return new Response(JSON.stringify(mockPlayer), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (mockError) {
        console.error('Error fetching mock player:', mockError);
      }
      
      return new Response(JSON.stringify({ error: 'Player not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify(player), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error fetching player with ID ${params.id}:`, error);
    
    // Fallback to mock data
    try {
      const mockPlayer = getMockPlayerById(params.id);
      if (mockPlayer) {
        return new Response(JSON.stringify(mockPlayer), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (mockError) {
      console.error('Error fetching mock player:', mockError);
    }
    
    return new Response(JSON.stringify({ error: 'Failed to fetch player' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}