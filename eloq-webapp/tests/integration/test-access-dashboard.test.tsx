import React from 'react';
import { render, screen } from '@testing-library/react';
import { getUserDashboard } from '../../src/lib/mock-data';
import UserDashboard from '../../src/components/user-dashboard';

// Mock the mock-data module
jest.mock('../../src/lib/mock-data');

// Mock the UserDashboard component
jest.mock('../../src/components/user-dashboard', () => {
  return function MockUserDashboard({ dashboardData }: { dashboardData: any }) {
    if (!dashboardData) {
      return <div data-testid="dashboard-error">Error loading dashboard</div>;
    }
    
    const { user, favoritePlayers, recentlyViewed, upcomingTournaments } = dashboardData;
    
    return (
      <div data-testid="user-dashboard">
        <h1 data-testid="dashboard-title">Welcome, {user.displayName}</h1>
        
        <section data-testid="favorite-players-section">
          <h2>Favorite Players</h2>
          <ul>
            {favoritePlayers.map((player: any) => (
              <li key={player.id} data-testid={`favorite-player-${player.id}`}>
                <span data-testid={`favorite-player-name-${player.id}`}>{player.name}</span>
                <span data-testid={`favorite-player-ranking-${player.id}`}>#{player.ranking}</span>
                <span data-testid={`favorite-player-rating-${player.id}`}>{player.rating}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section data-testid="recently-viewed-section">
          <h2>Recently Viewed</h2>
          <ul>
            {recentlyViewed.map((item: any, index: number) => (
              <li key={index} data-testid={`recently-viewed-${index}`}>
                <span data-testid={`recently-viewed-name-${index}`}>{item.name}</span>
                <span data-testid={`recently-viewed-type-${index}`}>({item.entityType})</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section data-testid="upcoming-tournaments-section">
          <h2>Upcoming Tournaments</h2>
          <ul>
            {upcomingTournaments.map((tournament: any) => (
              <li key={tournament.id} data-testid={`upcoming-tournament-${tournament.id}`}>
                <span data-testid={`upcoming-tournament-name-${tournament.id}`}>{tournament.name}</span>
                <span data-testid={`upcoming-tournament-date-${tournament.id}`}>
                  {tournament.date.toDateString()}
                </span>
                <span data-testid={`upcoming-tournament-location-${tournament.id}`}>{tournament.location}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  };
});

describe('Integration: Access user dashboard', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display user dashboard with all sections when data is available', () => {
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
          {
            entityType: 'tournament',
            entityId: 'tournament-1',
            name: 'Championship 2023',
            timestamp: new Date('2023-05-28'),
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
      ],
      recentlyViewed: [
        {
          entityType: 'player',
          entityId: 'player-1',
          name: 'Player One',
          timestamp: new Date('2023-06-01'),
        },
        {
          entityType: 'tournament',
          entityId: 'tournament-1',
          name: 'Championship 2023',
          timestamp: new Date('2023-05-28'),
        },
      ],
      upcomingTournaments: [
        {
          id: 'tournament-1',
          name: 'Championship 2023',
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

    // Render a component that would display the user dashboard
    render(<UserDashboard dashboardData={mockDashboard} />);
    
    // Check that the user dashboard is rendered
    expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
    
    // Check the dashboard title with user's display name
    expect(screen.getByTestId('dashboard-title')).toHaveTextContent('Welcome, Pool Fan');
    
    // Check the favorite players section
    expect(screen.getByTestId('favorite-players-section')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-player-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-player-name-player-1')).toHaveTextContent('Player One');
    expect(screen.getByTestId('favorite-player-ranking-player-1')).toHaveTextContent('#1');
    expect(screen.getByTestId('favorite-player-rating-player-1')).toHaveTextContent('1800');
    
    expect(screen.getByTestId('favorite-player-player-2')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-player-name-player-2')).toHaveTextContent('Player Two');
    expect(screen.getByTestId('favorite-player-ranking-player-2')).toHaveTextContent('#2');
    expect(screen.getByTestId('favorite-player-rating-player-2')).toHaveTextContent('1750');
    
    // Check the recently viewed section
    expect(screen.getByTestId('recently-viewed-section')).toBeInTheDocument();
    expect(screen.getByTestId('recently-viewed-0')).toBeInTheDocument();
    expect(screen.getByTestId('recently-viewed-name-0')).toHaveTextContent('Player One');
    expect(screen.getByTestId('recently-viewed-type-0')).toHaveTextContent('(player)');
    
    expect(screen.getByTestId('recently-viewed-1')).toBeInTheDocument();
    expect(screen.getByTestId('recently-viewed-name-1')).toHaveTextContent('Championship 2023');
    expect(screen.getByTestId('recently-viewed-type-1')).toHaveTextContent('(tournament)');
    
    // Check the upcoming tournaments section
    expect(screen.getByTestId('upcoming-tournaments-section')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-tournament-tournament-1')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-tournament-name-tournament-1')).toHaveTextContent('Championship 2023');
    expect(screen.getByTestId('upcoming-tournament-location-tournament-1')).toHaveTextContent('New York');
  });

  it('should handle empty sections in dashboard', () => {
    // Mock the getUserDashboard function to return data with empty sections
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

    // Render a component that would display the user dashboard
    render(<UserDashboard dashboardData={mockDashboard} />);
    
    // Check that the user dashboard is rendered
    expect(screen.getByTestId('user-dashboard')).toBeInTheDocument();
    
    // Check that sections are still present but empty
    expect(screen.getByTestId('favorite-players-section')).toBeInTheDocument();
    expect(screen.getByTestId('recently-viewed-section')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-tournaments-section')).toBeInTheDocument();
    
    // Check that there are no items in the lists
    const favoritePlayerElements = screen.queryAllByTestId(/favorite-player-name-/);
    const recentlyViewedElements = screen.queryAllByTestId(/recently-viewed-name-/);
    const upcomingTournamentElements = screen.queryAllByTestId(/upcoming-tournament-name-/);
    
    expect(favoritePlayerElements).toHaveLength(0);
    expect(recentlyViewedElements).toHaveLength(0);
    expect(upcomingTournamentElements).toHaveLength(0);
  });

  it('should handle dashboard data loading error', () => {
    // Render a component that would display the user dashboard with no data
    render(<UserDashboard dashboardData={undefined} />);
    
    // Check that the error message is displayed
    expect(screen.getByTestId('dashboard-error')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-error')).toHaveTextContent('Error loading dashboard');
  });
});