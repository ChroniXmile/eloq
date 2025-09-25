// Player service with rating calculation
// This service handles player-related operations including Elo-like rating calculations

import { Player, updatePlayerStats } from '../models/player';
import { Match } from '../models/match';

// Constants for rating calculations based on pool_elo.py specification
const SIGMA = 400; // Elo scale
const T0 = 9; // Baseline race length
const K_PROV = 40; // K-factor for provisional players
const K_EST = 20; // K-factor for established players
const K_ELITE = 10; // K-factor for elite players (rating >= 2400)
const TIER_MULTIPLIERS = {
  local: 1.00,
  regional: 1.05,
  national: 1.10,
  major: 1.20
};
const FORMAT_OFFSET = {
  alternate: 0,
  winner: 15
};

/**
 * Calculate expected score based on Elo formula
 * @param ratingDifference Difference in ratings (R_i - R_j)
 * @param format Break format (alternate or winner)
 * @returns Expected score for player I
 */
export function calculateExpectedScore(ratingDifference: number, format: 'alternate' | 'winner'): number {
  const delta = FORMAT_OFFSET[format];
  return 1 / (1 + Math.pow(10, -(ratingDifference + delta) / SIGMA));
}

/**
 * Calculate race scaling factor
 * @param totalRacks Total racks played in the match (racksI + racksJ)
 * @returns Race scaling factor
 */
export function calculateRaceScaling(totalRacks: number): number {
  return Math.sqrt(totalRacks / T0);
}

/**
 * Calculate margin dampening factor
 * @param rackDifference Absolute difference in racks won
 * @param ratingDifference Absolute difference in ratings
 * @returns Margin dampening factor
 */
export function calculateMarginDampening(rackDifference: number, ratingDifference: number): number {
  return Math.log(1 + rackDifference) / (1 + Math.pow(10, Math.abs(ratingDifference) / SIGMA));
}

/**
 * Determine K-factor for a player based on their stats
 * @param player Player to determine K-factor for
 * @returns K-factor
 */
export function determineKFactor(player: Player): number {
  if (player.matchesPlayed < 30) {
    return K_PROV;
  } else if (player.rating >= 2400) {
    return K_ELITE;
  } else {
    return K_EST;
  }
}

/**
 * Calculate field strength multiplier
 * @param fieldAvg Average rating of tournament field (optional)
 * @returns Field strength multiplier
 */
export function calculateFieldStrengthMultiplier(fieldAvg?: number): number {
  if (fieldAvg === undefined) {
    return 1.0;
  }
  
  const multiplier = 1 + 0.5 * (fieldAvg - 1500) / 400;
  return Math.max(0.9, Math.min(1.3, multiplier)); // Clamp between 0.9 and 1.3
}

/**
 * Calculate rating change for a player based on match result
 * @param player Player to calculate rating change for
 * @param opponentRating Opponent's rating
 * @param match Match details
 * @param won Whether the player won the match
 * @returns Rating change
 */
export function calculateRatingChange(
  player: Player,
  opponentRating: number,
  match: Match,
  won: boolean
): number {
  // Calculate expected score
  const ratingDifference = player.rating - opponentRating;
  const expectedScore = calculateExpectedScore(ratingDifference, match.format);
  
  // Calculate observed score (rack share)
  const totalRacks = match.racksI + match.racksJ;
  const observedScore = totalRacks > 0 
    ? (won ? match.racksI : match.racksJ) / totalRacks 
    : 0;
  
  // Optional balls-made blending
  let blendedScore = observedScore;
  if (match.ballsI !== undefined && match.ballsJ !== undefined) {
    const alpha = 0.85; // Weight on rack-share
    const gamma = 0.20; // Balls → micro-score slope
    
    const totalBalls = match.ballsPerRack * totalRacks;
    if (totalBalls > 0) {
      const deltaBalls = (won ? match.ballsI : match.ballsJ)! - (won ? match.ballsJ : match.ballsI)!;
      const ballsMicroScore = Math.max(0, Math.min(1, 0.5 + gamma * (deltaBalls / totalBalls)));
      blendedScore = alpha * observedScore + (1 - alpha) * ballsMicroScore;
    }
  }
  
  // Calculate race scaling
  const raceScaling = calculateRaceScaling(totalRacks);
  
  // Calculate margin dampening
  const rackDifference = Math.abs(match.racksI - match.racksJ);
  const marginDampening = calculateMarginDampening(rackDifference, ratingDifference);
  
  // Determine K-factor
  const kFactor = determineKFactor(player);
  
  // Apply event tier multiplier
  const tierMultiplier = TIER_MULTIPLIERS[match.eventTier];
  
  // Apply field strength multiplier
  const fieldMultiplier = calculateFieldStrengthMultiplier(match.fieldAvg);
  
  // Calculate final K
  const finalK = kFactor * tierMultiplier * fieldMultiplier;
  
  // Calculate rating change
  const ratingChange = finalK * raceScaling * marginDampening * (blendedScore - expectedScore);
  
  return ratingChange;
}

/**
 * Update player rating based on match result
 * @param player Player to update
 * @param opponentRating Opponent's rating
 * @param match Match details
 * @param won Whether the player won the match
 */
export function updatePlayerRating(
  player: Player,
  opponentRating: number,
  match: Match,
  won: boolean
): void {
  const ratingChange = calculateRatingChange(player, opponentRating, match, won);
  updatePlayerStats(player, won, ratingChange);
}

/**
 * Get players sorted by rating (descending)
 * @param players Array of players
 * @returns Players sorted by rating
 */
export function getPlayersSortedByRating(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.rating - a.rating);
}

/**
 * Update player rankings based on current ratings
 * @param players Array of players
 */
export function updatePlayerRankings(players: Player[]): void {
  const sortedPlayers = getPlayersSortedByRating(players);
  sortedPlayers.forEach((player, index) => {
    player.ranking = index + 1;
  });
}

/**
 * Get top N players by ranking
 * @param players Array of players
 * @param count Number of players to return
 * @returns Top N players
 */
export function getTopPlayers(players: Player[], count: number): Player[] {
  const sortedPlayers = getPlayersSortedByRating(players);
  return sortedPlayers.slice(0, count);
}