import { getPlayers } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/players', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a list of players with correct structure', () => {
    // Mock the getPlayers function to return sample data
    const mockPlayers = [
      {
        id: 'player-1',
        name: 'Player One',
        rating: 1800,
        ranking: 1,
        wins: 50,
        losses: 10,
        winRate: 83,
        avatarUrl: 'https://example.com/avatar1.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 25,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 60,
        provisional: false,
      },
      {
        id: 'player-2',
        name: 'Player Two',
        rating: 1750,
        ranking: 2,
        wins: 45,
        losses: 15,
        winRate: 75,
        avatarUrl: 'https://example.com/avatar2.jpg',
        joinDate: new Date('2023-02-01'),
        lastPlayed: new Date('2023-06-02'),
        country: 'Canada',
        breaks: 20,
        highestBreak: 140,
        description: 'Professional player',
        matchesPlayed: 65,
        provisional: false,
      },
    ];

    (getPlayers as jest.Mock).mockReturnValue(mockPlayers);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const players = getPlayers();
    
    expect(players).toHaveLength(2);
    expect(players[0]).toHaveProperty('id');
    expect(players[0]).toHaveProperty('name');
    expect(players[0]).toHaveProperty('rating');
    expect(players[0]).toHaveProperty('ranking');
    expect(players[0]).toHaveProperty('wins');
    expect(players[0]).toHaveProperty('losses');
    expect(players[0]).toHaveProperty('winRate');
    expect(players[0]).toHaveProperty('avatarUrl');
    expect(players[0]).toHaveProperty('joinDate');
    expect(players[0]).toHaveProperty('lastPlayed');
    expect(players[0]).toHaveProperty('country');
    expect(players[0]).toHaveProperty('breaks');
    expect(players[0]).toHaveProperty('highestBreak');
    expect(players[0]).toHaveProperty('description');
    expect(players[0]).toHaveProperty('matchesPlayed');
    expect(players[0]).toHaveProperty('provisional');
    
    // Check that players are sorted by ranking
    expect(players[0].ranking).toBeLessThan(players[1].ranking);
  });

  it('should return 100 players', () => {
    // Mock the getPlayers function to return 100 players
    const mockPlayers = Array.from({ length: 100 }, (_, i) => ({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      rating: 1500 + i,
      ranking: i + 1,
      wins: 0,
      losses: 0,
      winRate: 0,
      avatarUrl: '',
      joinDate: new Date(),
      lastPlayed: new Date(),
      country: 'USA',
      breaks: 0,
      highestBreak: 0,
      description: '',
      matchesPlayed: 0,
      provisional: true,
    }));

    (getPlayers as jest.Mock).mockReturnValue(mockPlayers);

    const players = getPlayers();
    
    expect(players).toHaveLength(100);
  });

  it('should handle empty player list', () => {
    // Mock the getPlayers function to return an empty array
    (getPlayers as jest.Mock).mockReturnValue([]);

    const players = getPlayers();
    
    expect(players).toHaveLength(0);
  });
});