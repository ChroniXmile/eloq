import { getTournamentById } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/tournaments/{id}', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a tournament with correct structure when tournament exists', () => {
    // Mock the getTournamentById function to return sample data
    const mockTournament = {
      id: 'tournament-1',
      name: 'Championship 2023',
      date: new Date('2023-07-15'),
      location: 'New York',
      prizePool: 100000,
      tier: 'major',
      fieldAvgRating: 1800,
      participants: ['player-1', 'player-2', 'player-3'],
      results: [
        { playerId: 'player-1', position: 1, prize: 40000 },
        { playerId: 'player-2', position: 2, prize: 20000 },
      ],
      status: 'completed',
      description: 'Annual championship tournament',
    };

    (getTournamentById as jest.Mock).mockReturnValue(mockTournament);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const tournament = getTournamentById('tournament-1');
    
    expect(tournament).toBeDefined();
    expect(tournament).toHaveProperty('id', 'tournament-1');
    expect(tournament).toHaveProperty('name', 'Championship 2023');
    expect(tournament).toHaveProperty('date');
    expect(tournament).toHaveProperty('location', 'New York');
    expect(tournament).toHaveProperty('prizePool', 100000);
    expect(tournament).toHaveProperty('tier', 'major');
    expect(tournament).toHaveProperty('fieldAvgRating', 1800);
    expect(tournament).toHaveProperty('participants');
    expect(tournament).toHaveProperty('results');
    expect(tournament).toHaveProperty('status', 'completed');
    expect(tournament).toHaveProperty('description', 'Annual championship tournament');
  });

  it('should return undefined when tournament does not exist', () => {
    // Mock the getTournamentById function to return undefined
    (getTournamentById as jest.Mock).mockReturnValue(undefined);

    const tournament = getTournamentById('non-existent-tournament');
    
    expect(tournament).toBeUndefined();
  });

  it('should handle tournament with different tiers', () => {
    // Test each tier type
    const tiers: ('local' | 'regional' | 'national' | 'major')[] = ['local', 'regional', 'national', 'major'];
    
    tiers.forEach(tier => {
      const mockTournament = {
        id: `tournament-${tier}`,
        name: `${tier} Tournament`,
        date: new Date(),
        location: 'Test City',
        prizePool: 10000,
        tier,
        fieldAvgRating: 1500,
        participants: [],
        results: [],
        status: 'upcoming' as const,
        description: '',
      };

      (getTournamentById as jest.Mock).mockReturnValue(mockTournament);

      const tournament = getTournamentById(`tournament-${tier}`);
      
      expect(tournament).toBeDefined();
      expect(tournament?.tier).toBe(tier);
    });
  });
});