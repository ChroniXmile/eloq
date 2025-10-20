import { parseTournamentPayload } from '@/app/api/tournaments/shared';

describe('parseTournamentPayload', () => {
  it('returns normalized data for a valid payload', () => {
    const payload = {
      name: 'Grand Championship',
      date: '2025-03-14T14:30:00Z',
      tier: 'national',
      status: 'upcoming',
      location: 'Las Vegas',
      description: 'Season finale',
      prizePool: '75000',
      fieldAvgRating: 1725,
      participants: ['player-1', ' player-2 '],
      results: [
        { playerId: 'player-1', position: 1, prize: 50000 },
        { playerId: 'player-2', position: 2, prize: 25000 },
      ],
    };

    const { data, errors } = parseTournamentPayload(payload);

    expect(errors).toEqual([]);
    expect(data).toBeDefined();
    expect(data?.name).toBe('Grand Championship');
    expect(data?.tier).toBe('national');
    expect(data?.status).toBe('upcoming');
    expect(data?.location).toBe('Las Vegas');
    expect(data?.description).toBe('Season finale');
    expect(data?.prizePool).toBe(75000);
    expect(data?.fieldAvgRating).toBe(1725);
    expect(data?.participants).toEqual(['player-1', 'player-2']);
    expect(data?.results).toEqual([
      { playerId: 'player-1', position: 1, prize: 50000 },
      { playerId: 'player-2', position: 2, prize: 25000 },
    ]);
  });

  it('collects validation errors for missing required fields', () => {
    const { data, errors } = parseTournamentPayload({});

    expect(data).toBeUndefined();
    expect(errors).toContain('Tournament name is required.');
    expect(errors).toContain('A valid tournament date is required.');
  });

  it('rejects invalid tier and status values', () => {
    const { errors } = parseTournamentPayload({
      name: 'Qualifier',
      date: '2025-04-01T10:00:00Z',
      tier: 'invalid-tier',
      status: 'invalid-status',
    });

    expect(errors).toContain('Tier must be one of local, regional, national, or major.');
    expect(errors).toContain('Status must be one of upcoming, ongoing, or completed.');
  });

  it('parses JSON encoded results arrays', () => {
    const payload = {
      name: 'City Open',
      date: '2025-05-02T12:00:00Z',
      tier: 'regional',
      status: 'upcoming',
      results: '[{"playerId":"player-3","position":1,"prize":15000}]',
    };

    const { data, errors } = parseTournamentPayload(payload);

    expect(errors).toEqual([]);
    expect(data?.results).toEqual([{ playerId: 'player-3', position: 1, prize: 15000 }]);
  });

  it('rejects negative numeric values', () => {
    const { errors } = parseTournamentPayload({
      name: 'Weekly Match',
      date: '2025-06-10T18:00:00Z',
      tier: 'local',
      status: 'upcoming',
      prizePool: -500,
      fieldAvgRating: -10,
    });

    expect(errors).toContain('Prize pool must be zero or greater.');
    expect(errors).toContain('Field average rating must be zero or greater.');
  });
});
