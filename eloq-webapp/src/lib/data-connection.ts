// Data connection service
// This service connects the application services to the database
// Falls back to backup data if database connection fails

import { Player } from '../models/player';
import { Tournament } from '../models/tournament';
import { User } from '../models/user';
import * as backupService from '../lib/db/backup-service';
import * as mockDataService from '../services/mock-data-service';

let databaseConnected = false;
let databaseModules: {
  getPlayers: typeof import('../lib/db/database-service').getPlayers;
  getPlayerById: typeof import('../lib/db/database-service').getPlayerById;
  getPlayerRatingHistory: typeof import('../lib/db/database-service').getPlayerRatingHistory;
  getTournaments: typeof import('../lib/db/database-service').getTournaments;
  getUpcomingTournaments: typeof import('../lib/db/database-service').getUpcomingTournaments;
  getTournamentById: typeof import('../lib/db/database-service').getTournamentById;
  getUserDashboard: typeof import('../lib/db/database-service').getUserDashboard;
  initDatabase: typeof import('../lib/db').initDatabase;
} | null = null;

const normalizeTournamentRecords = (records: any[]): Tournament[] =>
  records.map((record) => {
    const parsedDate = record.date instanceof Date ? record.date : new Date(record.date);
    const rawDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const location = record.location ?? '';
    const prizePool = (() => {
      const value = record.prizePool ?? record.prize_pool;
      if (typeof value === 'number') {
        return value;
      }
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    })();
    const fieldAvg = (() => {
      const value = record.fieldAvgRating ?? record.field_avg_rating;
      if (typeof value === 'number') {
        return value;
      }
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    })();

    let results = record.results ?? [];
    if (typeof results === 'string') {
      try {
        results = JSON.parse(results);
      } catch (error) {
        results = [];
      }
    }

    const participants = Array.isArray(record.participants)
      ? record.participants
      : typeof record.participants === 'string'
      ? record.participants.split(',').map((entry: string) => entry.trim())
      : [];

    return {
      ...record,
      id: record.id,
      name: record.name ?? 'Untitled Tournament',
      date: rawDate,
      location,
      prizePool,
      tier: record.tier ?? 'local',
      fieldAvgRating: fieldAvg,
      participants,
      results,
      status: record.status ?? 'upcoming',
      description: record.description ?? '',
    } as Tournament;
  });

/**
 * Dynamically import database modules (only on server side)
 */
async function importDatabaseModules() {
  if (typeof window === 'undefined' && !databaseModules) {
    try {
      const dbService = await import('../lib/db/database-service');
      const db = await import('../lib/db');
      databaseModules = {
        getPlayers: dbService.getPlayers,
        getPlayerById: dbService.getPlayerById,
        getPlayerRatingHistory: dbService.getPlayerRatingHistory,
        getTournaments: dbService.getTournaments,
        getUpcomingTournaments: dbService.getUpcomingTournaments,
        getTournamentById: dbService.getTournamentById,
        getUserDashboard: dbService.getUserDashboard,
        initDatabase: db.initDatabase,
      };
    } catch (error) {
      console.error('Failed to import database modules:', error);
      databaseModules = null;
    }
  }
  return databaseModules;
}

/**
 * Attempt to initialize database connection
 */
