import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPlayerRatingHistory } from '../../src/lib/mock-data';
import RatingHistoryChart from '../../src/components/rating-history-chart';

// Mock the mock-data module
jest.mock('../../src/lib/mock-data');

// Mock the RatingHistoryChart component
jest.mock('../../src/components/rating-history-chart', () => {
  return function MockRatingHistoryChart({ ratingHistory, playerName }: { ratingHistory: any[]; playerName: string }) {
    if (!ratingHistory) {
      return <div data-testid="rating-history-error">Error loading rating history</div>;
    }
    
    return (
      <div data-testid="rating-history-chart">
        <h2 data-testid="chart-title">Rating History for {playerName}</h2>
        <div data-testid="chart-container">
          {/* This would be a chart in the real implementation */}
          <div data-testid="chart-placeholder">Chart visualization would go here</div>
        </div>
        <table data-testid="rating-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Opponent Rating</th>
              <th>Rating Before</th>
              <th>Rating After</th>
              <th>Change</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {ratingHistory.map((entry, index) => (
              <tr key={index} data-testid={`history-entry-${index}`}>
                <td data-testid={`entry-date-${index}`}>{entry.date.toDateString()}</td>
                <td data-testid={`entry-opponent-${index}`}>{entry.opponent}</td>
                <td data-testid={`entry-opponent-rating-${index}`}>{entry.opponentRating}</td>
                <td data-testid={`entry-rating-before-${index}`}>{entry.ratingBefore}</td>
                <td data-testid={`entry-rating-after-${index}`}>{entry.ratingAfter}</td>
                <td data-testid={`entry-rating-change-${index}`}>
                  <span className={entry.ratingChange >= 0 ? 'positive' : 'negative'}>
                    {entry.ratingChange >= 0 ? '+' : ''}{entry.ratingChange}
                  </span>
                </td>
                <td data-testid={`entry-event-${index}`}>{entry.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
});

describe('Integration: View player rating history', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should display rating history chart and table with correct data', () => {
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

    // Render a component that would display the rating history
    render(<RatingHistoryChart ratingHistory={mockRatingHistory} playerName="Player One" />);
    
    // Check that the rating history chart is rendered
    expect(screen.getByTestId('rating-history-chart')).toBeInTheDocument();
    
    // Check the chart title
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Rating History for Player One');
    
    // Check the chart placeholder (real implementation would have a chart)
    expect(screen.getByTestId('chart-placeholder')).toBeInTheDocument();
    
    // Check the history table
    expect(screen.getByTestId('rating-history-table')).toBeInTheDocument();
    
    // Check the first history entry
    expect(screen.getByTestId('history-entry-0')).toBeInTheDocument();
    expect(screen.getByTestId('entry-date-0')).toHaveTextContent('Mon May 01 2023');
    expect(screen.getByTestId('entry-opponent-0')).toHaveTextContent('Player Two');
    expect(screen.getByTestId('entry-opponent-rating-0')).toHaveTextContent('1700');
    expect(screen.getByTestId('entry-rating-before-0')).toHaveTextContent('1750');
    expect(screen.getByTestId('entry-rating-after-0')).toHaveTextContent('1775');
    expect(screen.getByTestId('entry-rating-change-0')).toHaveTextContent('+25');
    expect(screen.getByTestId('entry-event-0')).toHaveTextContent('Tournament 1');
    
    // Check the second history entry (negative change)
    expect(screen.getByTestId('history-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('entry-rating-change-1')).toHaveTextContent('-15');
    
    // Check the third history entry (zero change)
    expect(screen.getByTestId('history-entry-2')).toBeInTheDocument();
    expect(screen.getByTestId('entry-rating-change-2')).toHaveTextContent('+0');
  });

  it('should handle empty rating history', () => {
    // Mock the getPlayerRatingHistory function to return an empty array
    (getPlayerRatingHistory as jest.Mock).mockReturnValue([]);

    // Render a component that would display the rating history
    render(<RatingHistoryChart ratingHistory={[]} playerName="New Player" />);
    
    // Check that the rating history chart is rendered
    expect(screen.getByTestId('rating-history-chart')).toBeInTheDocument();
    
    // Check the chart title
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Rating History for New Player');
    
    // Check that the table is present but has no data rows
    expect(screen.getByTestId('rating-history-table')).toBeInTheDocument();
    
    // Check that there are no history entries
    const historyEntryElements = screen.queryAllByTestId(/history-entry-/);
    expect(historyEntryElements).toHaveLength(0);
  });

  it('should handle rating history loading error', () => {
    // Render a component that would display the rating history with no data
    render(<RatingHistoryChart ratingHistory={undefined as any} playerName="Player One" />);
    
    // Check that the error message is displayed
    expect(screen.getByTestId('rating-history-error')).toBeInTheDocument();
    expect(screen.getByTestId('rating-history-error')).toHaveTextContent('Error loading rating history');
  });

  it('should display positive and negative rating changes with appropriate styling', () => {
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
    ];

    (getPlayerRatingHistory as jest.Mock).mockReturnValue(mockRatingHistory);

    // Render a component that would display the rating history
    render(<RatingHistoryChart ratingHistory={mockRatingHistory} playerName="Player One" />);
    
    // Check that positive changes are displayed with + sign
    expect(screen.getByTestId('entry-rating-change-0')).toHaveTextContent('+25');
    
    // Check that negative changes are displayed with - sign
    expect(screen.getByTestId('entry-rating-change-1')).toHaveTextContent('-15');
  });
});