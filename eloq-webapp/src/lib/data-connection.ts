// Data connection service
// This service connects the application services to the database
// Falls back to mock data if database connection fails

import { Player } from '../models/player';
import { Tournament } from '../models/tournament';
import { User } from '../models/user';
import * as mockDataService from '../services/mock-data-service';

let databaseConnected = false;
let databaseModules: {
  getPlayers: typeof import('../lib/db/database-service').getPlayers;
  getPlayerById: typeof import('../lib/db/database-service').getPlayerById;
  getPlayerRatingHistory: typeof import('../lib/db/database-service').getPlayerRatingHistory;
  getTournaments: typeof import('../lib/db/database-service').getTournaments;
  getTournamentById: typeof import('../lib/db/database-service').getTournamentById;
  getUserDashboard: typeof import('../lib/db/database-service').getUserDashboard;
  initDatabase: typeof import('../lib/db').initDatabase;
} | null = null;

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
      console.error('Error fetching players from database, falling back to mock data:', error);
    }
  }
  
  // Fallback to mock data
  return mockDataService.getPlayers();
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
      console.error(`Error fetching player with ID ${id} from database, falling back to mock data:`, error);
    }
  }
  
  // Fallback to mock data
  return mockDataService.getPlayerById(id);
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
  return mockDataService.getPlayerRatingHistory(playerId);
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
      console.error('Error fetching tournaments from database, falling back to mock data:', error);
    }
  }
  
  // Fallback to mock data
  return mockDataService.getTournaments();
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
      console.error(`Error fetching tournament with ID ${id} from database, falling back to mock data:`, error);
    }
  }
  
  // Fallback to mock data
  return mockDataService.getTournamentById(id);
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
      console.error('Error fetching user dashboard from database, falling back to mock data:', error);
    }
  }
  
  // Fallback to mock data
  return mockDataService.getUserDashboard();
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

// Export types for convenience
export type { Player, Tournament, User };