async function tryInitializeDatabase(): Promise<boolean> {
  // Only attempt database connection on server side
  if (typeof window !== 'undefined') {
    return false;
  }

  try {
    const modules = await importDatabaseModules();
    if (modules) {
      await modules.initDatabase();
      databaseConnected = true;
      console.log('Database connected successfully');
      return true;
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    databaseConnected = false;
  }
  return false;
}

/**
 * Initialize data connection on first call
 */
async function initializeDataConnectionIfNeeded(): Promise<void> {
  if (!databaseConnected && typeof window === 'undefined') {
    await tryInitializeDatabase();
  }
}

/**
 * Get all players from the data source
 * @returns Promise resolving to array of players
 */
export async function fetchPlayers(): Promise<Player[]> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getPlayers();
    } catch (error) {
      console.error('Error fetching players from database, falling back to backup data:', error);
      // Fallback to backup data
      try {
        const backupData = await loadFallbackData();
        if (backupData) {
          return backupData.players;
        }
      } catch (backupError) {
        console.error('Error loading players from backup, falling back to mock data:', backupError);
      }
      
      // If backup fails, fallback to mock data
      try {
        return mockDataService.getPlayers();
      } catch (mockError) {
        console.error('Error fetching mock players:', mockError);
        // Return an empty array as the ultimate fallback
        return [];
      }
    }
  }
  
  // Fallback to backup data
  try {
    const backupData = await loadFallbackData();
    if (backupData) {
      return backupData.players;
    }
  } catch (backupError) {
    console.error('Error loading players from backup, falling back to mock data:', backupError);
  }
  
  // If backup fails, fallback to mock data
  try {
    return mockDataService.getPlayers();
  } catch (mockError) {
    console.error('Error fetching mock players:', mockError);
    // Return an empty array as the ultimate fallback
    return [];
  }
}

/**
 * Get a player by ID from the data source
 * @param id Player ID
 * @returns Promise resolving to player or undefined if not found
 */
export async function fetchPlayerById(id: string): Promise<Player | undefined> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getPlayerById(id);
    } catch (error) {
      console.error(`Error fetching player with ID ${id} from database, falling back to backup data:`, error);
      // Fallback to backup data
      try {
        const backupData = await loadFallbackData();
        if (backupData) {
          return backupData.players.find(p => p.id === id);
        }
      } catch (backupError) {
        console.error(`Error loading player with ID ${id} from backup, falling back to mock data:`, backupError);
      }
      
      // If backup fails, fallback to mock data
      try {
        return mockDataService.getPlayerById(id);
      } catch (mockError) {
        console.error(`Error fetching mock player with ID ${id}:`, mockError);
        // Return undefined as the ultimate fallback
        return undefined;
      }
    }
  }
  
  // Fallback to backup data
  try {
    const backupData = await loadFallbackData();
    if (backupData) {
      return backupData.players.find(p => p.id === id);
    }
  } catch (backupError) {
    console.error(`Error loading player with ID ${id} from backup, falling back to mock data:`, backupError);
  }
  
  // If backup fails, fallback to mock data
  try {
    return mockDataService.getPlayerById(id);
  } catch (mockError) {
    console.error(`Error fetching mock player with ID ${id}:`, mockError);
    // Return undefined as the ultimate fallback
    return undefined;
  }
}

/**
 * Get rating history for a player from the data source
 * @param playerId Player ID
 * @returns Promise resolving to array of rating history entries
 */
export async function fetchPlayerRatingHistory(playerId: string): Promise<{
  date: Date;
  matchId: string;
  opponent: string;
  opponentRating: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  event: string;
}[]> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getPlayerRatingHistory(playerId);
    } catch (error) {
      console.error(`Error fetching rating history for player with ID ${playerId} from database, falling back to mock data:`, error);
    }
  }
  
  // Fallback to mock data
  try {
    return mockDataService.getPlayerRatingHistory(playerId);
  } catch (mockError) {
    console.error(`Error fetching mock rating history for player with ID ${playerId}:`, mockError);
    // Return an empty array as the ultimate fallback
    return [];
  }
}

/**
 * Get all tournaments from the data source
 * @returns Promise resolving to array of tournaments
 */
export async function fetchTournaments(): Promise<Tournament[]> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getTournaments();
    } catch (error) {
      console.error('Error fetching tournaments from database, falling back to backup data:', error);
      // Fallback to backup data
      try {
        const backupData = await loadFallbackData();
        if (backupData) {
          return normalizeTournamentRecords(backupData.tournaments);
        }
      } catch (backupError) {
        console.error('Error loading tournaments from backup, falling back to mock data:', backupError);
      }
      
      // If backup fails, fallback to mock data
      try {
        return normalizeTournamentRecords(mockDataService.getTournaments());
      } catch (mockError) {
        console.error('Error fetching mock tournaments:', mockError);
        // Return an empty array as the ultimate fallback
        return [];
      }
    }
  }
  
  // Fallback to backup data
  try {
    const backupData = await loadFallbackData();
    if (backupData) {
      return normalizeTournamentRecords(backupData.tournaments);
    }
  } catch (backupError) {
    console.error('Error loading tournaments from backup, falling back to mock data:', backupError);
  }
  
  // If backup fails, fallback to mock data
  try {
    return normalizeTournamentRecords(mockDataService.getTournaments());
  } catch (mockError) {
    console.error('Error fetching mock tournaments:', mockError);
    // Return an empty array as the ultimate fallback
    return [];
  }
}

