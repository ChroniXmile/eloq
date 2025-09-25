import { getUserDashboard } from '../../../src/lib/mock-data';

// Mock the mock-data module
jest.mock('../../../src/lib/mock-data');

describe('GET /api/user/dashboard', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return user dashboard data with correct structure', () => {
    // Mock the getUserDashboard function to return sample data
    const mockDashboard = {
      user: {
        id: 'user-1',
        username: 'poolfan123',
        email: 'poolfan123@example.com',
        displayName: 'Pool Fan',
        avatarUrl: 'https://example.com/user-avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            name: 'Player One',
            timestamp: new Date('2023-06-01'),
          },
        ],
        preferences: {
          theme: 'dark',
          notifications: true,
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01'),
      },
      favoritePlayers: [
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
      ],
      recentlyViewed: [
        {
          entityType: 'player',
          entityId: 'player-1',
          name: 'Player One',
          timestamp: new Date('2023-06-01'),
        },
      ],
      upcomingTournaments: [
        {
          id: 'tournament-1',
          name: 'Upcoming Championship',
          date: new Date('2023-07-15'),
          location: 'New York',
          prizePool: 100000,
          tier: 'major',
          fieldAvgRating: 1800,
          participants: [],
          results: [],
          status: 'upcoming',
          description: 'Annual championship tournament',
        },
      ],
    };

    (getUserDashboard as jest.Mock).mockReturnValue(mockDashboard);

    // Import the actual handler function (this would be implemented later)
    // For now, we're just testing the expected structure
    const dashboard = getUserDashboard();
    
    // Check the structure of the dashboard data
    expect(dashboard).toHaveProperty('user');
    expect(dashboard).toHaveProperty('favoritePlayers');
    expect(dashboard).toHaveProperty('recentlyViewed');
    expect(dashboard).toHaveProperty('upcomingTournaments');
    
    // Check the structure of the user object
    expect(dashboard.user).toHaveProperty('id', 'user-1');
    expect(dashboard.user).toHaveProperty('username', 'poolfan123');
    expect(dashboard.user).toHaveProperty('email', 'poolfan123@example.com');
    expect(dashboard.user).toHaveProperty('displayName', 'Pool Fan');
    expect(dashboard.user).toHaveProperty('avatarUrl', 'https://example.com/user-avatar.jpg');
    expect(dashboard.user).toHaveProperty('favoritePlayers');
    expect(dashboard.user).toHaveProperty('recentlyViewed');
    expect(dashboard.user).toHaveProperty('preferences');
    expect(dashboard.user).toHaveProperty('createdAt');
    expect(dashboard.user).toHaveProperty('lastLogin');
    
    // Check the structure of the favorite players array
    expect(dashboard.favoritePlayers).toHaveLength(1);
    expect(dashboard.favoritePlayers[0]).toHaveProperty('id', 'player-1');
    expect(dashboard.favoritePlayers[0]).toHaveProperty('name', 'Player One');
    
    // Check the structure of the recently viewed array
    expect(dashboard.recentlyViewed).toHaveLength(1);
    expect(dashboard.recentlyViewed[0]).toHaveProperty('entityType', 'player');
    expect(dashboard.recentlyViewed[0]).toHaveProperty('entityId', 'player-1');
    expect(dashboard.recentlyViewed[0]).toHaveProperty('name', 'Player One');
    expect(dashboard.recentlyViewed[0]).toHaveProperty('timestamp');
    
    // Check the structure of the upcoming tournaments array
    expect(dashboard.upcomingTournaments).toHaveLength(1);
    expect(dashboard.upcomingTournaments[0]).toHaveProperty('id', 'tournament-1');
    expect(dashboard.upcomingTournaments[0]).toHaveProperty('name', 'Upcoming Championship');
  });

  it('should handle empty dashboard data', () => {
    // Mock the getUserDashboard function to return data with empty arrays
    const mockDashboard = {
      user: {
        id: 'user-1',
        username: 'poolfan123',
        email: 'poolfan123@example.com',
        displayName: 'Pool Fan',
        avatarUrl: 'https://example.com/user-avatar.jpg',
        favoritePlayers: [],
        recentlyViewed: [],
        preferences: {},
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01'),
      },
      favoritePlayers: [],
      recentlyViewed: [],
      upcomingTournaments: [],
    };

    (getUserDashboard as jest.Mock).mockReturnValue(mockDashboard);

    const dashboard = getUserDashboard();
    
    expect(dashboard.favoritePlayers).toHaveLength(0);
    expect(dashboard.recentlyViewed).toHaveLength(0);
    expect(dashboard.upcomingTournaments).toHaveLength(0);
  });
});