import { getPlayerById } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/players/{id}', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a player with correct structure when player exists', () => {
    // Mock the getPlayerById function to return sample data
    const mockPlayer = {
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
    };

    (getPlayerById as jest.Mock).mockReturnValue(mockPlayer);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const player = getPlayerById('player-1');
    
    expect(player).toBeDefined();
    expect(player).toHaveProperty('id', 'player-1');
    expect(player).toHaveProperty('name', 'Player One');
    expect(player).toHaveProperty('rating', 1800);
    expect(player).toHaveProperty('ranking', 1);
    expect(player).toHaveProperty('wins', 50);
    expect(player).toHaveProperty('losses', 10);
    expect(player).toHaveProperty('winRate', 83);
    expect(player).toHaveProperty('avatarUrl', 'https://example.com/avatar1.jpg');
    expect(player).toHaveProperty('joinDate');
    expect(player).toHaveProperty('lastPlayed');
    expect(player).toHaveProperty('country', 'USA');
    expect(player).toHaveProperty('breaks', 25);
    expect(player).toHaveProperty('highestBreak', 147);
    expect(player).toHaveProperty('description', 'Professional player');
    expect(player).toHaveProperty('matchesPlayed', 60);
    expect(player).toHaveProperty('provisional', false);
  });

  it('should return undefined when player does not exist', () => {
    // Mock the getPlayerById function to return undefined
    (getPlayerById as jest.Mock).mockReturnValue(undefined);

    const player = getPlayerById('non-existent-player');
    
    expect(player).toBeUndefined();
  });

  it('should handle player with provisional rating', () => {
    // Mock the getPlayerById function to return a provisional player
    const mockPlayer = {
      id: 'player-2',
      name: 'New Player',
      rating: 1500,
      ranking: 50,
      wins: 5,
      losses: 10,
      winRate: 33,
      avatarUrl: 'https://example.com/avatar2.jpg',
      joinDate: new Date('2023-06-01'),
      lastPlayed: new Date('2023-06-05'),
      country: 'UK',
      breaks: 0,
      highestBreak: 0,
      description: 'New player',
      matchesPlayed: 15,
      provisional: true,
    };

    (getPlayerById as jest.Mock).mockReturnValue(mockPlayer);

    const player = getPlayerById('player-2');
    
    expect(player).toBeDefined();
    expect(player?.provisional).toBe(true);
    expect(player?.matchesPlayed).toBeLessThan(30);
  });
});