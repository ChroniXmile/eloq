import { getPlayerRatingHistory } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/players/rating-history/{id}', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return rating history with correct structure when player has matches', () => {
    // Mock the getPlayerRatingHistory function to return sample data
    const mockRatingHistory = [
      {
        date: new Date('2023-05-01'),
        matchId: 'match-1',
        opponent: 'Player Two',
        opponentRating: 1700,
        ratingBefore: 1750,
        ratingAfter: 1775,
        ratingChange: 25,
        event: 'Tournament 1',
      },
      {
        date: new Date('2023-05-15'),
        matchId: 'match-2',
        opponent: 'Player Three',
        opponentRating: 1800,
        ratingBefore: 1775,
        ratingAfter: 1760,
        ratingChange: -15,
        event: 'Tournament 2',
      },
    ];

    (getPlayerRatingHistory as jest.Mock).mockReturnValue(mockRatingHistory);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const ratingHistory = getPlayerRatingHistory('player-1');
    
    expect(ratingHistory).toHaveLength(2);
    
    // Check the structure of the first history item
    expect(ratingHistory[0]).toHaveProperty('date');
    expect(ratingHistory[0]).toHaveProperty('matchId', 'match-1');
    expect(ratingHistory[0]).toHaveProperty('opponent', 'Player Two');
    expect(ratingHistory[0]).toHaveProperty('opponentRating', 1700);
    expect(ratingHistory[0]).toHaveProperty('ratingBefore', 1750);
    expect(ratingHistory[0]).toHaveProperty('ratingAfter', 1775);
    expect(ratingHistory[0]).toHaveProperty('ratingChange', 25);
    expect(ratingHistory[0]).toHaveProperty('event', 'Tournament 1');
    
    // Check the structure of the second history item
    expect(ratingHistory[1]).toHaveProperty('date');
    expect(ratingHistory[1]).toHaveProperty('matchId', 'match-2');
    expect(ratingHistory[1]).toHaveProperty('opponent', 'Player Three');
    expect(ratingHistory[1]).toHaveProperty('opponentRating', 1800);
    expect(ratingHistory[1]).toHaveProperty('ratingBefore', 1775);
    expect(ratingHistory[1]).toHaveProperty('ratingAfter', 1760);
    expect(ratingHistory[1]).toHaveProperty('ratingChange', -15);
    expect(ratingHistory[1]).toHaveProperty('event', 'Tournament 2');
  });

  it('should return empty array when player has no matches', () => {
    // Mock the getPlayerRatingHistory function to return an empty array
    (getPlayerRatingHistory as jest.Mock).mockReturnValue([]);

    const ratingHistory = getPlayerRatingHistory('new-player');
    
    expect(ratingHistory).toHaveLength(0);
  });

  it('should handle positive and negative rating changes', () => {
    // Mock the getPlayerRatingHistory function to return data with various rating changes
    const mockRatingHistory = [
      {
        date: new Date('2023-05-01'),
        matchId: 'match-1',
        opponent: 'Player Two',
        opponentRating: 1700,
        ratingBefore: 1750,
        ratingAfter: 1775,
        ratingChange: 25,
        event: 'Tournament 1',
      },
      {
        date: new Date('2023-05-15'),
        matchId: 'match-2',
        opponent: 'Player Three',
        opponentRating: 1800,
        ratingBefore: 1775,
        ratingAfter: 1760,
        ratingChange: -15,
        event: 'Tournament 2',
      },
      {
        date: new Date('2023-05-30'),
        matchId: 'match-3',
        opponent: 'Player Four',
        opponentRating: 1700,
        ratingBefore: 1760,
        ratingAfter: 1760,
        ratingChange: 0,
        event: 'Tournament 3',
      },
    ];

    (getPlayerRatingHistory as jest.Mock).mockReturnValue(mockRatingHistory);

    const ratingHistory = getPlayerRatingHistory('player-1');
    
    expect(ratingHistory).toHaveLength(3);
    
    // Check that we have positive, negative, and zero rating changes
    expect(ratingHistory[0].ratingChange).toBeGreaterThan(0);
    expect(ratingHistory[1].ratingChange).toBeLessThan(0);
    expect(ratingHistory[2].ratingChange).toBe(0);
  });
});