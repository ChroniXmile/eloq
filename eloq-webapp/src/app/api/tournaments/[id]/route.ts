import { NextRequest } from 'next/server';
import { getTournamentById } from '@/lib/db/database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await getTournamentById(params.id);
    
    if (!tournament) {
      return new Response(JSON.stringify({ error: 'Tournament not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
      },
      });
    }
    
    // Ensure numeric fields are properly converted
    const serializedTournament = {
      ...tournament,
      fieldAvgRating: typeof tournament.fieldAvgRating === 'string' ? 
        parseFloat(tournament.fieldAvgRating) : tournament.fieldAvgRating,
      prizePool: typeof tournament.prizePool === 'string' ? 
        parseFloat(tournament.prizePool) : tournament.prizePool,
      results: tournament.results ? 
        (typeof tournament.results === 'string' ? JSON.parse(tournament.results) : tournament.results) : [],
      participants: Array.isArray(tournament.participants) ? tournament.participants : []
    };
    
    return new Response(JSON.stringify(serializedTournament), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error fetching tournament with ID ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tournament' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}