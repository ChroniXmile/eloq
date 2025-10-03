// Tournament Board Demo Page
// Showcases the modern Tournament Board component with sample data

'use client';

import * as React from 'react';
import { EnhancedTournamentBoard } from '@/components/enhanced-tournament-board';
import {
  TournamentBracket,
  BracketPlayer,
  generateEmptyBracket,
  BracketMatch,
} from '@/models/tournament-board';

// Sample players data
const samplePlayers: BracketPlayer[] = [
  {
    id: '1',
    name: 'Alex "The Shark" Rodriguez',
    avatarUrl: '/avatars/user.jpg',
    rating: 1850,
    country: 'USA',
    seed: 1,
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatarUrl: '/avatars/shane.webp',
    rating: 1820,
    country: 'Brazil',
    seed: 2,
  },
  {
    id: '3',
    name: 'James "Ice" Wilson',
    avatarUrl: '/avatars/grain.webp',
    rating: 1790,
    country: 'Canada',
    seed: 3,
  },
  {
    id: '4',
    name: 'Yuki Tanaka',
    avatarUrl: '/avatars/iconpattern.png',
    rating: 1760,
    country: 'Japan',
    seed: 4,
  },
  {
    id: '5',
    name: 'Carlos Mendoza',
    rating: 1730,
    country: 'Mexico',
    seed: 5,
  },
  {
    id: '6',
    name: 'Sophie Dubois',
    rating: 1700,
    country: 'France',
    seed: 6,
  },
  {
    id: '7',
    name: 'David Kim',
    rating: 1670,
    country: 'South Korea',
    seed: 7,
  },
  {
    id: '8',
    name: 'Elena Petrova',
    rating: 1640,
    country: 'Russia',
    seed: 8,
  },
  {
    id: '9',
    name: 'Marcus Johnson',
    rating: 1610,
    country: 'USA',
  },
  {
    id: '10',
    name: 'Isabella Rossi',
    rating: 1580,
    country: 'Italy',
  },
  {
    id: '11',
    name: 'Ahmed Al-Rashid',
    rating: 1550,
    country: 'UAE',
  },
  {
    id: '12',
    name: 'Anna Kowalski',
    rating: 1520,
    country: 'Poland',
  },
  {
    id: '13',
    name: 'Robert Taylor',
    rating: 1490,
    country: 'Australia',
  },
  {
    id: '14',
    name: 'Chen Wei',
    rating: 1460,
    country: 'China',
  },
  {
    id: '15',
    name: 'Sarah Anderson',
    rating: 1430,
    country: 'UK',
  },
  {
    id: '16',
    name: 'Miguel Garcia',
    rating: 1400,
    country: 'Spain',
  },
];

// Generate sample tournament bracket
function generateSampleBracket(): TournamentBracket {
  const bracket = generateEmptyBracket({
    playerCount: 16,
    tournamentId: 'demo-tournament-2024',
    randomizeSeeds: false,
  });

  // Populate with sample players and matches
  const rounds = [1, 2, 3, 4]; // 4 rounds for 16 players

  // Winners bracket
  let matchCounter = 1;
  bracket.winnersBracket = rounds.map((roundNum, roundIndex) => {
    const matchesInRound = Math.pow(2, rounds.length - 1 - roundIndex);
    const matches: BracketMatch[] = [];

    for (let i = 0; i < matchesInRound; i++) {
      const player1Index = matchCounter * 2 - 2;
      const player2Index = matchCounter * 2 - 1;

      const player1 =
        player1Index < samplePlayers.length
          ? samplePlayers[player1Index]
          : undefined;
      const player2 =
        player2Index < samplePlayers.length
          ? samplePlayers[player2Index]
          : undefined;

      matches.push({
        id: `demo-winners-r${roundNum}-m${i + 1}`,
        round: roundNum,
        matchNumber: i + 1,
        bracketType: 'winners',
        status: roundNum === 1 ? 'upcoming' : 'upcoming',
        player1,
        player2,
        tableNumber: i + 1 + (roundNum - 1) * 8,
        scheduledTime: new Date(
          Date.now() + (roundNum - 1) * 2 * 60 * 60 * 1000
        ), // 2 hours between rounds
        player1Odds:
          player1 && player2
            ? player1.rating > player2.rating
              ? 1.8
              : 2.1
            : undefined,
        player2Odds:
          player1 && player2
            ? player2.rating > player1.rating
              ? 1.8
              : 2.1
            : undefined,
      });

      matchCounter++;
    }

    return {
      roundNumber: roundNum,
      bracketType: 'winners',
      matches,
      title: `Round ${roundNum}`,
    };
  });

  // Finals
  bracket.finals = [
    {
      id: 'demo-finals-1',
      round: 5,
      matchNumber: 1,
      bracketType: 'final',
      status: 'upcoming',
      tableNumber: 1,
      scheduledTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      player1Odds: 1.9,
      player2Odds: 1.9,
    },
  ];

  bracket.tournamentName = 'World Pool Championship 2024';
  bracket.status = 'in-progress';
  bracket.bettingEnabled = true;

  return bracket;
}

export default function TournamentBoardDemoPage() {
  const [bracket] = React.useState<TournamentBracket>(generateSampleBracket());
  const tournamentId = 'demo-tournament-2024';

  const handleMatchClick = (match: BracketMatch) => {
    console.log('Match clicked:', match);
    // In a real app, this would navigate to match details or open a modal
  };

  const handlePlayerClick = (player: BracketPlayer) => {
    console.log('Player clicked:', player);
    // In a real app, this would navigate to player profile
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tournament Board Demo</h1>
        <p className="text-muted-foreground">
          Interactive double elimination tournament bracket with real-time
          updates, mobile-first design, and modern features.
        </p>
      </div>

      <EnhancedTournamentBoard
        tournamentId={tournamentId}
        initialBracket={bracket}
        players={samplePlayers}
        onMatchClick={handleMatchClick}
        onPlayerClick={handlePlayerClick}
        className="h-[calc(100vh-200px)]"
      />

      {/* Feature highlights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🔍 Search & Highlight</h3>
          <p className="text-sm text-muted-foreground">
            Find players and matches instantly with visual highlighting
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">📱 Touch Optimized</h3>
          <p className="text-sm text-muted-foreground">
            Swipe, pinch, and tap gestures for mobile navigation
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">⚡ Real-time Updates</h3>
          <p className="text-sm text-muted-foreground">
            Live tournament updates via WebSocket connections
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">🎲 Betting Integration</h3>
          <p className="text-sm text-muted-foreground">
            Odds display for major tournaments (demo mode)
          </p>
        </div>
      </div>

      {/* Usage instructions */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Desktop Features:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Click matches to view details</li>
              <li>• Use zoom controls (+/-) to adjust view</li>
              <li>• Search for players in the search bar</li>
              <li>• Click round buttons for quick navigation</li>
              <li>• Use admin panel for tournament management</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Mobile Features:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Swipe horizontally to navigate rounds</li>
              <li>• Pinch to zoom in/out</li>
              <li>• Tap matches for details sheet</li>
              <li>• Auto-detects mobile view for optimization</li>
              <li>• Touch-friendly interface elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
