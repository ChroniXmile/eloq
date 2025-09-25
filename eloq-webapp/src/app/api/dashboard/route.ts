import { NextRequest } from 'next/server';
import { getUserDashboard } from '@/lib/db/database-service';

export async function GET(request: NextRequest) {
  try {
    const dashboard = await getUserDashboard();
    
    return new Response(JSON.stringify(dashboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user dashboard' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}