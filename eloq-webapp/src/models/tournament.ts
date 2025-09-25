// Tournament model with tier system
// This model represents a pool/billiards tournament with participants and results

export type TournamentTier = 'local' | 'regional' | 'national' | 'major';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface TournamentResult {
  /**
   * Player ID
   */
  playerId: string;
  
  /**
   * Player's position in the tournament
   */
  position: number;
  
  /**
   * Prize money won by the player
   */
  prize: number;
}

export interface Tournament {
  /**
   * Unique identifier for the tournament
   */
  id: string;
  
  /**
   * Tournament name
   */
  name: string;
  
  /**
   * Tournament date
   */
  date: Date;
  
  /**
   * Tournament location
   */
  location: string;
  
  /**
   * Total prize money
   */
  prizePool: number;
  
  /**
   * Tournament tier (local, regional, national, major)
   */
  tier: TournamentTier;
  
  /**
   * Average rating of participants
   */
  fieldAvgRating: number;
  
  /**
   * Array of player IDs participating in the tournament
   */
  participants: string[];
  
  /**
   * Array of tournament results
   */
  results: TournamentResult[];
  
  /**
   * Tournament status (upcoming, ongoing, completed)
   */
  status: TournamentStatus;
  
  /**
   * Tournament description
   */
  description: string;
}

/**
 * Create a new tournament instance with default values
 * @param id Unique identifier for the tournament
 * @param name Tournament name
 * @returns Tournament object with default values
 */
export function createTournament(id: string, name: string): Tournament {
  return {
    id,
    name,
    date: new Date(),
    location: '',
    prizePool: 0,
    tier: 'local',
    fieldAvgRating: 1500, // Default average rating
    participants: [],
    results: [],
    status: 'upcoming',
    description: '',
  };
}

/**
 * Add a participant to the tournament
 * @param tournament Tournament to add participant to
 * @param playerId Player ID to add
 */
export function addParticipant(tournament: Tournament, playerId: string): void {
  if (!tournament.participants.includes(playerId)) {
    tournament.participants.push(playerId);
  }
}

/**
 * Remove a participant from the tournament
 * @param tournament Tournament to remove participant from
 * @param playerId Player ID to remove
 */
export function removeParticipant(tournament: Tournament, playerId: string): void {
  const index = tournament.participants.indexOf(playerId);
  if (index !== -1) {
    tournament.participants.splice(index, 1);
  }
}

/**
 * Add a result to the tournament
 * @param tournament Tournament to add result to
 * @param result Tournament result to add
 */
export function addResult(tournament: Tournament, result: TournamentResult): void {
  tournament.results.push(result);
}

/**
 * Update tournament status
 * @param tournament Tournament to update
 * @param status New status
 */
export function updateStatus(tournament: Tournament, status: TournamentStatus): void {
  tournament.status = status;
}

/**
 * Validate tournament data
 * @param tournament Tournament to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateTournament(tournament: Tournament): string[] {
  const errors: string[] = [];
  
  if (!tournament.id) {
    errors.push('Tournament ID is required');
  }
  
  if (!tournament.name) {
    errors.push('Tournament name is required');
  }
  
  if (!tournament.date) {
    errors.push('Tournament date is required');
  }
  
  if (!['local', 'regional', 'national', 'major'].includes(tournament.tier)) {
    errors.push('Tier must be one of: local, regional, national, major');
  }
  
  if (!['upcoming', 'ongoing', 'completed'].includes(tournament.status)) {
    errors.push('Status must be one of: upcoming, ongoing, completed');
  }
  
  if (tournament.prizePool < 0) {
    errors.push('Prize pool must be non-negative');
  }
  
  if (tournament.fieldAvgRating < 0) {
    errors.push('Field average rating must be non-negative');
  }
  
  return errors;
}