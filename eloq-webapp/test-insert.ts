// Test script to insert a single player

import { query } from './src/lib/db';

async function testInsert() {
  try {
    console.log('Testing database connection...');
    
    // Test inserting a simple player
    const result = await query(
      `INSERT INTO players (
        id, name, rating, ranking, wins, losses, win_rate, avatar_url, 
        join_date, last_played, country, breaks, highest_break, 
        description, matches_played, provisional
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        'test-player-1',
        'Test Player',
        1500.00,
        1,
        10,
        5,
        66.67,
        'https://example.com/avatar.jpg',
        new Date(),
        new Date(),
        'USA',
        5,
        100,
        'Test player description',
        15,
        false
      ]
    );
    
    console.log('Insert successful:', result);
  } catch (error) {
    console.error('Insert failed:', error);
  }
}

testInsert();