import { TournamentResult, TournamentStatus, TournamentTier } from '@/models/tournament';
import { TournamentUpsertInput } from '@/lib/db/database-service';

export const TIER_VALUES: TournamentTier[] = ['local', 'regional', 'national', 'major'];
export const STATUS_VALUES: TournamentStatus[] = ['upcoming', 'ongoing', 'completed'];

const parseNumeric = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const normalizeParticipants = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
      .filter((entry) => entry.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
};

const normalizeResults = (value: unknown, errors: string[]): TournamentResult[] => {
  if (!value) {
    return [];
  }

  let entries: unknown[] = [];

  if (Array.isArray(value)) {
    entries = value;
  } else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      entries = Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      errors.push('Results must be a JSON array or object.');
      return [];
    }
  } else {
    entries = [value];
  }

  const results: TournamentResult[] = [];

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      errors.push(`Result at index ${index} is not a valid object.`);
      return;
    }

    const record = entry as Record<string, unknown>;
    const playerId = typeof record.playerId === 'string' ? record.playerId.trim() : '';
    const positionValue = parseNumeric(record.position);
    const prizeValue = parseNumeric(record.prize);

    if (!playerId) {
      errors.push(`Result at index ${index} is missing a playerId.`);
      return;
    }

    if (positionValue === undefined) {
      errors.push(`Result at index ${index} is missing a valid position.`);
      return;
    }

    if (prizeValue === undefined) {
      errors.push(`Result at index ${index} is missing a valid prize.`);
      return;
    }

    results.push({
      playerId,
      position: positionValue,
      prize: prizeValue,
    });
  });

  return results;
};

export const parseTournamentPayload = (payload: unknown): { data?: TournamentUpsertInput; errors: string[] } => {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { errors: ['Request body must be an object.'] };
  }

  const body = payload as Record<string, unknown>;
  const nameValue = typeof body.name === 'string' ? body.name.trim() : '';
  const dateValue = body.date;
  const tierValue = typeof body.tier === 'string' ? body.tier.trim() : '';
  const statusValue = typeof body.status === 'string' ? body.status.trim() : 'upcoming';
  const locationValue = typeof body.location === 'string' ? body.location.trim() : undefined;
  const descriptionValue = typeof body.description === 'string' ? body.description.trim() : undefined;
  const prizePoolValue = parseNumeric(body.prizePool);
  const fieldAvgRatingValue = parseNumeric(body.fieldAvgRating);
  const participantsValue = normalizeParticipants(body.participants);
  const resultsValue = normalizeResults(body.results, errors);

  if (!nameValue) {
    errors.push('Tournament name is required.');
  }

  let parsedDate: Date | undefined;

  if (dateValue instanceof Date) {
    parsedDate = dateValue;
  } else if (typeof dateValue === 'string') {
    const candidate = new Date(dateValue);
    if (!Number.isNaN(candidate.getTime())) {
      parsedDate = candidate;
    }
  }

  if (!parsedDate) {
    errors.push('A valid tournament date is required.');
  }

  if (!TIER_VALUES.includes(tierValue as TournamentTier)) {
    errors.push('Tier must be one of local, regional, national, or major.');
  }

  if (!STATUS_VALUES.includes(statusValue as TournamentStatus)) {
    errors.push('Status must be one of upcoming, ongoing, or completed.');
  }

  if (prizePoolValue !== undefined && prizePoolValue < 0) {
    errors.push('Prize pool must be zero or greater.');
  }

  if (fieldAvgRatingValue !== undefined && fieldAvgRatingValue < 0) {
    errors.push('Field average rating must be zero or greater.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  const data: TournamentUpsertInput = {
    name: nameValue,
    date: parsedDate as Date,
    tier: tierValue as TournamentTier,
    status: statusValue as TournamentStatus,
    participants: participantsValue,
    results: resultsValue,
  };

  if (locationValue && locationValue.length > 0) {
    data.location = locationValue;
  }

  if (descriptionValue && descriptionValue.length > 0) {
    data.description = descriptionValue;
  }

  if (prizePoolValue !== undefined) {
    data.prizePool = prizePoolValue;
  }

  if (fieldAvgRatingValue !== undefined) {
    data.fieldAvgRating = fieldAvgRatingValue;
  }

  return { data, errors }; // errors will be empty here
};
