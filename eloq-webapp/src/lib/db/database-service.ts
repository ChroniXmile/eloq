// Database service implementation
// This service provides data access to the PostgreSQL database

import { query } from '.';
import { Player } from '../../models/player';
import { Match } from '../../models/match';
import { Tournament } from '../../models/tournament';
import { User } from '../../models/user';
import { cache, generateCacheKey } from '../../lib/cache';

/**
 * Get all players from the database
 * @returns Promise resolving to array of players
 */
export async function getPlayers(): Promise<Player[]> {
  // Check cache first
  const cacheKey = generateCacheKey('players', []);
  const cachedResult = cache.get<Player[]>(cacheKey);
  
  if (cachedResult) {
    console.log('Returning cached players');
    return cachedResult;
  }

  try {
    const result = await query<Player>(`
      SELECT 
        id, name, rating, ranking, wins, losses, win_rate as "winRate", 
        avatar_url as "avatarUrl", join_date as "joinDate", 
        last_played as "lastPlayed", country, breaks, 
        highest_break as "highestBreak", description, 
        matches_played as "matchesPlayed", provisional
      FROM players
      ORDER BY ranking ASC
    `);
    
    // Convert string fields to numbers where needed
    const players = result.rows.map(player => ({
      ...player,
      rating: typeof player.rating === 'string' ? parseFloat(player.rating) : player.rating,
      ranking: typeof player.ranking === 'string' ? parseInt(player.ranking, 10) : player.ranking,
      wins: typeof player.wins === 'string' ? parseInt(player.wins, 10) : player.wins,
      losses: typeof player.losses === 'string' ? parseInt(player.losses, 10) : player.losses,
      winRate: typeof player.winRate === 'string' ? parseFloat(player.winRate) : player.winRate,
      breaks: typeof player.breaks === 'string' ? parseInt(player.breaks, 10) : player.breaks,
      highestBreak: typeof player.highestBreak === 'string' ? parseInt(player.highestBreak, 10) : player.highestBreak,
      matchesPlayed: typeof player.matchesPlayed === 'string' ? parseInt(player.matchesPlayed, 10) : player.matchesPlayed
    }));
    
    // Cache the result for 5 minutes
    cache.set(cacheKey, players, 5 * 60 * 1000);
    
    return players;
  } catch (error) {
    console.error('Error fetching players from database:', error);
    throw new Error('Failed to fetch players from database');
  }
}

/**
 * Get a player by ID from the database
 * @param id Player ID
 * @returns Promise resolving to player or undefined if not found
 */
