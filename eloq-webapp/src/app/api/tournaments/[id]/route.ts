// Tournament API route
// This API route handles requests for specific tournaments

import { NextRequest } from 'next/server';
import { getTournamentById } from '@/lib/db/database-service';
import { getTournamentById as getMockTournamentById } from '@/services/mock-data-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await getTournamentById(params.id);
    
    if (!tournament) {
      // Try mock data as fallback
      try {
        const mockTournament = getMockTournamentById(params.id);
        if (mockTournament) {
          return new Response(JSON.stringify(mockTournament), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (mockError) {
        console.error('Error fetching mock tournament:', mockError);
      }
      
      return new Response(JSON.stringify({ error: 'Tournament not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify(tournament), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error fetching tournament with ID ${params.id}:`, error);
    
    // Fallback to mock data
    try {
      const mockTournament = getMockTournamentById(params.id);
      if (mockTournament) {
        return new Response(JSON.stringify(mockTournament), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (mockError) {
      console.error('Error fetching mock tournament:', mockError);
    }
    
    return new Response(JSON.stringify({ error: 'Failed to fetch tournament' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}