export async function fetchUpcomingTournaments(): Promise<Tournament[]> {
  await initializeDataConnectionIfNeeded();

  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getUpcomingTournaments();
    } catch (error) {
      console.error('Error fetching upcoming tournaments from database, falling back to backup data:', error);
    }
  }

  try {
    const tournaments = await fetchTournaments();
    const now = new Date();
    return tournaments.filter((tournament) => {
      const date = tournament.date instanceof Date ? tournament.date : new Date(tournament.date);
      if (Number.isNaN(date.getTime())) {
        return false;
      }
      return tournament.status === 'upcoming' || (tournament.status === 'ongoing' && date >= now);
    });
  } catch (error) {
    console.error('Error filtering upcoming tournaments:', error);
    return [];
  }
}

/**
 * Get a tournament by ID from the data source
 * @param id Tournament ID
 * @returns Promise resolving to tournament or undefined if not found
 */
export async function fetchTournamentById(id: string): Promise<Tournament | undefined> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getTournamentById(id);
    } catch (error) {
      console.error(`Error fetching tournament with ID ${id} from database, falling back to backup data:`, error);
      // Fallback to backup data
      try {
        const backupData = await loadFallbackData();
        if (backupData) {
          const normalized = normalizeTournamentRecords(backupData.tournaments);
          return normalized.find(t => t.id === id);
        }
      } catch (backupError) {
        console.error(`Error loading tournament with ID ${id} from backup, falling back to mock data:`, backupError);
      }
      
      // If backup fails, fallback to mock data
      try {
        return mockDataService.getTournamentById(id);
      } catch (mockError) {
        console.error(`Error fetching mock tournament with ID ${id}:`, mockError);
        // Return undefined as the ultimate fallback
        return undefined;
      }
    }
  }
  
  // Fallback to backup data
  try {
    const backupData = await loadFallbackData();
    if (backupData) {
      const normalized = normalizeTournamentRecords(backupData.tournaments);
      return normalized.find(t => t.id === id);
    }
  } catch (backupError) {
    console.error(`Error loading tournament with ID ${id} from backup, falling back to mock data:`, backupError);
  }
  
  // If backup fails, fallback to mock data
  try {
    return mockDataService.getTournamentById(id);
  } catch (mockError) {
    console.error(`Error fetching mock tournament with ID ${id}:`, mockError);
    // Return undefined as the ultimate fallback
    return undefined;
  }
}

/**
 * Get user dashboard data from the data source
 * @returns Promise resolving to dashboard data
 */
