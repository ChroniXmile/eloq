// Database service implementation
// This service provides data access to the PostgreSQL database

import { randomUUID } from 'crypto';
import { query } from '.';
import { Player } from '../../models/player';
import { Match } from '../../models/match';
import { Tournament, TournamentResult, TournamentStatus, TournamentTier } from '../../models/tournament';
import { User } from '../../models/user';
import { cache, generateCacheKey } from '../../lib/cache';

type TournamentDbRow = Omit<Tournament, 'participants' | 'results' | 'description' | 'fieldAvgRating' | 'prizePool'> & {
  participants: string[] | null;
  results: unknown;
  description: string | null;
  fieldAvgRating: number | string | null;
  prizePool: number | string | null;
};

const parseTournamentResults = (value: unknown): TournamentResult[] => {
  if (Array.isArray(value)) {
    return value
      .filter((entry): entry is TournamentResult => {
        if (!entry || typeof entry !== 'object') {
          return false;
        }
        const record = entry as Record<string, unknown>;
        return (
          typeof record.playerId === 'string' &&
          typeof record.position === 'number' &&
          typeof record.prize === 'number'
        );
      })
      .map((entry) => entry as TournamentResult);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parseTournamentResults(parsed);
    } catch (error) {
      console.error('Failed to parse tournament results JSON', error);
      return [];
    }
  }

  if (value && typeof value === 'object') {
    return parseTournamentResults([value]);
  }

  return [];
};

const mapTournamentRow = (row: TournamentDbRow): Tournament => {
  const {
    date,
    location,
    participants,
    results,
    description,
    fieldAvgRating,
    prizePool,
    ...rest
  } = row;

  const dateValue = date instanceof Date ? date : new Date(date);
  const locationValue = location ?? '';

  return {
    ...rest,
    date: dateValue,
    location: locationValue,
    participants: Array.isArray(participants) ? participants : [],
    results: parseTournamentResults(results),
    description: description ?? '',
    fieldAvgRating:
      fieldAvgRating === null
        ? 0
        : typeof fieldAvgRating === 'string'
        ? parseFloat(fieldAvgRating)
        : fieldAvgRating,
    prizePool:
      prizePool === null
        ? 0
        : typeof prizePool === 'string'
        ? parseFloat(prizePool)
        : prizePool,
  };
};

export interface TournamentUpsertInput {
  name: string;
  date: Date;
  location?: string;
  prizePool?: number;
  tier: TournamentTier;
  fieldAvgRating?: number;
  participants?: string[];
  results?: TournamentResult[];
  status: TournamentStatus;
  description?: string;
}

export interface TournamentFilters {
  status?: TournamentStatus;
  from?: Date;
  to?: Date;
}

const upcomingWindowPastDays = 7;

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
export async function getTournaments(filters: TournamentFilters = {}): Promise<Tournament[]> {
  const useCache = !filters.status && !filters.from && !filters.to;
  const cacheKey = generateCacheKey('tournaments', []);

  if (useCache) {
    const cachedResult = cache.get<Tournament[]>(cacheKey);
    if (cachedResult) {
      console.log('Returning cached tournaments');
      return cachedResult;
    }
  }

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.status) {
      params.push(filters.status);
      conditions.push(`status = $${params.length}`);
    }

    if (filters.from) {
      params.push(filters.from);
      conditions.push(`date >= $${params.length}`);
    }

    if (filters.to) {
      params.push(filters.to);
      conditions.push(`date <= $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderDirection = filters.status === 'upcoming' ? 'ASC' : 'DESC';

    const result = await query<TournamentDbRow>(
      `SELECT 
        id, name, date, location, prize_pool as "prizePool", tier, 
        field_avg_rating as "fieldAvgRating", participants, results, 
        status, description
      FROM tournaments
      ${whereClause}
      ORDER BY date ${orderDirection}`,
      params
    );

    const tournaments = result.rows.map(mapTournamentRow);

    if (useCache) {
      cache.set(cacheKey, tournaments, 10 * 60 * 1000);
    }

    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments from database:', error);
    throw new Error('Failed to fetch tournaments from database');
  }
}

export async function getUpcomingTournaments(): Promise<Tournament[]> {
  const cacheKey = generateCacheKey('tournaments-upcoming', []);
  const cachedResult = cache.get<Tournament[]>(cacheKey);

  if (cachedResult) {
    console.log('Returning cached upcoming tournaments');
    return cachedResult;
  }

  try {
    const result = await query<TournamentDbRow>(
      `SELECT 
        id, name, date, location, prize_pool as "prizePool", tier,
        field_avg_rating as "fieldAvgRating", participants, results,
        status, description
      FROM tournaments
      WHERE (
        status = 'upcoming' AND date >= NOW() - INTERVAL '1 day'
      ) OR (
        status = 'ongoing' AND date >= NOW() - INTERVAL '${upcomingWindowPastDays} days'
      )
      ORDER BY date ASC`
    );

    const tournaments = result.rows.map(mapTournamentRow);

    cache.set(cacheKey, tournaments, 5 * 60 * 1000);

    return tournaments;
  } catch (error) {
    console.error('Error fetching upcoming tournaments from database:', error);
    throw new Error('Failed to fetch upcoming tournaments from database');
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
    const result = await query<TournamentDbRow>(`
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

    const tournament = mapTournamentRow(result.rows[0]);

    cache.set(cacheKey, tournament, 10 * 60 * 1000);

    return tournament;
  } catch (error) {
    console.error(`Error fetching tournament with ID ${id} from database:`, error);
    throw new Error(`Failed to fetch tournament with ID ${id} from database`);
  }
}

