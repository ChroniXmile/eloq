// Player model with rating system
// This model represents a pool/billiards player with all relevant statistics and rating information

export interface RatingHistoryEntry {
  date: Date;
  rating: number;
}

export interface Player {
  /**
   * Unique identifier for the player
   */
  id: string;
  
  /**
   * Player's full name
   */
  name: string;
  
  /**
   * Elo-like rating based on pool_elo.py algorithm
   */
  rating: number;
  
  /**
   * Current ranking from 1-100 based on rating
   */
  ranking: number;
  
  /**
   * Total wins
   */
  wins: number;
  
  /**
   * Total losses
   */
  losses: number;
  
  /**
   * Calculated win percentage (wins / (wins + losses) * 100)
   */
  winRate: number;
  
  /**
   * URL to player's avatar image
   */
  avatarUrl: string;
  
  /**
   * Date player joined the ranking system
   */
  joinDate: Date;
  
  /**
   * Date of last tournament/game
   */
  lastPlayed: Date;
  
  /**
   * Player's country
   */
  country: string;
  
  /**
   * Total century breaks
   */
  breaks: number;
  
  /**
   * Highest score achieved
   */
  highestBreak: number;
  
  /**
   * Brief bio/description of the player
   */
  description: string;
  
  /**
   * Total matches played
   */
  matchesPlayed: number;
  
  /**
   * True if player has played fewer than 30 matches (provisional rating)
   */
  provisional: boolean;
  
  /**
   * Historical rating data for charting
   */
  ratingHistory?: RatingHistoryEntry[];
}

/**
 * Create a new player instance with default values
 * @param id Unique identifier for the player
 * @param name Player's full name
 * @returns Player object with default values
 */
export function createPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    rating: 1500, // Default starting rating
    ranking: 0, // Will be calculated based on rating
    wins: 0,
    losses: 0,
    winRate: 0,
    avatarUrl: '',
    joinDate: new Date(),
    lastPlayed: new Date(),
    country: '',
    breaks: 0,
    highestBreak: 0,
    description: '',
    matchesPlayed: 0,
    provisional: true, // New players start as provisional
  };
}

/**
 * Update player statistics after a match
 * @param player Player to update
 * @param won Whether the player won the match
 * @param ratingChange Change in rating from the match
 */
export function updatePlayerStats(player: Player, won: boolean, ratingChange: number): void {
  if (won) {
    player.wins += 1;
  } else {
    player.losses += 1;
  }
  
  player.matchesPlayed += 1;
  player.lastPlayed = new Date();
  player.rating += ratingChange;
  player.winRate = player.matchesPlayed > 0 ? Math.round((player.wins / player.matchesPlayed) * 100) : 0;
  player.provisional = player.matchesPlayed < 30;
}

/**
 * Validate player data
 * @param player Player to validate
 * @returns Array of validation errors, empty if valid
 */
export function validatePlayer(player: Player): string[] {
  const errors: string[] = [];
  
  if (!player.id) {
    errors.push('Player ID is required');
  }
  
  if (!player.name) {
    errors.push('Player name is required');
  }
  
  if (player.rating <= 0) {
    errors.push('Rating must be a positive number');
  }
  
  if (player.ranking < 0 || player.ranking > 100) {
    errors.push('Ranking must be between 1 and 100');
  }
  
  if (player.wins < 0) {
    errors.push('Wins must be non-negative');
  }
  
  if (player.losses < 0) {
    errors.push('Losses must be non-negative');
  }
  
  if (player.winRate < 0 || player.winRate > 100) {
    errors.push('Win rate must be between 0 and 100');
  }
  
  if (player.matchesPlayed < 0) {
    errors.push('Matches played must be non-negative');
  }
  
  return errors;
}