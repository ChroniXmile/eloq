// Server actions for database operations
// These functions run on the server and can be called from client components

'use server';

import { initializeDataConnection } from '@/lib/data-connection';
import { createTables, populateMockData } from '@/lib/db/init';
import { query } from '.';
import { clearTournamentCache } from './database-service';
import { Player } from '@/models/player';
import { Match } from '@/models/match';
import { Tournament } from '@/models/tournament';

/**
 * Initialize the database
 * Creates tables and populates with mock data
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Initialize database connection
    await initializeDataConnection();
    
    // Create database tables
    await createTables();
    
    // Populate with mock data
    await populateMockData();
    
    console.log('Database initialized successfully');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, message: 'Failed to initialize database', error: (error as Error).message };
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection() {
  try {
    await initializeDataConnection();
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Error testing database connection:', error);
    return { success: false, message: 'Failed to connect to database', error: (error as Error).message };
  }
}

/**
 * Import players from CSV data
 * @param csvData Array of player data from CSV
 */
export async function importPlayersFromCSV(csvData: any[]) {
  try {
    console.log(`Importing ${csvData.length} players from CSV...`);
    
    // Initialize database connection
    await initializeDataConnection();
    
    let importedCount = 0;
    let updatedCount = 0;
    
    for (const row of csvData) {
      // Check if player already exists
      const existingPlayer = await query(
        'SELECT id FROM players WHERE id = $1',
        [row.id]
      );
      
      if (existingPlayer.rows.length > 0) {
        // Update existing player
        await query(
          `UPDATE players SET 
            name = $1, rating = $2, ranking = $3, wins = $4, losses = $5, 
            win_rate = $6, avatar_url = $7, join_date = $8, last_played = $9, 
            country = $10, breaks = $11, highest_break = $12, description = $13, 
            matches_played = $14, provisional = $15
          WHERE id = $16`,
          [
            row.name,
            parseFloat(row.rating) || 1500.00,
            parseInt(row.ranking) || 0,
            parseInt(row.wins) || 0,
            parseInt(row.losses) || 0,
            parseFloat(row.win_rate) || 0.00,
            row.avatar_url || null,
            row.join_date ? new Date(row.join_date) : new Date(),
            row.last_played ? new Date(row.last_played) : new Date(),
            row.country || null,
            parseInt(row.breaks) || 0,
            parseInt(row.highest_break) || 0,
            row.description || null,
            parseInt(row.matches_played) || 0,
            row.provisional === 'true' || row.provisional === true || (parseInt(row.matches_played) || 0) < 30
          ]
        );
        updatedCount++;
      } else {
        // Insert new player
        await query(
          `INSERT INTO players (
            id, name, rating, ranking, wins, losses, win_rate, avatar_url, 
            join_date, last_played, country, breaks, highest_break, 
            description, matches_played, provisional
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            row.id,
            row.name,
            parseFloat(row.rating) || 1500.00,
            parseInt(row.ranking) || 0,
            parseInt(row.wins) || 0,
            parseInt(row.losses) || 0,
            parseFloat(row.win_rate) || 0.00,
            row.avatar_url || null,
            row.join_date ? new Date(row.join_date) : new Date(),
            row.last_played ? new Date(row.last_played) : new Date(),
            row.country || null,
            parseInt(row.breaks) || 0,
            parseInt(row.highest_break) || 0,
            row.description || null,
            parseInt(row.matches_played) || 0,
            row.provisional === 'true' || row.provisional === true || (parseInt(row.matches_played) || 0) < 30
          ]
        );
        importedCount++;
      }
    }
    
    console.log(`Imported ${importedCount} new players, updated ${updatedCount} existing players`);
    return { 
      success: true, 
      message: `Imported ${importedCount} new players, updated ${updatedCount} existing players` 
    };
  } catch (error) {
    console.error('Error importing players from CSV:', error);
    return { success: false, message: 'Failed to import players from CSV', error: (error as Error).message };
  }
}

/**
 * Import matches from CSV data
 * @param csvData Array of match data from CSV
 */
export async function importMatchesFromCSV(csvData: any[]) {
  try {
    console.log(`Importing ${csvData.length} matches from CSV...`);
    
    // Initialize database connection
    await initializeDataConnection();
    
    let importedCount = 0;
    let updatedCount = 0;
    
    for (const row of csvData) {
      // Check if match already exists
      const existingMatch = await query(
        'SELECT id FROM matches WHERE id = $1',
        [row.id]
      );
      
      if (existingMatch.rows.length > 0) {
        // Update existing match
        await query(
          `UPDATE matches SET 
            date = $1, event_id = $2, event_tier = $3, format = $4, discipline = $5,
            balls_per_rack = $6, race_to = $7, player_i = $8, player_j = $9,
            racks_i = $10, racks_j = $11, balls_i = $12, balls_j = $13, field_avg = $14
          WHERE id = $15`,
          [
            row.date ? new Date(row.date) : new Date(),
            row.event_id,
            row.event_tier,
            row.format,
            row.discipline || '9-ball',
            parseInt(row.balls_per_rack) || 9,
            parseInt(row.race_to) || 9,
            row.player_i,
            row.player_j,
            parseInt(row.racks_i) || 0,
            parseInt(row.racks_j) || 0,
            row.balls_i ? parseInt(row.balls_i) : null,
            row.balls_j ? parseInt(row.balls_j) : null,
            row.field_avg ? parseFloat(row.field_avg) : null
          ]
        );
        updatedCount++;
      } else {
        // Insert new match
        await query(
          `INSERT INTO matches (
            id, date, event_id, event_tier, format, discipline, balls_per_rack,
            race_to, player_i, player_j, racks_i, racks_j, balls_i, balls_j, field_avg
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            row.id,
            row.date ? new Date(row.date) : new Date(),
            row.event_id,
            row.event_tier,
            row.format,
            row.discipline || '9-ball',
            parseInt(row.balls_per_rack) || 9,
            parseInt(row.race_to) || 9,
            row.player_i,
            row.player_j,
            parseInt(row.racks_i) || 0,
            parseInt(row.racks_j) || 0,
            row.balls_i ? parseInt(row.balls_i) : null,
            row.balls_j ? parseInt(row.balls_j) : null,
            row.field_avg ? parseFloat(row.field_avg) : null
          ]
        );
        importedCount++;
      }
    }
    
    console.log(`Imported ${importedCount} new matches, updated ${updatedCount} existing matches`);
    return { 
      success: true, 
      message: `Imported ${importedCount} new matches, updated ${updatedCount} existing matches` 
    };
  } catch (error) {
    console.error('Error importing matches from CSV:', error);
    return { success: false, message: 'Failed to import matches from CSV', error: (error as Error).message };
  }
}

