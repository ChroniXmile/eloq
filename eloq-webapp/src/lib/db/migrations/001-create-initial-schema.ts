// Initial migration to create all tables

import { query } from '../config';

export default {
  id: 1,
  name: 'Create initial schema',
  up: async (): Promise<void> => {
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
  },
  down: async (): Promise<void> => {
    await query('DROP TABLE IF EXISTS users');
    await query('DROP TABLE IF EXISTS matches');
    await query('DROP TABLE IF EXISTS tournaments');
    await query('DROP TABLE IF EXISTS players');
  }
};