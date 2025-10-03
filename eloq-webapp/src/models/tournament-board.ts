// Tournament Board models for double elimination brackets
// This file contains interfaces and types for tournament bracket visualization

export type BracketType = 'winners' | 'losers' | 'final';
export type MatchStatus = 'upcoming' | 'in-progress' | 'completed' | 'bye';
export type PlayerPosition = 'top' | 'bottom';

export interface BracketPlayer {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  country?: string;
  seed?: number;
}

export interface BracketMatch {
  id: string;
  round: number;
  matchNumber: number;
  bracketType: BracketType;
  status: MatchStatus;

  // Player information
  player1?: BracketPlayer;
  player2?: BracketPlayer;

  // Match details
  tableNumber?: number;
  scheduledTime?: Date;
  startTime?: Date;
  endTime?: Date;

  // Scores
  player1Score?: number;
  player2Score?: number;
  player1Racks?: number;
  player2Racks?: number;

  // Next match progression
  nextMatchId?: string;
  previousMatchId?: string;

  // Betting odds (for major tournaments)
  player1Odds?: number;
  player2Odds?: number;
}

export interface BracketRound {
  roundNumber: number;
  bracketType: BracketType;
  matches: BracketMatch[];
  title: string;
}

export interface TournamentBracket {
  id: string;
  tournamentId: string;
  tournamentName: string;
  totalPlayers: number;
  currentRound: number;

  // Bracket structure
  winnersBracket: BracketRound[];
  losersBracket: BracketRound[];
  finals: BracketMatch[];

  // Tournament metadata
  status: 'setup' | 'in-progress' | 'completed';
  lastUpdated: Date;
  bettingEnabled: boolean;
}

export interface BracketNavigationState {
  currentRound: number;
  highlightedPlayerId?: string;
  highlightedMatchId?: string;
  zoomLevel: number;
  scrollPosition: { x: number; y: number };
  searchTerm: string;
  searchResults: string[]; // Match IDs or Player IDs
}

export interface BracketUIConfig {
  cellWidth: number;
  cellHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  roundSpacing: number;
  fontSize: {
    playerName: number;
    matchInfo: number;
    roundTitle: number;
  };
  colors: {
    background: string;
    border: string;
    text: string;
    highlight: string;
    winner: string;
    loser: string;
  };
}

// Utility functions for bracket calculations
export function calculateBracketRounds(playerCount: number): number {
  return Math.ceil(Math.log2(playerCount)) + 1;
}

export function getBracketDepth(playerCount: number): number {
  const rounds = calculateBracketRounds(playerCount);
  return rounds * 2 - 1; // Winners + Losers brackets
}

export function generateMatchId(
  tournamentId: string,
  round: number,
  matchNumber: number,
  bracketType: BracketType
): string {
  return `${tournamentId}-${bracketType}-r${round}-m${matchNumber}`;
}

export function parseMatchId(matchId: string): {
  tournamentId: string;
  bracketType: BracketType;
  round: number;
  matchNumber: number;
} {
  const parts = matchId.split('-');
  return {
    tournamentId: parts[0],
    bracketType: parts[1] as BracketType,
    round: parseInt(parts[2].replace('r', '')),
    matchNumber: parseInt(parts[3].replace('m', '')),
  };
}

export function getNextMatchPosition(
  currentRound: number,
  currentMatch: number,
  bracketType: BracketType
): { round: number; match: number } {
  if (bracketType === 'final') {
    return { round: currentRound, match: currentMatch };
  }

  const nextRound = currentRound + 1;
  const nextMatch = Math.ceil(currentMatch / 2);

  return { round: nextRound, match: nextMatch };
}

export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

export function getNearestPowerOfTwo(n: number): number {
  if (isPowerOfTwo(n)) return n;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

// Bracket generation helpers
export interface BracketGenerationOptions {
  playerCount: number;
  tournamentId: string;
  randomizeSeeds?: boolean;
}

export function generateEmptyBracket(
  options: BracketGenerationOptions
): TournamentBracket {
  const { playerCount, tournamentId, randomizeSeeds = false } = options;
  const totalRounds = calculateBracketRounds(playerCount);

  // Generate winners bracket rounds
  const winnersBracket: BracketRound[] = [];
  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = Math.pow(2, totalRounds - round);
    const matches: BracketMatch[] = [];

    for (let match = 1; match <= matchesInRound; match++) {
      matches.push({
        id: generateMatchId(tournamentId, round, match, 'winners'),
        round,
        matchNumber: match,
        bracketType: 'winners',
        status: 'upcoming',
      });
    }

    winnersBracket.push({
      roundNumber: round,
      bracketType: 'winners',
      matches,
      title: `Round ${round}`,
    });
  }

  // Generate losers bracket rounds (simplified for now)
  const losersBracket: BracketRound[] = [];

  // Generate finals
  const finals: BracketMatch[] = [
    {
      id: generateMatchId(tournamentId, totalRounds + 1, 1, 'final'),
      round: totalRounds + 1,
      matchNumber: 1,
      bracketType: 'final',
      status: 'upcoming',
    },
  ];

  return {
    id: `${tournamentId}-bracket`,
    tournamentId,
    tournamentName: '',
    totalPlayers: playerCount,
    currentRound: 1,
    winnersBracket,
    losersBracket,
    finals,
    status: 'setup',
    lastUpdated: new Date(),
    bettingEnabled: false,
  };
}