/**
 * Import tournaments from CSV data
 * @param csvData Array of tournament data from CSV
 */
export async function importTournamentsFromCSV(csvData: any[]) {
  try {
    console.log(`Importing ${csvData.length} tournaments from CSV...`);
    
    // Initialize database connection
    await initializeDataConnection();
    
    let importedCount = 0;
    let updatedCount = 0;
    const touchedIds = new Set<string>();
    
    for (const row of csvData) {
      // Check if tournament already exists
      const existingTournament = await query(
        'SELECT id FROM tournaments WHERE id = $1',
        [row.id]
      );
      
      if (existingTournament.rows.length > 0) {
        // Update existing tournament
        await query(
          `UPDATE tournaments SET 
            name = $1, date = $2, location = $3, prize_pool = $4, tier = $5,
            field_avg_rating = $6, participants = $7, results = $8, status = $9, description = $10
          WHERE id = $11`,
          [
            row.name,
            row.date ? new Date(row.date) : new Date(),
            row.location || null,
            parseFloat(row.prize_pool) || 0.00,
            row.tier,
            parseFloat(row.field_avg_rating) || 1500.00,
            Array.isArray(row.participants) ? row.participants : 
              (row.participants ? row.participants.split(',').map((p: string) => p.trim()) : []),
            JSON.stringify(row.results || []),
            row.status,
            row.description || null
          ]
        );
        updatedCount++;
      } else {
        // Insert new tournament
        await query(
          `INSERT INTO tournaments (
            id, name, date, location, prize_pool, tier, field_avg_rating,
            participants, results, status, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            row.id,
            row.name,
            row.date ? new Date(row.date) : new Date(),
            row.location || null,
            parseFloat(row.prize_pool) || 0.00,
            row.tier,
            parseFloat(row.field_avg_rating) || 1500.00,
            Array.isArray(row.participants) ? row.participants : 
              (row.participants ? row.participants.split(',').map((p: string) => p.trim()) : []),
            JSON.stringify(row.results || []),
            row.status,
            row.description || null
          ]
        );
        importedCount++;
      }

      if (row.id) {
        touchedIds.add(row.id);
      }
    }

    touchedIds.forEach((id) => clearTournamentCache(id));
    
    console.log(`Imported ${importedCount} new tournaments, updated ${updatedCount} existing tournaments`);
    return { 
      success: true, 
      message: `Imported ${importedCount} new tournaments, updated ${updatedCount} existing tournaments` 
    };
  } catch (error) {
    console.error('Error importing tournaments from CSV:', error);
    return { success: false, message: 'Failed to import tournaments from CSV', error: (error as Error).message };
  }
}
