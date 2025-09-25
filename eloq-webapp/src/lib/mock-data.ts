// Mock data service for players, tournaments, and users
// This service provides mock data for the pool/billiards website

// Player mock data interface
export interface Player {
  id: string;
  name: string;
  rating: number;
  ranking: number;
  wins: number;
  losses: number;
  winRate: number;
  avatarUrl: string;
  joinDate: Date;
  lastPlayed: Date;
  country: string;
  breaks: number;
  highestBreak: number;
  description: string;
  matchesPlayed: number;
  provisional: boolean;
}

// Match mock data interface
export interface Match {
  id: string;
  date: Date;
  eventId: string;
  eventTier: 'local' | 'regional' | 'national' | 'major';
  format: 'alternate' | 'winner';
  discipline: string;
  ballsPerRack: number;
  raceTo: number;
  playerI: string;
  playerJ: string;
  racksI: number;
  racksJ: number;
  ballsI?: number;
  ballsJ?: number;
  fieldAvg?: number;
}

// Tournament mock data interface
export interface Tournament {
  id: string;
  name: string;
  date: Date;
  location: string;
  prizePool: number;
  tier: 'local' | 'regional' | 'national' | 'major';
  fieldAvgRating: number;
  participants: string[]; // Player IDs
  results: {
    playerId: string;
    position: number;
    prize: number;
  }[];
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
}

// User mock data interface
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  favoritePlayers: string[]; // Player IDs
  recentlyViewed: {
    entityType: string;
    entityId: string;
    timestamp: Date;
  }[];
  preferences: {
    [key: string]: any;
  };
  createdAt: Date;
  lastLogin: Date;
}

// Mock data arrays
let mockPlayers: Player[] = [];
let mockMatches: Match[] = [];
let mockTournaments: Tournament[] = [];
let mockUsers: User[] = [];

