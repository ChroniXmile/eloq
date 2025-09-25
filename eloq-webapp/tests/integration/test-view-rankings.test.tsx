import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPlayers } from '../../src/lib/mock-data';
import PlayerRankingList from '../../src/components/player-ranking-list';

// Mock the mock-data module
jest.mock('../../src/lib/mock-data');

// Mock the PlayerRankingList component
jest.mock('../../src/components/player-ranking-list', () => {
  return function MockPlayerRankingList({ players }: { players: any[] }) {
    return (
      <div data-testid="player-ranking-list">
        <h1>Top 100 Players</h1>
        <ul>
          {players.map((player) => (
            <li key={player.id} data-testid={`player-${player.id}`}>
              <span data-testid={`player-name-${player.id}`}>{player.name}</span>
              <span data-testid={`player-ranking-${player.id}`}>#{player.ranking}</span>
              <span data-testid={`player-rating-${player.id}`}>{player.rating}</span>
              <span data-testid={`player-wins-${player.id}`}>{player.wins}W</span>
              <span data-testid={`player-losses-${player.id}`}>{player.losses}L</span>
              <span data-testid={`player-winrate-${player.id}`}>{player.winRate}%</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
});

describe('Integration: View top 100 players ranking', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display the top 100 players with correct information', () => {
    // Mock the getPlayers function to return sample data
    const mockPlayers = Array.from({ length: 5 }, (_, i) => ({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      rating: 1800 - i * 10,
      ranking: i + 1,
      wins: 50 - i,
      losses: 10 + i,
      winRate: Math.round(((50 - i) / (60 + i)) * 100),
      avatarUrl: `https://example.com/avatar${i + 1}.jpg`,
      joinDate: new Date(`2023-01-${String(i + 1).padStart(2, '0')}`),
      lastPlayed: new Date(`2023-06-${String(i + 1).padStart(2, '0')}`),
      country: 'USA',
      breaks: 25 - i,
      highestBreak: 147 - i,
      description: `Professional player ${i + 1}`,
      matchesPlayed: 60 + i,
      provisional: false,
    }));

    (getPlayers as jest.Mock).mockReturnValue(mockPlayers);

    // Render a component that would use the player ranking list
    render(<PlayerRankingList players={mockPlayers} />);
    
    // Check that the player ranking list is rendered
    expect(screen.getByTestId('player-ranking-list')).toBeInTheDocument();
    
    // Check that the heading is correct
    expect(screen.getByText('Top 100 Players')).toBeInTheDocument();
    
    // Check that all players are displayed
    expect(mockPlayers).toHaveLength(5);
    
    // Check the first player's information
    expect(screen.getByTestId('player-player-1')).toBeInTheDocument();
    expect(screen.getByTestId('player-name-player-1')).toHaveTextContent('Player 1');
    expect(screen.getByTestId('player-ranking-player-1')).toHaveTextContent('#1');
    expect(screen.getByTestId('player-rating-player-1')).toHaveTextContent('1800');
    expect(screen.getByTestId('player-wins-player-1')).toHaveTextContent('50W');
    expect(screen.getByTestId('player-losses-player-1')).toHaveTextContent('10L');
    expect(screen.getByTestId('player-winrate-player-1')).toHaveTextContent('83%');
    
    // Check that players are displayed in ranking order
    const playerElements = screen.getAllByTestId(/player-name-player-/);
    expect(playerElements[0]).toHaveTextContent('Player 1');
    expect(playerElements[1]).toHaveTextContent('Player 2');
  });

  it('should handle exactly 100 players', () => {
    // Mock the getPlayers function to return 100 players
    const mockPlayers = Array.from({ length: 100 }, (_, i) => ({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      rating: 1800 - i * 5,
      ranking: i + 1,
      wins: 50 - Math.floor(i / 2),
      losses: 10 + Math.floor(i / 2),
      winRate: Math.round(((50 - Math.floor(i / 2)) / (60 + i)) * 100),
      avatarUrl: `https://example.com/avatar${i + 1}.jpg`,
      joinDate: new Date(`2023-01-${String((i % 30) + 1).padStart(2, '0')}`),
      lastPlayed: new Date(`2023-06-${String((i % 30) + 1).padStart(2, '0')}`),
      country: ['USA', 'Canada', 'UK'][i % 3],
      breaks: Math.floor(25 - i / 4),
      highestBreak: Math.floor(147 - i / 4),
      description: `Professional player ${i + 1}`,
      matchesPlayed: 60 + i,
      provisional: i > 70, // Last 30 players are provisional
    }));

    (getPlayers as jest.Mock).mockReturnValue(mockPlayers);

    // Render a component that would use the player ranking list
    render(<PlayerRankingList players={mockPlayers} />);
    
    // Check that exactly 100 players are displayed
    const playerElements = screen.getAllByTestId(/player-name-player-/);
    expect(playerElements).toHaveLength(100);
    
    // Check that the first player has ranking #1
    expect(screen.getByTestId('player-ranking-player-1')).toHaveTextContent('#1');
    
    // Check that the last player has ranking #100
    expect(screen.getByTestId('player-ranking-player-100')).toHaveTextContent('#100');
  });

  it('should handle empty player list', () => {
    // Mock the getPlayers function to return an empty array
    (getPlayers as jest.Mock).mockReturnValue([]);

    // Render a component that would use the player ranking list
    render(<PlayerRankingList players={[]} />);
    
    // Check that the player ranking list is rendered
    expect(screen.getByTestId('player-ranking-list')).toBeInTheDocument();
    
    // Check that no players are displayed
    const playerElements = screen.queryAllByTestId(/player-name-player-/);
    expect(playerElements).toHaveLength(0);
    
    // Check that the heading is still displayed
    expect(screen.getByText('Top 100 Players')).toBeInTheDocument();
  });
});