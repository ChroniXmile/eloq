// Tournament service with tier logic
// This service handles tournament-related operations including tier logic

import { Tournament, TournamentTier, TournamentStatus, addParticipant, removeParticipant, addResult, updateStatus } from '../models/tournament';
import { Player } from '../models/player';

// Tier multipliers for rating calculations
const TIER_MULTIPLIERS = {
  local: 1.00,
  regional: 1.05,
  national: 1.10,
  major: 1.20
};

/**
 * Get tier multiplier for rating calculations
 * @param tier Tournament tier
 * @returns Tier multiplier
 */
export function getTierMultiplier(tier: TournamentTier): number {
  return TIER_MULTIPLIERS[tier];
}

/**
 * Determine if a tournament is eligible for a specific tier
 * @param tournament Tournament to check
 * @param tier Tier to check eligibility for
 * @returns True if tournament is eligible for the tier
 */
export function isEligibleForTier(tournament: Tournament, tier: TournamentTier): boolean {
  // Simple implementation - in a real system, this would have more complex logic
  // based on factors like prize pool, number of participants, etc.
  return true;
}

/**
 * Upgrade tournament tier if eligible
 * @param tournament Tournament to potentially upgrade
 * @returns True if tier was upgraded, false otherwise
 */
export function upgradeTournamentTier(tournament: Tournament): boolean {
  const currentTier = tournament.tier;
  let newTier: TournamentTier = currentTier;
  
  // Logic for upgrading tiers based on various factors
  if (currentTier === 'local' && tournament.prizePool >= 10000) {
    newTier = 'regional';
  } else if (currentTier === 'regional' && tournament.prizePool >= 50000) {
    newTier = 'national';
  } else if (currentTier === 'national' && tournament.prizePool >= 100000) {
    newTier = 'major';
  }
  
  if (newTier !== currentTier) {
    tournament.tier = newTier;
    return true;
  }
  
  return false;
}

/**
 * Get tournaments filtered by status
 * @param tournaments Array of tournaments
 * @param status Status to filter by
 * @returns Filtered tournaments
 */
export function getTournamentsByStatus(tournaments: Tournament[], status: TournamentStatus): Tournament[] {
  return tournaments.filter(tournament => tournament.status === status);
}

/**
 * Get upcoming tournaments
 * @param tournaments Array of tournaments
 * @returns Upcoming tournaments
 */
export function getUpcomingTournaments(tournaments: Tournament[]): Tournament[] {
  return getTournamentsByStatus(tournaments, 'upcoming');
}

/**
 * Get ongoing tournaments
 * @param tournaments Array of tournaments
 * @returns Ongoing tournaments
 */
export function getOngoingTournaments(tournaments: Tournament[]): Tournament[] {
  return getTournamentsByStatus(tournaments, 'ongoing');
}

/**
 * Get completed tournaments
 * @param tournaments Array of tournaments
 * @returns Completed tournaments
 */
export function getCompletedTournaments(tournaments: Tournament[]): Tournament[] {
  return getTournamentsByStatus(tournaments, 'completed');
}

/**
 * Sort tournaments by date (ascending)
 * @param tournaments Array of tournaments
 * @returns Sorted tournaments
 */
export function sortTournamentsByDate(tournaments: Tournament[]): Tournament[] {
  return [...tournaments].sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get tournaments within a date range
 * @param tournaments Array of tournaments
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @returns Tournaments within the date range
 */
export function getTournamentsInDateRange(
  tournaments: Tournament[],
  startDate: Date,
  endDate: Date
): Tournament[] {
  return tournaments.filter(tournament => {
    const tournamentDate = tournament.date.getTime();
    return tournamentDate >= startDate.getTime() && tournamentDate <= endDate.getTime();
  });
}

/**
 * Get tournaments by tier
 * @param tournaments Array of tournaments
 * @param tier Tier to filter by
 * @returns Tournaments of the specified tier
 */
export function getTournamentsByTier(tournaments: Tournament[], tier: TournamentTier): Tournament[] {
  return tournaments.filter(tournament => tournament.tier === tier);
}

/**
 * Calculate average field rating for a tournament
 * @param tournament Tournament to calculate for
 * @param players Array of all players
 * @returns Average field rating
 */
export function calculateFieldAverageRating(tournament: Tournament, players: Player[]): number {
  if (tournament.participants.length === 0) {
    return 1500; // Default rating
  }
  
  const participantRatings = tournament.participants
    .map(playerId => {
      const player = players.find(p => p.id === playerId);
      return player ? player.rating : 1500; // Default rating if player not found
    });
  
  const sum = participantRatings.reduce((acc, rating) => acc + rating, 0);
  return sum / participantRatings.length;
}

/**
 * Update tournament field average rating
 * @param tournament Tournament to update
 * @param players Array of all players
 */
export function updateFieldAverageRating(tournament: Tournament, players: Player[]): void {
  tournament.fieldAvgRating = calculateFieldAverageRating(tournament, players);
}

/**
 * Start a tournament
 * @param tournament Tournament to start
 */
export function startTournament(tournament: Tournament): void {
  if (tournament.status === 'upcoming') {
    updateStatus(tournament, 'ongoing');
  }
}

/**
 * Complete a tournament
 * @param tournament Tournament to complete
 */
export function completeTournament(tournament: Tournament): void {
  if (tournament.status === 'ongoing') {
    updateStatus(tournament, 'completed');
  }
}

/**
 * Validate tournament setup
 * @param tournament Tournament to validate
 * @param players Array of all players
 * @returns Array of validation errors, empty if valid
 */
export function validateTournamentSetup(tournament: Tournament, players: Player[]): string[] {
  const errors: string[] = [];
  
  // Check that all participants exist
  for (const playerId of tournament.participants) {
    if (!players.some(p => p.id === playerId)) {
      errors.push(`Participant with ID ${playerId} does not exist`);
    }
  }
  
  // Check that results reference valid participants
  for (const result of tournament.results) {
    if (!tournament.participants.includes(result.playerId)) {
      errors.push(`Result for player ${result.playerId} who is not a participant`);
    }
  }
  
  // Check for duplicate participants
  const uniqueParticipants = new Set(tournament.participants);
  if (uniqueParticipants.size !== tournament.participants.length) {
    errors.push('Duplicate participants found');
  }
  
  return errors;
}