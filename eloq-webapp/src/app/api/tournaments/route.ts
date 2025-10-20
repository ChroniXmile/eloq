import { NextRequest, NextResponse } from 'next/server';
import { createTournament, getTournaments, getUpcomingTournaments, TournamentFilters } from '@/lib/db/database-service';
import { parseTournamentPayload, STATUS_VALUES } from './shared';

const isStatusValue = (value: string): boolean => STATUS_VALUES.includes(value as (typeof STATUS_VALUES)[number]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get('status');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const filters: TournamentFilters = {};
    const errors: string[] = [];

    if (statusParam) {
      if (isStatusValue(statusParam)) {
        filters.status = statusParam as TournamentFilters['status'];
      } else {
        errors.push('Invalid status filter.');
      }
    }

    if (fromParam) {
      const fromDate = new Date(fromParam);
      if (Number.isNaN(fromDate.getTime())) {
        errors.push('Invalid from date.');
      } else {
        filters.from = fromDate;
      }
    }

    if (toParam) {
      const toDate = new Date(toParam);
      if (Number.isNaN(toDate.getTime())) {
        errors.push('Invalid to date.');
      } else {
        filters.to = toDate;
      }
    }

    if (filters.from && filters.to && filters.from > filters.to) {
      errors.push('From date must be earlier than to date.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const tournaments =
      filters.status === 'upcoming' && !filters.from && !filters.to
        ? await getUpcomingTournaments()
        : await getTournaments(filters);
    return NextResponse.json(tournaments, { status: 200 });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json(
      { success: false, errors: ['Failed to fetch tournaments.'] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, errors } = parseTournamentPayload(body);

    if (errors.length > 0 || !data) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const tournament = await createTournament(data);
    return NextResponse.json({ success: true, tournament }, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { success: false, errors: ['Failed to create tournament.'] },
      { status: 500 }
    );
  }
}
