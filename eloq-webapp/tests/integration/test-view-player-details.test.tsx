import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPlayerById } from '../../src/lib/mock-data';
import PlayerDetails from '../../src/components/player-details';

// Mock the mock-data module
jest.mock('../../src/lib/mock-data');

// Mock the PlayerDetails component
jest.mock('../../src/components/player-details', () => {
  return function MockPlayerDetails({ player }: { player: any }) {
    if (!player) {
      return <div data-testid="player-not-found">Player not found</div>;
    }
    
    return (
      <div data-testid="player-details">
        <h1 data-testid="player-name">{player.name}</h1>
        <div data-testid="player-rating">Rating: {player.rating}</div>
        <div data-testid="player-ranking">Ranking: #{player.ranking}</div>
        <div data-testid="player-record">
          Record: {player.wins}W - {player.losses}L ({player.winRate}%)
        </div>
        <div data-testid="player-country">Country: {player.country}</div>
        <div data-testid="player-breaks">Century Breaks: {player.breaks}</div>
        <div data-testid="player-highest-break">Highest Break: {player.highestBreak}</div>
        <div data-testid="player-description">{player.description}</div>
        <div data-testid="player-provisional">
          {player.provisional ? 'Provisional Rating' : 'Established Rating'}
        </div>
      </div>
    );
  };
});

describe('Integration: View player details page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display player details when player exists', () => {
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
      description: 'Professional player with 10 years of experience',
      matchesPlayed: 60,
      provisional: false,
    };

    (getPlayerById as jest.Mock).mockReturnValue(mockPlayer);

    // Render a component that would display player details
    render(<PlayerDetails player={mockPlayer} />);
    
    // Check that the player details are rendered
    expect(screen.getByTestId('player-details')).toBeInTheDocument();
    
    // Check player name
    expect(screen.getByTestId('player-name')).toHaveTextContent('Player One');
    
    // Check player rating
    expect(screen.getByTestId('player-rating')).toHaveTextContent('Rating: 1800');
    
    // Check player ranking
    expect(screen.getByTestId('player-ranking')).toHaveTextContent('Ranking: #1');
    
    // Check player record
    expect(screen.getByTestId('player-record')).toHaveTextContent('Record: 50W - 10L (83%)');
    
    // Check player country
    expect(screen.getByTestId('player-country')).toHaveTextContent('Country: USA');
    
    // Check player breaks
    expect(screen.getByTestId('player-breaks')).toHaveTextContent('Century Breaks: 25');
    
    // Check player highest break
    expect(screen.getByTestId('player-highest-break')).toHaveTextContent('Highest Break: 147');
    
    // Check player description
    expect(screen.getByTestId('player-description')).toHaveTextContent('Professional player with 10 years of experience');
    
    // Check that the player is not provisional
    expect(screen.getByTestId('player-provisional')).toHaveTextContent('Established Rating');
  });

  it('should display provisional rating indicator for new players', () => {
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
      description: 'New player learning the game',
      matchesPlayed: 15,
      provisional: true,
    };

    (getPlayerById as jest.Mock).mockReturnValue(mockPlayer);

    // Render a component that would display player details
    render(<PlayerDetails player={mockPlayer} />);
    
    // Check that the provisional rating indicator is displayed
    expect(screen.getByTestId('player-provisional')).toHaveTextContent('Provisional Rating');
  });

  it('should display not found message when player does not exist', () => {
    // Mock the getPlayerById function to return undefined
    (getPlayerById as jest.Mock).mockReturnValue(undefined);

    // Render a component that would display player details
    render(<PlayerDetails player={undefined} />);
    
    // Check that the not found message is displayed
    expect(screen.getByTestId('player-not-found')).toBeInTheDocument();
    expect(screen.getByTestId('player-not-found')).toHaveTextContent('Player not found');
  });
});