// Initialize mock data
export function initializeMockData() {
  // Create 100 mock players with ratings
  mockPlayers = Array.from({ length: 100 }, (_, i) => {
    const id = `player-${i + 1}`;
    const rating = Math.floor(Math.random() * 1000) + 1500; // Ratings between 1500-2500
    const wins = Math.floor(Math.random() * 500);
    const losses = Math.floor(Math.random() * 500);
    const matchesPlayed = wins + losses;
    const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;
    
    return {
      id,
      name: `Player ${i + 1}`,
      rating,
      ranking: i + 1,
      wins,
      losses,
      winRate,
      avatarUrl: `https://example.com/avatar-${i + 1}.jpg`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      lastPlayed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      country: ['USA', 'Canada', 'UK', 'Germany', 'Australia', 'China'][Math.floor(Math.random() * 6)],
      breaks: Math.floor(Math.random() * 100),
      highestBreak: Math.floor(Math.random() * 150),
      description: `This is player ${i + 1}, a professional pool player with ${matchesPlayed} matches played.`,
      matchesPlayed,
      provisional: matchesPlayed < 30,
    };
  });

  // Sort players by rating for accurate rankings
  mockPlayers.sort((a, b) => b.rating - a.rating);
  mockPlayers.forEach((player, index) => {
    player.ranking = index + 1;
  });

  // Create mock matches
  mockMatches = Array.from({ length: 50 }, (_, i) => {
    const player1Index = Math.floor(Math.random() * 100);
    let player2Index = Math.floor(Math.random() * 100);
    // Ensure player1 and player2 are different
    while (player2Index === player1Index) {
      player2Index = Math.floor(Math.random() * 100);
    }
    
    const playerI = mockPlayers[player1Index].id;
    const playerJ = mockPlayers[player2Index].id;
    const racksI = Math.floor(Math.random() * 10) + 1;
    const racksJ = Math.floor(Math.random() * 10) + 1;
    
    return {
      id: `match-${i + 1}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      eventId: `tournament-${Math.floor(Math.random() * 10) + 1}`,
      eventTier: ['local', 'regional', 'national', 'major'][Math.floor(Math.random() * 4)] as 'local' | 'regional' | 'national' | 'major',
      format: Math.random() > 0.5 ? 'alternate' : 'winner',
      discipline: ['9-ball', '10-ball', '8-ball'][Math.floor(Math.random() * 3)],
      ballsPerRack: [9, 10, 15][Math.floor(Math.random() * 3)],
      raceTo: [7, 9, 11][Math.floor(Math.random() * 3)],
      playerI,
      playerJ,
      racksI,
      racksJ,
      ballsI: Math.floor(Math.random() * 100),
      ballsJ: Math.floor(Math.random() * 100),
      fieldAvg: Math.floor(Math.random() * 500) + 1500,
    };
  });

  // Create mock tournaments
  mockTournaments = Array.from({ length: 10 }, (_, i) => {
    const participants = Array.from({ length: Math.floor(Math.random() * 32) + 16 }, () => {
      return mockPlayers[Math.floor(Math.random() * 100)].id;
    });
    
    return {
      id: `tournament-${i + 1}`,
      name: `Tournament ${i + 1}`,
      date: new Date(Date.now() + Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)),
      location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
      prizePool: Math.floor(Math.random() * 100000) + 10000,
      tier: ['local', 'regional', 'national', 'major'][Math.floor(Math.random() * 4)] as 'local' | 'regional' | 'national' | 'major',
      fieldAvgRating: Math.floor(Math.random() * 500) + 1500,
      participants,
      results: [],
      status: ['upcoming', 'ongoing', 'completed'][Math.floor(Math.random() * 3)] as 'upcoming' | 'ongoing' | 'completed',
      description: `This is tournament ${i + 1}, a ${['local', 'regional', 'national', 'major'][Math.floor(Math.random() * 4)]} level event.`,
    };
  });

  // Create mock users
  mockUsers = [
    {
      id: 'user-1',
      username: 'poolfan123',
      email: 'poolfan123@example.com',
      displayName: 'Pool Fan',
      avatarUrl: 'https://example.com/user-avatar.jpg',
      favoritePlayers: [mockPlayers[0].id, mockPlayers[1].id, mockPlayers[2].id],
      recentlyViewed: [
        {
          entityType: 'player',
          entityId: mockPlayers[0].id,
          timestamp: new Date(),
        },
        {
          entityType: 'tournament',
          entityId: mockTournaments[0].id,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ],
      preferences: {
        theme: 'dark',
        notifications: true,
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(),
    },
  ];
}

// Get all players
export function getPlayers(): Player[] {
  return [...mockPlayers];
}

// Get player by ID
export function getPlayerById(id: string): Player | undefined {
  return mockPlayers.find(player => player.id === id);
}

// Get player rating history
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
  // Find matches where this player participated
  const playerMatches = mockMatches.filter(
    match => match.playerI === playerId || match.playerJ === playerId
  );
  
  return playerMatches.map(match => {
    const isPlayerI = match.playerI === playerId;
    const opponentId = isPlayerI ? match.playerJ : match.playerI;
    const opponent = mockPlayers.find(p => p.id === opponentId);
    const ratingBefore = mockPlayers.find(p => p.id === playerId)?.rating || 1500;
    const ratingChange = Math.floor(Math.random() * 100) - 50; // Random rating change
    const ratingAfter = ratingBefore + ratingChange;
    
    return {
      date: match.date,
      matchId: match.id,
      opponent: opponent?.name || 'Unknown Player',
      opponentRating: opponent?.rating || 1500,
      ratingBefore,
      ratingAfter,
      ratingChange,
      event: `Tournament ${match.eventId}`,
    };
  });
}

// Get all tournaments
export function getTournaments(): Tournament[] {
  return [...mockTournaments];
}

// Get tournament by ID
export function getTournamentById(id: string): Tournament | undefined {
  return mockTournaments.find(tournament => tournament.id === id);
}

// Get user dashboard data
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
  const user = mockUsers[0]; // For simplicity, we're using the first user
  
  const favoritePlayers = user.favoritePlayers
    .map(id => mockPlayers.find(p => p.id === id))
    .filter(Boolean) as Player[];
  
  const recentlyViewed = user.recentlyViewed.map(item => {
    let name = 'Unknown';
    if (item.entityType === 'player') {
      const player = mockPlayers.find(p => p.id === item.entityId);
      name = player ? player.name : 'Unknown Player';
    } else if (item.entityType === 'tournament') {
      const tournament = mockTournaments.find(t => t.id === item.entityId);
      name = tournament ? tournament.name : 'Unknown Tournament';
    }
    return {
      ...item,
      name,
    };
  });
  
  const upcomingTournaments = mockTournaments.filter(
    tournament => tournament.status === 'upcoming'
  );
  
  return {
    user,
    favoritePlayers,
    recentlyViewed,
    upcomingTournaments,
  };
}

// Initialize mock data when the module is loaded
initializeMockData();