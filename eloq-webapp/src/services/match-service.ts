// Match service with scoring logic
// This service handles match-related operations including scoring calculations

import { Match, calculateRackShare, calculateBallsMadeScore } from '../models/match';
import { Player } from '../models/player';

/**
 * Determine the winner of a match
 * @param match Match to determine winner for
 * @returns ID of winning player, or null if tie/no winner
 */
export function getMatchWinner(match: Match): string | null {
  if (match.racksI > match.racksJ) {
    return match.playerI;
  } else if (match.racksJ > match.racksI) {
    return match.playerJ;
  } else {
    // Tie - no winner
    return null;
  }
}

/**
 * Get match score as a formatted string
 * @param match Match to get score for
 * @returns Formatted score string (e.g., "9-7")
 */
export function getMatchScore(match: Match): string {
  return `${match.racksI}-${match.racksJ}`;
}

/**
 * Calculate total racks played in a match
 * @param match Match to calculate total racks for
 * @returns Total racks played
 */
export function getTotalRacks(match: Match): number {
  return match.racksI + match.racksJ;
}

/**
 * Calculate rack-share score for both players
 * @param match Match to calculate scores for
 * @returns Object with rack-share scores for both players
 */
export function getRackShareScores(match: Match): { playerI: number; playerJ: number } {
  return {
    playerI: calculateRackShare(match, true),
    playerJ: calculateRackShare(match, false)
  };
}

/**
 * Calculate balls-made scores for both players (if available)
 * @param match Match to calculate scores for
 * @returns Object with balls-made scores for both players, or null if data unavailable
 */
export function getBallsMadeScores(match: Match): { playerI: number; playerJ: number } | null {
  const playerIScore = calculateBallsMadeScore(match, true);
  const playerJScore = calculateBallsMadeScore(match, false);
  
  if (playerIScore === null || playerJScore === null) {
    return null;
  }
  
  return {
    playerI: playerIScore,
    playerJ: playerJScore
  };
}

/**
 * Calculate blended score using both rack-share and balls-made (if available)
 * @param match Match to calculate blended score for
 * @returns Object with blended scores for both players
 */
export function getBlendedScores(match: Match): { playerI: number; playerJ: number } {
  const rackShareScores = getRackShareScores(match);
  
  // If balls data is not available, return rack-share scores
  const ballsMadeScores = getBallsMadeScores(match);
  if (!ballsMadeScores) {
    return rackShareScores;
  }
  
  // Blend the scores (85% rack-share, 15% balls-made)
  const alpha = 0.85;
  return {
    playerI: alpha * rackShareScores.playerI + (1 - alpha) * ballsMadeScores.playerI,
    playerJ: alpha * rackShareScores.playerJ + (1 - alpha) * ballsMadeScores.playerJ
  };
}

/**
 * Determine if a match is complete
 * @param match Match to check
 * @returns True if match is complete, false otherwise
 */
export function isMatchComplete(match: Match): boolean {
  // A match is complete if one player has reached the raceTo value
  return match.racksI >= match.raceTo || match.racksJ >= match.raceTo;
}

/**
 * Get the loser of a match
 * @param match Match to determine loser for
 * @returns ID of losing player, or null if tie/no loser
 */
export function getMatchLoser(match: Match): string | null {
  if (match.racksI > match.racksJ) {
    return match.playerJ;
  } else if (match.racksJ > match.racksI) {
    return match.playerI;
  } else {
    // Tie - no loser
    return null;
  }
}

/**
 * Calculate the margin of victory
 * @param match Match to calculate margin for
 * @returns Margin of victory (positive for winner, 0 for tie)
 */
export function getMarginOfVictory(match: Match): number {
  return Math.abs(match.racksI - match.racksJ);
}

/**
 * Validate match scores
 * @param match Match to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateMatchScores(match: Match): string[] {
  const errors: string[] = [];
  
  // Check if match is complete but scores don't make sense
  if (isMatchComplete(match)) {
    if (match.racksI < match.raceTo && match.racksJ < match.raceTo) {
      errors.push(`Match marked as complete but neither player reached race-to value of ${match.raceTo}`);
    }
    
    if (match.racksI >= match.raceTo && match.racksJ >= match.raceTo) {
      errors.push('Both players cannot reach race-to value');
    }
  }
  
  // Check for negative racks
  if (match.racksI < 0) {
    errors.push('Player I racks cannot be negative');
  }
  
  if (match.racksJ < 0) {
    errors.push('Player J racks cannot be negative');
  }
  
  // Check balls data if provided
  if (match.ballsI !== undefined && match.ballsI < 0) {
    errors.push('Player I balls cannot be negative');
  }
  
  if (match.ballsJ !== undefined && match.ballsJ < 0) {
    errors.push('Player J balls cannot be negative');
  }
  
  return errors;
}

/**
 * Update match scores
 * @param match Match to update
 * @param racksI Racks won by player I
 * @param racksJ Racks won by player J
 * @param ballsI Balls pocketed by player I (optional)
 * @param ballsJ Balls pocketed by player J (optional)
 */
export function updateMatchScores(
  match: Match,
  racksI: number,
  racksJ: number,
  ballsI?: number,
  ballsJ?: number
): void {
  match.racksI = racksI;
  match.racksJ = racksJ;
  
  if (ballsI !== undefined) {
    match.ballsI = ballsI;
  }
  
  if (ballsJ !== undefined) {
    match.ballsJ = ballsJ;
  }
}