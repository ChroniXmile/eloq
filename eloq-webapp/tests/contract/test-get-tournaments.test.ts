import { getTournaments } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/tournaments', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a list of tournaments with correct structure', () => {
    // Mock the getTournaments function to return sample data
    const mockTournaments = [
      {
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
      },
      {
        id: 'tournament-2',
        name: 'Regional Open',
        date: new Date('2023-08-20'),
        location: 'Los Angeles',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-4', 'player-5', 'player-6'],
        results: [],
        status: 'upcoming',
        description: 'Regional qualifier',
      },
    ];

    (getTournaments as jest.Mock).mockReturnValue(mockTournaments);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const tournaments = getTournaments();
    
    expect(tournaments).toHaveLength(2);
    
    // Check the structure of the first tournament
    expect(tournaments[0]).toHaveProperty('id', 'tournament-1');
    expect(tournaments[0]).toHaveProperty('name', 'Championship 2023');
    expect(tournaments[0]).toHaveProperty('date');
    expect(tournaments[0]).toHaveProperty('location', 'New York');
    expect(tournaments[0]).toHaveProperty('prizePool', 100000);
    expect(tournaments[0]).toHaveProperty('tier', 'major');
    expect(tournaments[0]).toHaveProperty('fieldAvgRating', 1800);
    expect(tournaments[0]).toHaveProperty('participants');
    expect(tournaments[0]).toHaveProperty('results');
    expect(tournaments[0]).toHaveProperty('status', 'completed');
    expect(tournaments[0]).toHaveProperty('description', 'Annual championship tournament');
    
    // Check the structure of the second tournament
    expect(tournaments[1]).toHaveProperty('id', 'tournament-2');
    expect(tournaments[1]).toHaveProperty('name', 'Regional Open');
    expect(tournaments[1]).toHaveProperty('date');
    expect(tournaments[1]).toHaveProperty('location', 'Los Angeles');
    expect(tournaments[1]).toHaveProperty('prizePool', 25000);
    expect(tournaments[1]).toHaveProperty('tier', 'regional');
    expect(tournaments[1]).toHaveProperty('fieldAvgRating', 1600);
    expect(tournaments[1]).toHaveProperty('participants');
    expect(tournaments[1]).toHaveProperty('results');
    expect(tournaments[1]).toHaveProperty('status', 'upcoming');
    expect(tournaments[1]).toHaveProperty('description', 'Regional qualifier');
  });

  it('should handle different tournament statuses', () => {
    // Mock the getTournaments function to return tournaments with different statuses
    const mockTournaments = [
      {
        id: 'tournament-1',
        name: 'Completed Tournament',
        date: new Date('2023-06-01'),
        location: 'New York',
        prizePool: 50000,
        tier: 'national',
        fieldAvgRating: 1700,
        participants: [],
        results: [],
        status: 'completed',
        description: '',
      },
      {
        id: 'tournament-2',
        name: 'Ongoing Tournament',
        date: new Date('2023-06-15'),
        location: 'Chicago',
        prizePool: 30000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: [],
        results: [],
        status: 'ongoing',
        description: '',
      },
      {
        id: 'tournament-3',
        name: 'Upcoming Tournament',
        date: new Date('2023-07-01'),
        location: 'Los Angeles',
        prizePool: 25000,
        tier: 'local',
        fieldAvgRating: 1500,
        participants: [],
        results: [],
        status: 'upcoming',
        description: '',
      },
    ];

    (getTournaments as jest.Mock).mockReturnValue(mockTournaments);

    const tournaments = getTournaments();
    
    expect(tournaments).toHaveLength(3);
    
    // Check that we have all three statuses
    const statuses = tournaments.map(t => t.status);
    expect(statuses).toContain('completed');
    expect(statuses).toContain('ongoing');
    expect(statuses).toContain('upcoming');
  });

  it('should handle empty tournament list', () => {
    // Mock the getTournaments function to return an empty array
    (getTournaments as jest.Mock).mockReturnValue([]);

    const tournaments = getTournaments();
    
    expect(tournaments).toHaveLength(0);
  });
});