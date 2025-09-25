import { NextRequest } from 'next/server';
import { getTournaments } from '@/lib/db/database-service';

export async function GET(request: NextRequest) {
  try {
    const tournaments = await getTournaments();
    return new Response(JSON.stringify(tournaments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tournaments' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}