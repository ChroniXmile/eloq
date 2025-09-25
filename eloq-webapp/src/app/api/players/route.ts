import { NextRequest } from 'next/server';
import { getPlayers } from '@/lib/db/database-service';

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
    console.error('Error fetching players:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch players' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}