// Mock data service implementation
// This service provides mock data for the pool/billiards website

import { Player, createPlayer } from '../models/player';
import { Match, createMatch } from '../models/match';
import { Tournament, createTournament } from '../models/tournament';
import { User, createUser } from '../models/user';
import { updatePlayerRankings } from '../services/player-service';
import { updateFieldAverageRating } from '../services/tournament-service';

// Mock data arrays
let mockPlayers: Player[] = [];
let mockMatches: Match[] = [];
let mockTournaments: Tournament[] = [];
let mockUsers: User[] = [];

/**
 * Get all players
 * @returns Array of all players
 */
export function getPlayers(): Player[] {
  return [...mockPlayers];
}

/**
 * Get a player by ID
 * @param id Player ID
 * @returns Player or undefined if not found
 */
export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find(player => player.id === id);
}

/**
 * Get top players by count
 * @param players Array of players
 * @param count Number of top players to return
 * @returns Array of top players
 */
export function getTopPlayers(players: Player[], count: number): Player[] {
  return players.slice(0, count);
}

/**
 * Get player rating history
 * @param playerId Player ID
 * @returns Array of rating history entries
 */
export function getPlayerRatingHistory(playerId: string): {
  date: Date;
  matchId: string;
  opponent: string;
  opponentRating: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  event: string;
}[] {
  // For mock data, we'll generate some sample rating history
  const player = getPlayerById(playerId);
  if (!player) {
    return [];
  }

  // Generate some mock rating history based on matches
  const playerMatches = mockMatches.filter(
    match => match.playerI === playerId || match.playerJ === playerId
  );

  return playerMatches.map((match, index) => {
    const isPlayerI = match.playerI === playerId;
    const opponentId = isPlayerI ? match.playerJ : match.playerI;
    const opponent = getPlayerById(opponentId);
    
    // Mock rating changes
    const ratingChange = isPlayerI ? 
      (match.racksI > match.racksJ ? 5 : -5) : 
      (match.racksJ > match.racksI ? 5 : -5);
      
    const ratingBefore = player.rating - (ratingChange * (index + 1));
    const ratingAfter = ratingBefore + ratingChange;

    return {
      date: match.date,
      matchId: match.id,
      opponent: opponent ? opponent.name : 'Unknown Player',
      opponentRating: opponent ? opponent.rating : 1500,
      ratingBefore,
      ratingAfter,
      ratingChange,
      event: `Match ${index + 1}`
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get all matches
 * @returns Array of all matches
 */
export function getMatches(): Match[] {
  return [...mockMatches];
}

/**
 * Get all tournaments
 * @returns Array of all tournaments
 */
export function getTournaments(): Tournament[] {
  return [...mockTournaments];
}

/**
 * Get a tournament by ID
 * @param id Tournament ID
 * @returns Tournament or undefined if not found
 */
export function getTournamentById(id: string): Tournament | undefined {
  return mockTournaments.find(tournament => tournament.id === id);
}

/**
 * Get all users
 * @returns Array of all users
 */
export function getUsers(): User[] {
  return [...mockUsers];
}

/**
 * Get user dashboard data
 * @returns Dashboard data
 */
export function getUserDashboard(): {
  user: User;
  favoritePlayers: Player[];
  recentlyViewed: {
    entityType: string;
    entityId: string;
    name: string;
    timestamp: Date;
  }[];
  upcomingTournaments: Tournament[];
} {
  if (mockUsers.length === 0) {
    throw new Error('No users found in mock data');
  }
  
  const user = mockUsers[0];
  const favoritePlayers = user.favoritePlayers
    ? mockPlayers.filter(player => user.favoritePlayers.includes(player.id))
    : [];
    
  const upcomingTournaments = mockTournaments.filter(
    tournament => tournament.status === 'upcoming'
  );

  return {
    user,
    favoritePlayers,
    recentlyViewed: user.recentlyViewed || [],
    upcomingTournaments
  };
}

/**
 * Initialize mock data with sample players, matches, tournaments, and users
 */
export function initializeMockData(): void {
  // Clear existing data
  mockPlayers = [];
  mockMatches = [];
  mockTournaments = [];
  mockUsers = [];

  // Create sample players
  const player1 = createPlayer('player-1', 'John Smith');
  player1.rating = 1850;
  player1.ranking = 1;
  player1.wins = 45;
  player1.losses = 5;
  player1.winRate = 90;
  player1.avatarUrl = 'https://example.com/avatar1.jpg';
  player1.joinDate = new Date('2023-01-15');
  player1.lastPlayed = new Date('2023-06-20');
  player1.country = 'USA';
  player1.breaks = 25;
  player1.highestBreak = 147;
  player1.description = 'Professional player with 10 years of experience. Known for consistent performance and strategic gameplay.';
  player1.matchesPlayed = 50;
  player1.provisional = false;

  const player2 = createPlayer('player-2', 'Emma Johnson');
  player2.rating = 1820;
  player2.ranking = 2;
  player2.wins = 42;
  player2.losses = 8;
  player2.winRate = 84;
  player2.avatarUrl = 'https://example.com/avatar2.jpg';
  player2.joinDate = new Date('2023-02-10');
  player2.lastPlayed = new Date('2023-06-18');
  player2.country = 'Canada';
  player2.breaks = 22;
  player2.highestBreak = 142;
  player2.description = 'Rising star in the pool scene. Strong tactical player with excellent ball control.';
  player2.matchesPlayed = 50;
  player2.provisional = false;

  const player3 = createPlayer('player-3', 'Michael Brown');
  player3.rating = 1790;
  player3.ranking = 3;
  player3.wins = 38;
  player3.losses = 12;
  player3.winRate = 76;
  player3.avatarUrl = 'https://example.com/avatar3.jpg';
  player3.joinDate = new Date('2023-03-05');
  player3.lastPlayed = new Date('2023-06-15');
  player3.country = 'UK';
  player3.breaks = 18;
  player3.highestBreak = 138;
  player3.description = 'Experienced player with a unique playing style. Known for clutch performances in tournaments.';
  player3.matchesPlayed = 50;
  player3.provisional = false;

  const player4 = createPlayer('player-4', 'Sarah Davis');
  player4.rating = 1760;
  player4.ranking = 4;
  player4.wins = 35;
  player4.losses = 15;
  player4.winRate = 70;
  player4.avatarUrl = 'https://example.com/avatar4.jpg';
  player4.joinDate = new Date('2023-04-01');
  player4.lastPlayed = new Date('2023-06-12');
  player4.country = 'Australia';
  player4.breaks = 15;
  player4.highestBreak = 135;
  player4.description = 'Aggressive player with powerful shots. Strong in break-and-run situations.';
  player4.matchesPlayed = 50;
  player4.provisional = false;

  const player5 = createPlayer('player-5', 'David Wilson');
  player5.rating = 1730;
  player5.ranking = 5;
  player5.wins = 32;
  player5.losses = 18;
  player5.winRate = 64;
  player5.avatarUrl = 'https://example.com/avatar5.jpg';
  player5.joinDate = new Date('2023-05-10');
  player5.lastPlayed = new Date('2023-06-10');
  player5.country = 'Germany';
  player5.breaks = 12;
  player5.highestBreak = 132;
  player5.description = 'Technical player with excellent safety play. Known for long safety battles.';
  player5.matchesPlayed = 50;
  player5.provisional = false;

  // Add more players with varying skill levels
  for (let i = 6; i <= 100; i++) {
    const player = createPlayer(`player-${i}`, `Player ${i}`);
    player.rating = 1800 - i * 5;
    player.ranking = i;
    player.wins = 50 - Math.floor(i / 2);
    player.losses = 10 + Math.floor(i / 2);
    player.winRate = Math.round(((50 - Math.floor(i / 2)) / (60 + i)) * 100);
    player.avatarUrl = `https://example.com/avatar${i}.jpg`;
    player.joinDate = new Date(`2023-01-${String((i % 30) + 1).padStart(2, '0')}`);
    player.lastPlayed = new Date(`2023-06-${String((i % 30) + 1).padStart(2, '0')}`);
    player.country = ['USA', 'Canada', 'UK', 'Germany', 'Australia'][i % 5];
    player.breaks = Math.floor(25 - i / 4);
    player.highestBreak = Math.floor(147 - i / 4);
    player.description = `Professional player ${i} with ${60 + i} matches played.`;
    player.matchesPlayed = 60 + i;
    player.provisional = i > 70; // Last 30 players are provisional
    mockPlayers.push(player);
  }

  // Add the top 5 players to the beginning of the array
  mockPlayers.unshift(player5, player4, player3, player2, player1);

  // Create sample tournaments
  const tournament1 = createTournament('tournament-1', 'National Championship');
  tournament1.date = new Date('2023-07-15');
  tournament1.location = 'Las Vegas, NV';
  tournament1.prizePool = 50000;
  tournament1.tier = 'national';
  tournament1.fieldAvgRating = 1750;
  tournament1.participants = mockPlayers.slice(0, 64).map(p => p.id);
  tournament1.results = [];
  tournament1.status = 'upcoming';
  tournament1.description = 'The premier national championship event featuring the top 64 players in the country.';

  const tournament2 = createTournament('tournament-2', 'Regional Open');
  tournament2.date = new Date('2023-06-25');
  tournament2.location = 'Chicago, IL';
  tournament2.prizePool = 15000;
  tournament2.tier = 'regional';
  tournament2.fieldAvgRating = 1650;
  tournament2.participants = mockPlayers.slice(10, 42).map(p => p.id);
  tournament2.results = [];
  tournament2.status = 'completed';
  tournament2.description = 'A competitive regional event with players from the Midwest region.';

  const tournament3 = createTournament('tournament-3', 'Local Weekly');
  tournament3.date = new Date('2023-06-18');
  tournament3.location = 'New York, NY';
  tournament3.prizePool = 2000;
  tournament3.tier = 'local';
  tournament3.fieldAvgRating = 1550;
  tournament3.participants = mockPlayers.slice(20, 50).map(p => p.id);
  tournament3.results = [];
  tournament3.status = 'completed';
  tournament3.description = 'Weekly local tournament with cash prizes for top finishers.';

  mockTournaments.push(tournament1, tournament2, tournament3);

  // Create sample matches
  const match1 = createMatch('match-1', 'player-1', 'player-2');
  match1.date = new Date('2023-06-18');
  match1.eventId = 'tournament-3';
  match1.eventTier = 'local';
  match1.format = 'winner';
  match1.discipline = '9-ball';
  match1.ballsPerRack = 9;
  match1.raceTo = 9;
  match1.racksI = 9;
  match1.racksJ = 7;
  match1.ballsI = 45;
  match1.ballsJ = 38;
  match1.fieldAvg = 1550;

  const match2 = createMatch('match-2', 'player-3', 'player-4');
  match2.date = new Date('2023-06-18');
  match2.eventId = 'tournament-3';
  match2.eventTier = 'local';
  match2.format = 'alternate';
  match2.discipline = '9-ball';
  match2.ballsPerRack = 9;
  match2.raceTo = 9;
  match2.racksI = 8;
  match2.racksJ = 9;
  match2.ballsI = 42;
  match2.ballsJ = 48;
  match2.fieldAvg = 1550;

  const match3 = createMatch('match-3', 'player-2', 'player-5');
  match3.date = new Date('2023-06-15');
  match3.eventId = 'tournament-2';
  match3.eventTier = 'regional';
  match3.format = 'winner';
  match3.discipline = '9-ball';
  match3.ballsPerRack = 9;
  match3.raceTo = 9;
  match3.racksI = 9;
  match3.racksJ = 6;
  match3.ballsI = 48;
  match3.ballsJ = 32;
  match3.fieldAvg = 1650;

  mockMatches.push(match1, match2, match3);

  // Update player rankings based on matches
  updatePlayerRankings(mockPlayers, mockMatches);

  // Update tournament field average ratings
  mockTournaments.forEach(tournament => {
    updateFieldAverageRating(tournament, mockPlayers);
  });

  // Create sample users
  const user1 = createUser('user-1', 'poolfan123', 'poolfan123@example.com');
  user1.displayName = 'Pool Fan';
  user1.avatarUrl = 'https://example.com/user-avatar.jpg';
  user1.favoritePlayers = ['player-1', 'player-2'];
  user1.recentlyViewed = [
    {
      entityType: 'player',
      entityId: 'player-1',
      name: 'John Smith',
      timestamp: new Date('2023-06-20'),
    },
    {
      entityType: 'tournament',
      entityId: 'tournament-1',
      name: 'National Championship',
      timestamp: new Date('2023-06-19'),
    },
  ];
  user1.preferences = {
    theme: 'dark',
    notifications: true,
    favoriteStats: ['rating', 'wins', 'winRate'],
  };
  user1.createdAt = new Date('2023-01-10');
  user1.lastLogin = new Date('2023-06-20');

  mockUsers.push(user1);
}

// Initialize mock data when the module is loaded
initializeMockData();