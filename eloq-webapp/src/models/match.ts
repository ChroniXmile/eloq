// Match model with detailed scoring
// This model represents a pool/billiards match between two players with detailed scoring information

export type EventTier = 'local' | 'regional' | 'national' | 'major';
export type Format = 'alternate' | 'winner';

export interface Match {
  /**
   * Unique identifier for the match
   */
  id: string;
  
  /**
   * Match date
   */
  date: Date;
  
  /**
   * Reference to the tournament/event
   */
  eventId: string;
  
  /**
   * Event tier (local, regional, national, major)
   */
  eventTier: EventTier;
  
  /**
   * Break format (alternate, winner)
   */
  format: Format;
  
  /**
   * Discipline (e.g., 9-ball, 10-ball)
   */
  discipline: string;
  
  /**
   * Typical number of balls per rack (9, 10, 15)
   */
  ballsPerRack: number;
  
  /**
   * Target for the winner (e.g., 9 in race-to-9)
   */
  raceTo: number;
  
  /**
   * Reference to player I
   */
  playerI: string;
  
  /**
   * Reference to player J
   */
  playerJ: string;
  
  /**
   * Racks won by player I
   */
  racksI: number;
  
  /**
   * Racks won by player J
   */
  racksJ: number;
  
  /**
   * Balls pocketed by player I (optional)
   */
  ballsI?: number;
  
  /**
   * Balls pocketed by player J (optional)
   */
  ballsJ?: number;
  
  /**
   * Event field average rating (optional)
   */
  fieldAvg?: number;
}

/**
 * Create a new match instance with default values
 * @param id Unique identifier for the match
 * @param playerI Reference to player I
 * @param playerJ Reference to player J
 * @returns Match object with default values
 */
export function createMatch(id: string, playerI: string, playerJ: string): Match {
  return {
    id,
    date: new Date(),
    eventId: '',
    eventTier: 'local',
    format: 'alternate',
    discipline: '9-ball',
    ballsPerRack: 9,
    raceTo: 9,
    playerI,
    playerJ,
    racksI: 0,
    racksJ: 0,
  };
}

/**
 * Calculate rack-share score for a player
 * @param match Match to calculate score for
 * @param playerI Whether to calculate for player I (true) or player J (false)
 * @returns Rack-share score (racks won / total racks)
 */
export function calculateRackShare(match: Match, playerI: boolean): number {
  const totalRacks = match.racksI + match.racksJ;
  if (totalRacks === 0) {
    return 0;
  }
  
  return playerI ? match.racksI / totalRacks : match.racksJ / totalRacks;
}

/**
 * Calculate balls-made micro-score for a player
 * @param match Match to calculate score for
 * @param playerI Whether to calculate for player I (true) or player J (false)
 * @returns Balls-made micro-score, or null if balls data is not available
 */
export function calculateBallsMadeScore(match: Match, playerI: boolean): number | null {
  // Check if balls data is available
  if ((playerI && match.ballsI === undefined) || (!playerI && match.ballsJ === undefined)) {
    return null;
  }
  
  const totalBalls = match.ballsPerRack * (match.racksI + match.racksJ);
  if (totalBalls === 0) {
    return 0.5; // Neutral score when no balls were pocketed
  }
  
  const balls = playerI ? (match.ballsI || 0) : (match.ballsJ || 0);
  return balls / totalBalls;
}

/**
 * Validate match data
 * @param match Match to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateMatch(match: Match): string[] {
  const errors: string[] = [];
  
  if (!match.id) {
    errors.push('Match ID is required');
  }
  
  if (!match.playerI) {
    errors.push('Player I is required');
  }
  
  if (!match.playerJ) {
    errors.push('Player J is required');
  }
  
  if (match.playerI === match.playerJ) {
    errors.push('Player I and Player J must be different players');
  }
  
  if (!match.date) {
    errors.push('Match date is required');
  }
  
  if (!['local', 'regional', 'national', 'major'].includes(match.eventTier)) {
    errors.push('Event tier must be one of: local, regional, national, major');
  }
  
  if (!['alternate', 'winner'].includes(match.format)) {
    errors.push('Format must be one of: alternate, winner');
  }
  
  if (match.raceTo <= 0) {
    errors.push('Race to must be a positive integer');
  }
  
  if (match.racksI < 0) {
    errors.push('Racks won by player I must be non-negative');
  }
  
  if (match.racksJ < 0) {
    errors.push('Racks won by player J must be non-negative');
  }
  
  if (match.ballsI !== undefined && match.ballsI < 0) {
    errors.push('Balls pocketed by player I must be non-negative');
  }
  
  if (match.ballsJ !== undefined && match.ballsJ < 0) {
    errors.push('Balls pocketed by player J must be non-negative');
  }
  
  return errors;
}