export async function getPlayerById(id: string): Promise<Player | undefined> {
  // Check cache first
  const cacheKey = generateCacheKey('player', [id]);
  const cachedResult = cache.get<Player>(cacheKey);
  
  if (cachedResult) {
    console.log(`Returning cached player with ID: ${id}`);
    return cachedResult;
  }

  try {
    const result = await query<Player>(`
      SELECT 
        id, name, rating, ranking, wins, losses, win_rate as "winRate", 
        avatar_url as "avatarUrl", join_date as "joinDate", 
        last_played as "lastPlayed", country, breaks, 
        highest_break as "highestBreak", description, 
        matches_played as "matchesPlayed", provisional
      FROM players
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      // Cache the "not found" result to avoid repeated database queries
      cache.set(cacheKey, null, 2 * 60 * 1000); // Cache not-found for 2 minutes
      return undefined;
    }
    
    const player = result.rows[0];
    
    // Convert string fields to numbers where needed
    const playerResult = {
      ...player,
      rating: typeof player.rating === 'string' ? parseFloat(player.rating) : player.rating,
      ranking: typeof player.ranking === 'string' ? parseInt(player.ranking, 10) : player.ranking,
      wins: typeof player.wins === 'string' ? parseInt(player.wins, 10) : player.wins,
      losses: typeof player.losses === 'string' ? parseInt(player.losses, 10) : player.losses,
      winRate: typeof player.winRate === 'string' ? parseFloat(player.winRate) : player.winRate,
      breaks: typeof player.breaks === 'string' ? parseInt(player.breaks, 10) : player.breaks,
      highestBreak: typeof player.highestBreak === 'string' ? parseInt(player.highestBreak, 10) : player.highestBreak,
      matchesPlayed: typeof player.matchesPlayed === 'string' ? parseInt(player.matchesPlayed, 10) : player.matchesPlayed
    };
    
    // Cache the result for 10 minutes
    cache.set(cacheKey, playerResult, 10 * 60 * 1000);
    
    return playerResult;
  } catch (error) {
    console.error(`Error fetching player with ID ${id} from database:`, error);
    throw new Error(`Failed to fetch player with ID ${id} from database`);
  }
}

/**
 * Get player rating history
 * @param playerId Player ID
 * @returns Promise resolving to array of rating history entries
 */
export async function getPlayerRatingHistory(playerId: string): Promise<{
  date: Date;
  matchId: string;
  opponent: string;
  opponentRating: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  event: string;
}[]> {
  try {
    // This would require a more complex query involving matches and players tables
    // For now, we'll return an empty array as this would need a ratings history table
    // in a full implementation
    return [];
  } catch (error) {
    console.error(`Error fetching rating history for player with ID ${playerId}:`, error);
    throw new Error(`Failed to fetch rating history for player with ID ${playerId}`);
  }
}

/**
 * Get all tournaments from the database
 * @returns Promise resolving to array of tournaments
 */
export async function getTournaments(): Promise<Tournament[]> {
  // Check cache first
  const cacheKey = generateCacheKey('tournaments', []);
  const cachedResult = cache.get<Tournament[]>(cacheKey);
  
  if (cachedResult) {
    console.log('Returning cached tournaments');
    return cachedResult;
  }

  try {
    const result = await query<Tournament>(`
      SELECT 
        id, name, date, location, prize_pool as "prizePool", tier, 
        field_avg_rating as "fieldAvgRating", participants, results, 
        status, description
      FROM tournaments
      ORDER BY date DESC
    `);
    
    // Parse JSON fields and convert numeric fields
    const tournaments = result.rows.map(tournament => ({
      ...tournament,
      fieldAvgRating: typeof tournament.fieldAvgRating === 'string' ? 
        parseFloat(tournament.fieldAvgRating) : tournament.fieldAvgRating,
      prizePool: typeof tournament.prizePool === 'string' ? 
        parseFloat(tournament.prizePool) : tournament.prizePool,
      results: typeof tournament.results === 'string' ? JSON.parse(tournament.results) : tournament.results,
      participants: Array.isArray(tournament.participants) ? tournament.participants : []
    }));
    
    // Cache the result for 10 minutes
    cache.set(cacheKey, tournaments, 10 * 60 * 1000);
    
    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments from database:', error);
    throw new Error('Failed to fetch tournaments from database');
  }
}

/**
 * Get a tournament by ID from the database
 * @param id Tournament ID
 * @returns Promise resolving to tournament or undefined if not found
 */
export async function getTournamentById(id: string): Promise<Tournament | undefined> {
  // Check cache first
  const cacheKey = generateCacheKey('tournament', [id]);
  const cachedResult = cache.get<Tournament>(cacheKey);
  
  if (cachedResult) {
    console.log(`Returning cached tournament with ID: ${id}`);
    return cachedResult;
  }

  try {
    const result = await query<Tournament>(`
      SELECT 
        id, name, date, location, prize_pool as "prizePool", tier, 
        field_avg_rating as "fieldAvgRating", participants, results, 
        status, description
      FROM tournaments
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      // Cache the "not found" result to avoid repeated database queries
      cache.set(cacheKey, null, 2 * 60 * 1000); // Cache not-found for 2 minutes
      return undefined;
    }
    
    const tournament = result.rows[0];
    
    // Parse JSON fields and convert numeric fields
    const tournamentResult = {
      ...tournament,
      fieldAvgRating: typeof tournament.fieldAvgRating === 'string' ? 
        parseFloat(tournament.fieldAvgRating) : tournament.fieldAvgRating,
      prizePool: typeof tournament.prizePool === 'string' ? 
        parseFloat(tournament.prizePool) : tournament.prizePool,
      results: typeof tournament.results === 'string' ? JSON.parse(tournament.results) : tournament.results,
      participants: Array.isArray(tournament.participants) ? tournament.participants : []
    };
    
    // Cache the result for 10 minutes
    cache.set(cacheKey, tournamentResult, 10 * 60 * 1000);
    
    return tournamentResult;
  } catch (error) {
    console.error(`Error fetching tournament with ID ${id} from database:`, error);
    throw new Error(`Failed to fetch tournament with ID ${id} from database`);
  }
}

/**
 * Get user dashboard data from the database
 * @returns Promise resolving to dashboard data
 */
