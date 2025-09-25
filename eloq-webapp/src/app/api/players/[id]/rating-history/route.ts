import { NextRequest } from 'next/server';
import { getPlayerRatingHistory } from '@/lib/db/database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ratingHistory = await getPlayerRatingHistory(params.id);
    
    return new Response(JSON.stringify(ratingHistory), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error fetching rating history for player with ID ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch rating history' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}