export async function fetchUserDashboard(): Promise<{
  user: User;
  favoritePlayers: Player[];
  recentlyViewed: {
    entityType: string;
    entityId: string;
    name: string;
    timestamp: Date;
  }[];
  upcomingTournaments: Tournament[];
}> {
  await initializeDataConnectionIfNeeded();
  
  if (databaseConnected && databaseModules) {
    try {
      return await databaseModules.getUserDashboard();
    } catch (error) {
      console.error('Error fetching user dashboard from database, falling back to backup data:', error);
      // Fallback to backup data
      try {
        const backupData = await loadFallbackData();
        if (backupData) {
          // For the dashboard, we'll use the first user from the backup and construct a basic dashboard
          const user = backupData.users[0] || {
            id: 'default',
            username: 'guest',
            email: 'guest@example.com',
            displayName: 'Guest User',
            avatarUrl: '',
            favoritePlayers: [],
            recentlyViewed: [],
            preferences: {},
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          
          return {
            user: user,
            favoritePlayers: user.favoritePlayers ? backupData.players.filter(p => 
              user.favoritePlayers.includes(p.id)
            ) : [],
            recentlyViewed: user.recentlyViewed || [],
            upcomingTournaments: backupData.tournaments.filter(
              t => t.status === 'upcoming'
            ),
          };
        }
      } catch (backupError) {
        console.error('Error loading user dashboard from backup, falling back to mock data:', backupError);
      }
      
      // If backup fails, fallback to mock data
      try {
        return mockDataService.getUserDashboard();
      } catch (mockError) {
        console.error('Error fetching mock user dashboard:', mockError);
        // Return a default dashboard as the ultimate fallback
        return {
          user: {
            id: 'default',
            username: 'guest',
            email: 'guest@example.com',
            displayName: 'Guest User',
            avatarUrl: '',
            favoritePlayers: [],
            recentlyViewed: [],
            preferences: {},
            createdAt: new Date(),
            lastLogin: new Date(),
          },
          favoritePlayers: [],
          recentlyViewed: [],
          upcomingTournaments: [],
        };
      }
    }
  }
  
  // Fallback to backup data
  try {
    const backupData = await loadFallbackData();
    if (backupData) {
      // For the dashboard, we'll use the first user from the backup and construct a basic dashboard
      const user = backupData.users[0] || {
        id: 'default',
        username: 'guest',
        email: 'guest@example.com',
        displayName: 'Guest User',
        avatarUrl: '',
        favoritePlayers: [],
        recentlyViewed: [],
        preferences: {},
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      return {
        user: user,
        favoritePlayers: user.favoritePlayers ? backupData.players.filter(p => 
          user.favoritePlayers.includes(p.id)
        ) : [],
        recentlyViewed: user.recentlyViewed || [],
        upcomingTournaments: backupData.tournaments.filter(
          t => t.status === 'upcoming'
        ),
      };
    }
  } catch (backupError) {
    console.error('Error loading user dashboard from backup, falling back to mock data:', backupError);
  }
  
  // If backup fails, fallback to mock data
  try {
    return mockDataService.getUserDashboard();
  } catch (mockError) {
    console.error('Error fetching mock user dashboard:', mockError);
    // Return a default dashboard as the ultimate fallback
    return {
      user: {
        id: 'default',
        username: 'guest',
        email: 'guest@example.com',
        displayName: 'Guest User',
        avatarUrl: '',
        favoritePlayers: [],
        recentlyViewed: [],
        preferences: {},
        createdAt: new Date(),
        lastLogin: new Date(),
      },
      favoritePlayers: [],
      recentlyViewed: [],
      upcomingTournaments: [],
    };
  }
}

/**
 * Initialize the data connection
 * @returns Promise resolving when initialization is complete
 */
export async function initializeDataConnection(): Promise<void> {
  await tryInitializeDatabase();
}

/**
 * Close the data connection
 * @returns Promise resolving when connection is closed
 */
export async function closeDataConnection(): Promise<void> {
  // In a real implementation, this might close database connections
  console.log('Data connection closed');
}

/** 
 * Load data from the latest backup file
 * @returns BackupData object or null if no backup available
 */
async function loadFallbackData(): Promise<{
  players: Player[];
  tournaments: Tournament[];
  users: User[];
} | null> {
  try {
    // Get the latest backup file
    const latestBackup = await backupService.getLatestBackup('./backups');
    
    if (!latestBackup) {
      console.log('No backup file found, falling back to mock data');
      return null;
    }
    
    // Read the backup file and parse its content
    const fs = (await import('fs')).default;
    const backupDataStr = fs.readFileSync(latestBackup, 'utf-8');
    const backupData = JSON.parse(backupDataStr);
    
    console.log(`Loaded fallback data from backup: ${latestBackup}`);
    return {
      players: backupData.players,
      tournaments: backupData.tournaments,
      users: backupData.users
    };
  } catch (error) {
    console.error('Error loading fallback data from backup:', error);
    return null;
  }
}

// Export types for convenience
export type { Player, Tournament, User };