export async function getUserDashboard(): Promise<{
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
  try {
    // For simplicity, we'll get the first user
    const userResult = await query<User>(`
      SELECT 
        id, username, email, display_name as "displayName", avatar_url as "avatarUrl",
        favorite_players as "favoritePlayers", recently_viewed as "recentlyViewed",
        preferences, created_at as "createdAt", last_login as "lastLogin"
      FROM users
      LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      throw new Error('No users found in database');
    }
    
    const user = userResult.rows[0];
    
    // Parse JSON fields
    const parsedUser: User = {
      ...user,
      recentlyViewed: typeof user.recentlyViewed === 'string' ? JSON.parse(user.recentlyViewed) : user.recentlyViewed || [],
      preferences: typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences || {}
    };
    
    // Get favorite players
    let favoritePlayers: Player[] = [];
    if (parsedUser.favoritePlayers && parsedUser.favoritePlayers.length > 0) {
      const favoritePlayersResult = await query<Player>(`
        SELECT 
          id, name, rating, ranking, wins, losses, win_rate as "winRate", 
          avatar_url as "avatarUrl", join_date as "joinDate", 
          last_played as "lastPlayed", country, breaks, 
          highest_break as "highestBreak", description, 
          matches_played as "matchesPlayed", provisional
        FROM players
        WHERE id = ANY($1)
      `, [parsedUser.favoritePlayers]);
      
      // Apply the same conversion logic to favorite players
      favoritePlayers = favoritePlayersResult.rows.map(player => ({
        ...player,
        rating: typeof player.rating === 'string' ? parseFloat(player.rating) : player.rating,
        ranking: typeof player.ranking === 'string' ? parseInt(player.ranking, 10) : player.ranking,
        wins: typeof player.wins === 'string' ? parseInt(player.wins, 10) : player.wins,
        losses: typeof player.losses === 'string' ? parseInt(player.losses, 10) : player.losses,
        winRate: typeof player.winRate === 'string' ? parseFloat(player.winRate) : player.winRate,
        breaks: typeof player.breaks === 'string' ? parseInt(player.breaks, 10) : player.breaks,
        highestBreak: typeof player.highestBreak === 'string' ? parseInt(player.highestBreak, 10) : player.highestBreak,
        matchesPlayed: typeof player.matchesPlayed === 'string' ? parseInt(player.matchesPlayed, 10) : player.matchesPlayed
      }));
    }
    
    // Get recently viewed with details (simplified implementation)
    const recentlyViewed = parsedUser.recentlyViewed.map(item => ({
      ...item,
      name: 'Unknown' // Would need additional queries to get actual names
    }));
    
    // Get upcoming tournaments
    const upcomingTournamentsResult = await query<Tournament>(`
      SELECT 
        id, name, date, location, prize_pool as "prizePool", tier, 
        field_avg_rating as "fieldAvgRating", participants, results, 
        status, description
      FROM tournaments
      WHERE date >= NOW() AND status = 'upcoming'
      ORDER BY date ASC
      LIMIT 5
    `);
    
    // Parse JSON fields for tournaments and convert numeric fields
    const upcomingTournaments = upcomingTournamentsResult.rows.map(tournament => ({
      ...tournament,
      fieldAvgRating: typeof tournament.fieldAvgRating === 'string' ? 
        parseFloat(tournament.fieldAvgRating) : tournament.fieldAvgRating,
      prizePool: typeof tournament.prizePool === 'string' ? 
        parseFloat(tournament.prizePool) : tournament.prizePool,
      results: typeof tournament.results === 'string' ? JSON.parse(tournament.results) : tournament.results,
      participants: Array.isArray(tournament.participants) ? tournament.participants : []
    }));
    
    return {
      user: parsedUser,
      favoritePlayers,
      recentlyViewed,
      upcomingTournaments
    };
  } catch (error) {
    console.error('Error fetching user dashboard from database:', error);
    throw new Error('Failed to fetch user dashboard from database');
  }
}

/**
 * Clear player-related cache entries
 * @param playerId Optional player ID to clear specific player cache
 */
export function clearPlayerCache(playerId?: string): void {
  if (playerId) {
    // Clear specific player cache
    const playerCacheKey = generateCacheKey('player', [playerId]);
    cache.delete(playerCacheKey);
  } else {
    // Clear all player-related cache
    // This is a simple approach - in a real application, you'd want a more 
    // sophisticated approach to clear specific cache keys based on patterns
    cache.clear(); // For simplicity, clearing entire cache
  }
  
  // Always clear the all-players cache since it might be affected
  cache.delete(generateCacheKey('players', []));
}

/**
 * Clear tournament-related cache entries
 * @param tournamentId Optional tournament ID to clear specific tournament cache
 */
export function clearTournamentCache(tournamentId?: string): void {
  if (tournamentId) {
    // Clear specific tournament cache
    const tournamentCacheKey = generateCacheKey('tournament', [tournamentId]);
    cache.delete(tournamentCacheKey);
  } else {
    // Clear all tournament-related cache
    cache.delete(generateCacheKey('tournaments', []));
  }
}

export default {
  getPlayers,
  getPlayerById,
  getPlayerRatingHistory,
  getTournaments,
  getTournamentById,
  getUserDashboard,
  clearPlayerCache,
  clearTournamentCache
};