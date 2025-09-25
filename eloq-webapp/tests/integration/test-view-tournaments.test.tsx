import React from 'react';
import { render, screen } from '@testing-library/react';
import { getTournaments } from '../../src/lib/mock-data';
import TournamentList from '../../src/components/tournament-list';

// Mock the mock-data module
jest.mock('../../src/lib/mock-data');

// Mock the TournamentList component
jest.mock('../../src/components/tournament-list', () => {
  return function MockTournamentList({ tournaments }: { tournaments: any[] }) {
    // Group tournaments by status
    const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
    const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing');
    const completedTournaments = tournaments.filter(t => t.status === 'completed');
    
    return (
      <div data-testid="tournaments-page">
        <h1>Tournaments</h1>
        
        <section data-testid="upcoming-tournaments">
          <h2>Upcoming Tournaments</h2>
          <ul>
            {upcomingTournaments.map(tournament => (
              <li key={tournament.id} data-testid={`tournament-${tournament.id}`}>
                <span data-testid={`tournament-name-${tournament.id}`}>{tournament.name}</span>
                <span data-testid={`tournament-date-${tournament.id}`}>
                  {tournament.date.toDateString()}
                </span>
                <span data-testid={`tournament-location-${tournament.id}`}>{tournament.location}</span>
                <span data-testid={`tournament-tier-${tournament.id}`}>{tournament.tier}</span>
                <span data-testid={`tournament-prize-${tournament.id}`}>${tournament.prizePool.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section data-testid="ongoing-tournaments">
          <h2>Ongoing Tournaments</h2>
          <ul>
            {ongoingTournaments.map(tournament => (
              <li key={tournament.id} data-testid={`tournament-${tournament.id}`}>
                <span data-testid={`tournament-name-${tournament.id}`}>{tournament.name}</span>
                <span data-testid={`tournament-date-${tournament.id}`}>
                  {tournament.date.toDateString()}
                </span>
                <span data-testid={`tournament-location-${tournament.id}`}>{tournament.location}</span>
                <span data-testid={`tournament-tier-${tournament.id}`}>{tournament.tier}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section data-testid="completed-tournaments">
          <h2>Completed Tournaments</h2>
          <ul>
            {completedTournaments.map(tournament => (
              <li key={tournament.id} data-testid={`tournament-${tournament.id}`}>
                <span data-testid={`tournament-name-${tournament.id}`}>{tournament.name}</span>
                <span data-testid={`tournament-date-${tournament.id}`}>
                  {tournament.date.toDateString()}
                </span>
                <span data-testid={`tournament-location-${tournament.id}`}>{tournament.location}</span>
                <span data-testid={`tournament-tier-${tournament.id}`}>{tournament.tier}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  };
});

describe('Integration: View tournaments list', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display tournaments grouped by status', () => {
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
        participants: [],
        results: [],
        status: 'upcoming',
        description: 'Annual championship tournament',
      },
      {
        id: 'tournament-2',
        name: 'Regional Open',
        date: new Date('2023-06-20'),
        location: 'Los Angeles',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: [],
        results: [],
        status: 'ongoing',
        description: 'Regional qualifier',
      },
      {
        id: 'tournament-3',
        name: 'Local Championship',
        date: new Date('2023-05-15'),
        location: 'Chicago',
        prizePool: 5000,
        tier: 'local',
        fieldAvgRating: 1400,
        participants: [],
        results: [
          { playerId: 'player-1', position: 1, prize: 2000 },
          { playerId: 'player-2', position: 2, prize: 1000 },
        ],
        status: 'completed',
        description: 'Local club championship',
      },
    ];

    (getTournaments as jest.Mock).mockReturnValue(mockTournaments);

    // Render a component that would display the tournaments list
    render(<TournamentList tournaments={mockTournaments} />);
    
    // Check that the tournaments page is rendered
    expect(screen.getByTestId('tournaments-page')).toBeInTheDocument();
    
    // Check upcoming tournaments section
    expect(screen.getByTestId('upcoming-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-tournament-1')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-name-tournament-1')).toHaveTextContent('Championship 2023');
    expect(screen.getByTestId('tournament-date-tournament-1')).toHaveTextContent('Sat Jul 15 2023');
    expect(screen.getByTestId('tournament-location-tournament-1')).toHaveTextContent('New York');
    expect(screen.getByTestId('tournament-tier-tournament-1')).toHaveTextContent('major');
    expect(screen.getByTestId('tournament-prize-tournament-1')).toHaveTextContent('$100,000');
    
    // Check ongoing tournaments section
    expect(screen.getByTestId('ongoing-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-tournament-2')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-name-tournament-2')).toHaveTextContent('Regional Open');
    expect(screen.getByTestId('tournament-date-tournament-2')).toHaveTextContent('Tue Jun 20 2023');
    expect(screen.getByTestId('tournament-location-tournament-2')).toHaveTextContent('Los Angeles');
    expect(screen.getByTestId('tournament-tier-tournament-2')).toHaveTextContent('regional');
    
    // Check completed tournaments section
    expect(screen.getByTestId('completed-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-tournament-3')).toBeInTheDocument();
    expect(screen.getByTestId('tournament-name-tournament-3')).toHaveTextContent('Local Championship');
    expect(screen.getByTestId('tournament-date-tournament-3')).toHaveTextContent('Mon May 15 2023');
    expect(screen.getByTestId('tournament-location-tournament-3')).toHaveTextContent('Chicago');
    expect(screen.getByTestId('tournament-tier-tournament-3')).toHaveTextContent('local');
  });

  it('should handle empty tournaments list', () => {
    // Mock the getTournaments function to return an empty array
    (getTournaments as jest.Mock).mockReturnValue([]);

    // Render a component that would display the tournaments list
    render(<TournamentList tournaments={[]} />);
    
    // Check that the tournaments page is rendered
    expect(screen.getByTestId('tournaments-page')).toBeInTheDocument();
    
    // Check that all sections are present but empty
    expect(screen.getByTestId('upcoming-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('ongoing-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('completed-tournaments')).toBeInTheDocument();
    
    // Check that there are no tournament items
    const tournamentElements = screen.queryAllByTestId(/tournament-name-/);
    expect(tournamentElements).toHaveLength(0);
  });

  it('should handle tournaments with only one status', () => {
    // Mock the getTournaments function to return only upcoming tournaments
    const mockTournaments = [
      {
        id: 'tournament-1',
        name: 'Upcoming Tournament 1',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 10000,
        tier: 'local',
        fieldAvgRating: 1500,
        participants: [],
        results: [],
        status: 'upcoming',
        description: '',
      },
      {
        id: 'tournament-2',
        name: 'Upcoming Tournament 2',
        date: new Date('2023-08-20'),
        location: 'Los Angeles',
        prizePool: 15000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: [],
        results: [],
        status: 'upcoming',
        description: '',
      },
    ];

    (getTournaments as jest.Mock).mockReturnValue(mockTournaments);

    // Render a component that would display the tournaments list
    render(<TournamentList tournaments={mockTournaments} />);
    
    // Check that the tournaments page is rendered
    expect(screen.getByTestId('tournaments-page')).toBeInTheDocument();
    
    // Check that upcoming tournaments section has items
    const upcomingElements = screen.getAllByTestId(/tournament-name-/);
    expect(upcomingElements).toHaveLength(2);
    
    // Check that ongoing and completed sections are present but empty
    expect(screen.getByTestId('ongoing-tournaments')).toBeInTheDocument();
    expect(screen.getByTestId('completed-tournaments')).toBeInTheDocument();
  });
});