export async function createTournament(data: TournamentUpsertInput): Promise<Tournament> {
  const id = `tournament-${randomUUID()}`;

  try {
    const result = await query<TournamentDbRow>(
      `INSERT INTO tournaments (
        id, name, date, location, prize_pool, tier, field_avg_rating,
        participants, results, status, description
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING 
        id, name, date, location, prize_pool as "prizePool", tier,
        field_avg_rating as "fieldAvgRating", participants, results,
        status, description`,
      [
        id,
        data.name,
        data.date,
        data.location ?? null,
        data.prizePool ?? 0,
        data.tier,
        data.fieldAvgRating ?? 1500,
        data.participants && data.participants.length > 0 ? data.participants : null,
        JSON.stringify(data.results ?? []),
        data.status,
        data.description ?? null,
      ]
    );

    const tournament = mapTournamentRow(result.rows[0]);

    clearTournamentCache(id);

    return tournament;
  } catch (error) {
    console.error('Error creating tournament in database:', error);
    throw new Error('Failed to create tournament');
  }
}

export async function updateTournament(id: string, data: TournamentUpsertInput): Promise<Tournament | null> {
  try {
    const result = await query<TournamentDbRow>(
      `UPDATE tournaments SET
        name = $1,
        date = $2,
        location = $3,
        prize_pool = $4,
        tier = $5,
        field_avg_rating = $6,
        participants = $7,
        results = $8,
        status = $9,
        description = $10
      WHERE id = $11
      RETURNING 
        id, name, date, location, prize_pool as "prizePool", tier,
        field_avg_rating as "fieldAvgRating", participants, results,
        status, description`,
      [
        data.name,
        data.date,
        data.location ?? null,
        data.prizePool ?? 0,
        data.tier,
        data.fieldAvgRating ?? 1500,
        data.participants && data.participants.length > 0 ? data.participants : null,
        JSON.stringify(data.results ?? []),
        data.status,
        data.description ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const tournament = mapTournamentRow(result.rows[0]);

    clearTournamentCache(id);

    return tournament;
  } catch (error) {
    console.error(`Error updating tournament with ID ${id}:`, error);
    throw new Error('Failed to update tournament');
  }
}

export async function deleteTournament(id: string): Promise<boolean> {
  try {
    const result = await query(
      'DELETE FROM tournaments WHERE id = $1',
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      clearTournamentCache(id);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error deleting tournament with ID ${id}:`, error);
    throw new Error('Failed to delete tournament');
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
  }

  cache.delete(generateCacheKey('tournaments', []));
  cache.delete(generateCacheKey('tournaments-upcoming', []));
}

export default {
  getPlayers,
  getPlayerById,
  getPlayerRatingHistory,
  getTournaments,
  getUpcomingTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getUserDashboard,
  clearPlayerCache,
  clearTournamentCache
};
