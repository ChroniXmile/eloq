import { query } from '.';
import { Player } from '../../models/player';
import { Match } from '../../models/match';
import { Tournament } from '../../models/tournament';
import { User } from '../../models/user';

/**
 * Create all database tables
 */
export async function createTables(): Promise<void> {
  try {
    // Create players table
    await query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating DECIMAL(10, 2) NOT NULL DEFAULT 1500.00,
        ranking INTEGER NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0,
        win_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
        avatar_url TEXT,
        join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_played TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        country VARCHAR(100),
        breaks INTEGER NOT NULL DEFAULT 0,
        highest_break INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        matches_played INTEGER NOT NULL DEFAULT 0,
        provisional BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    // Create tournaments table
    await query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        location VARCHAR(255),
        prize_pool DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        tier VARCHAR(20) NOT NULL CHECK (tier IN ('local', 'regional', 'national', 'major')),
        field_avg_rating DECIMAL(10, 2) NOT NULL DEFAULT 1500.00,
        participants TEXT[], -- Array of player IDs
        results JSONB, -- JSON array of tournament results
        status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed')),
        description TEXT
      )
    `);

    // Create matches table
    await query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(255) PRIMARY KEY,
        date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        event_id VARCHAR(255) NOT NULL,
        event_tier VARCHAR(20) NOT NULL CHECK (event_tier IN ('local', 'regional', 'national', 'major')),
        format VARCHAR(20) NOT NULL CHECK (format IN ('alternate', 'winner')),
        discipline VARCHAR(50) NOT NULL DEFAULT '9-ball',
        balls_per_rack INTEGER NOT NULL DEFAULT 9,
        race_to INTEGER NOT NULL DEFAULT 9,
        player_i VARCHAR(255) NOT NULL,
        player_j VARCHAR(255) NOT NULL,
        racks_i INTEGER NOT NULL DEFAULT 0,
        racks_j INTEGER NOT NULL DEFAULT 0,
        balls_i INTEGER,
        balls_j INTEGER,
        field_avg DECIMAL(10, 2),
        FOREIGN KEY (player_i) REFERENCES players(id),
        FOREIGN KEY (player_j) REFERENCES players(id)
      )
    `);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        favorite_players TEXT[], -- Array of player IDs
        recently_viewed JSONB, -- JSON array of recently viewed items
        preferences JSONB, -- JSON object for user preferences
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better query performance
    await query(`CREATE INDEX IF NOT EXISTS idx_players_rating ON players(rating DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_players_ranking ON players(ranking ASC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments(date DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status)`);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

/**
 * Drop all database tables
 */
export async function dropTables(): Promise<void> {
  try {
    await query('DROP TABLE IF EXISTS users');
    await query('DROP TABLE IF EXISTS matches');
    await query('DROP TABLE IF EXISTS tournaments');
    await query('DROP TABLE IF EXISTS players');
    
    console.log('Database tables dropped successfully');
  } catch (error) {
    console.error('Error dropping database tables:', error);
    throw error;
  }
}

/**
 * Populate database with mock data
 */
export async function populateMockData(): Promise<void> {
  try {
    // Clear existing data
    await query('DELETE FROM users');
    await query('DELETE FROM matches');
    await query('DELETE FROM tournaments');
    await query('DELETE FROM players');

    // Import mock data
    const { initializeMockData, getPlayers, getMatches, getTournaments, getUsers } = 
      await import('../../services/mock-data-service');

    // Initialize mock data
    initializeMockData();

    // Get mock data
    const mockPlayers: Player[] = getPlayers();
    const mockMatches: Match[] = getMatches();
    const mockTournaments: Tournament[] = getTournaments();
    const mockUsers: User[] = getUsers();

    // Insert players
    for (const player of mockPlayers) {
      await query(
        `INSERT INTO players (
          id, name, rating, ranking, wins, losses, win_rate, avatar_url, 
          join_date, last_played, country, breaks, highest_break, 
          description, matches_played, provisional
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          player.id,
          player.name,
          player.rating,
          player.ranking,
          player.wins,
          player.losses,
          player.winRate,
          player.avatarUrl,
          player.joinDate,
          player.lastPlayed,
          player.country,
          player.breaks,
          player.highestBreak,
          player.description,
          player.matchesPlayed,
          player.provisional
        ]
      );
    }

    console.log(`Inserted ${mockPlayers.length} players into database`);

    // Insert matches
    for (const match of mockMatches) {
      await query(
        `INSERT INTO matches (
          id, date, event_id, event_tier, format, discipline, balls_per_rack,
          race_to, player_i, player_j, racks_i, racks_j, balls_i, balls_j, field_avg
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          match.id,
          match.date,
          match.eventId,
          match.eventTier,
          match.format,
          match.discipline,
          match.ballsPerRack,
          match.raceTo,
          match.playerI,
          match.playerJ,
          match.racksI,
          match.racksJ,
          match.ballsI,
          match.ballsJ,
          match.fieldAvg
        ]
      );
    }

    console.log(`Inserted ${mockMatches.length} matches into database`);

    // Insert tournaments
    for (const tournament of mockTournaments) {
      await query(
        `INSERT INTO tournaments (
          id, name, date, location, prize_pool, tier, field_avg_rating,
          participants, results, status, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          tournament.id,
          tournament.name,
          tournament.date,
          tournament.location,
          tournament.prizePool,
          tournament.tier,
          tournament.fieldAvgRating,
          tournament.participants,
          JSON.stringify(tournament.results),
          tournament.status,
          tournament.description
        ]
      );
    }

    console.log(`Inserted ${mockTournaments.length} tournaments into database`);

    // Insert users
    for (const user of mockUsers) {
      await query(
        `INSERT INTO users (
          id, username, email, display_name, avatar_url, favorite_players,
          recently_viewed, preferences, created_at, last_login
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.id,
          user.username,
          user.email,
          user.displayName,
          user.avatarUrl,
          user.favoritePlayers,
          JSON.stringify(user.recentlyViewed),
          JSON.stringify(user.preferences),
          user.createdAt,
          user.lastLogin
        ]
      );
    }

    console.log(`Inserted ${mockUsers.length} users into database`);

    console.log('Mock data populated successfully');
  } catch (error) {
    console.error('Error populating mock data:', error);
    throw error;
  }
}

export default {
  createTables,
  dropTables,
  populateMockData
};