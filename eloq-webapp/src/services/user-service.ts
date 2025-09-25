// User service with dashboard data
// This service handles user-related operations including dashboard data management

import { User, addFavoritePlayer, removeFavoritePlayer, addRecentlyViewed, updatePreferences, updateLastLogin } from '../models/user';
import { Player } from '../models/player';
import { Tournament } from '../models/tournament';

/**
 * Get favorite players for a user
 * @param user User to get favorite players for
 * @param allPlayers Array of all players
 * @returns Array of favorite players
 */
export function getFavoritePlayers(user: User, allPlayers: Player[]): Player[] {
  return user.favoritePlayers
    .map(playerId => allPlayers.find(p => p.id === playerId))
    .filter((player): player is Player => player !== undefined);
}

/**
 * Get recently viewed items for a user with additional details
 * @param user User to get recently viewed items for
 * @param allPlayers Array of all players
 * @param allTournaments Array of all tournaments
 * @returns Array of recently viewed items with details
 */
export function getRecentlyViewedWithDetails(
  user: User,
  allPlayers: Player[],
  allTournaments: Tournament[]
): Array<{
  entityType: string;
  entityId: string;
  name: string;
  timestamp: Date;
}> {
  return user.recentlyViewed.map(item => {
    let name = 'Unknown';
    
    if (item.entityType === 'player') {
      const player = allPlayers.find(p => p.id === item.entityId);
      name = player ? player.name : 'Unknown Player';
    } else if (item.entityType === 'tournament') {
      const tournament = allTournaments.find(t => t.id === item.entityId);
      name = tournament ? tournament.name : 'Unknown Tournament';
    }
    
    return {
      ...item,
      name
    };
  });
}

/**
 * Get upcoming tournaments for a user's dashboard
 * @param allTournaments Array of all tournaments
 * @param limit Maximum number of tournaments to return (default: 5)
 * @returns Upcoming tournaments
 */
export function getUpcomingTournamentsForDashboard(
  allTournaments: Tournament[],
  limit: number = 5
): Tournament[] {
  const now = new Date();
  return allTournaments
    .filter(tournament => tournament.date >= now && tournament.status === 'upcoming')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}

/**
 * Get user dashboard data
 * @param user User to get dashboard data for
 * @param allPlayers Array of all players
 * @param allTournaments Array of all tournaments
 * @returns Complete dashboard data
 */
export function getUserDashboardData(
  user: User,
  allPlayers: Player[],
  allTournaments: Tournament[]
): {
  user: User;
  favoritePlayers: Player[];
  recentlyViewed: Array<{
    entityType: string;
    entityId: string;
    name: string;
    timestamp: Date;
  }>;
  upcomingTournaments: Tournament[];
} {
  return {
    user,
    favoritePlayers: getFavoritePlayers(user, allPlayers),
    recentlyViewed: getRecentlyViewedWithDetails(user, allPlayers, allTournaments),
    upcomingTournaments: getUpcomingTournamentsForDashboard(allTournaments)
  };
}

/**
 * Add a player to user's favorites
 * @param user User to add favorite to
 * @param playerId Player ID to add
 */
export function addUserFavoritePlayer(user: User, playerId: string): void {
  addFavoritePlayer(user, playerId);
}

/**
 * Remove a player from user's favorites
 * @param user User to remove favorite from
 * @param playerId Player ID to remove
 */
export function removeUserFavoritePlayer(user: User, playerId: string): void {
  removeFavoritePlayer(user, playerId);
}

/**
 * Add an item to user's recently viewed
 * @param user User to add recently viewed item to
 * @param entityType Entity type (player, tournament, etc.)
 * @param entityId Entity ID
 */
export function addUserRecentlyViewed(
  user: User,
  entityType: string,
  entityId: string
): void {
  addRecentlyViewed(user, {
    entityType,
    entityId,
    timestamp: new Date()
  });
}

/**
 * Update user preferences
 * @param user User to update preferences for
 * @param preferences New preferences
 */
export function updateUserPreferences(
  user: User,
  preferences: { [key: string]: any }
): void {
  updatePreferences(user, preferences);
}

/**
 * Update user's last login timestamp
 * @param user User to update
 */
export function updateUserLastLogin(user: User): void {
  updateLastLogin(user);
}

/**
 * Validate user dashboard data
 * @param user User to validate
 * @param allPlayers Array of all players
 * @param allTournaments Array of all tournaments
 * @returns Array of validation errors, empty if valid
 */
export function validateUserDashboardData(
  user: User,
  allPlayers: Player[],
  allTournaments: Tournament[]
): string[] {
  const errors: string[] = [];
  
  // Validate favorite players exist
  for (const playerId of user.favoritePlayers) {
    if (!allPlayers.some(p => p.id === playerId)) {
      errors.push(`Favorite player with ID ${playerId} does not exist`);
    }
  }
  
  // Validate recently viewed items exist
  for (const item of user.recentlyViewed) {
    if (item.entityType === 'player' && !allPlayers.some(p => p.id === item.entityId)) {
      errors.push(`Recently viewed player with ID ${item.entityId} does not exist`);
    } else if (item.entityType === 'tournament' && !allTournaments.some(t => t.id === item.entityId)) {
      errors.push(`Recently viewed tournament with ID ${item.entityId} does not exist`);
    }
  }
  
  return errors;
}

/**
 * Get user by ID
 * @param users Array of users
 * @param userId User ID to find
 * @returns User if found, undefined otherwise
 */
export function getUserById(users: User[], userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

/**
 * Get user by username
 * @param users Array of users
 * @param username Username to find
 * @returns User if found, undefined otherwise
 */
export function getUserByUsername(users: User[], username: string): User | undefined {
  return users.find(user => user.username === username);
}

/**
 * Get users with recent activity
 * @param users Array of users
 * @param days Number of days to look back (default: 7)
 * @returns Users with recent activity
 */
export function getUsersWithRecentActivity(
  users: User[],
  days: number = 7
): User[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return users.filter(user => user.lastLogin >= cutoffDate);
}