import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';
import { Player } from '@/models/player';
import { User } from '@/models/user';
import { clearPlayerCache } from '@/lib/db/database-service';

export async function POST(request: NextRequest) {
  try {
    const authObject = await auth();
    const { userId } = authObject;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user data from the request
    const userData: Partial<User> = await request.json();

    // Check if a player already exists for this user to prevent duplicates
    const existingPlayerResult = await query<Player>(
      'SELECT id FROM players WHERE id = $1',
      [userId]
    );

    if (existingPlayerResult.rows.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Player already exists for this user' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a new player based on user data
    const newPlayer: Player = {
      id: userId,
      name: userData.displayName || userData.username || 'New Player',
      rating: 1500, // Default starting rating
      ranking: 0, // Will be calculated based on rating
      wins: 0,
      losses: 0,
      winRate: 0,
      avatarUrl: userData.avatarUrl || '',
      joinDate: new Date(),
      lastPlayed: new Date(),
      country: '', // Could be set from user data if available
      breaks: 0,
      highestBreak: 0,
      description: '', // Could be set from user data if available
      matchesPlayed: 0,
      provisional: true, // New players start as provisional
    };

    // Insert the new player into the database
    const result = await query(
      `INSERT INTO players (
        id, name, rating, ranking, wins, losses, win_rate, avatar_url, 
        join_date, last_played, country, breaks, highest_break, 
        description, matches_played, provisional
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, name, rating, ranking, wins, losses, win_rate as "winRate", 
                avatar_url as "avatarUrl", join_date as "joinDate", 
                last_played as "lastPlayed", country, breaks, 
                highest_break as "highestBreak", description, 
                matches_played as "matchesPlayed", provisional`,
      [
        newPlayer.id,
        newPlayer.name,
        newPlayer.rating,
        newPlayer.ranking,
        newPlayer.wins,
        newPlayer.losses,
        newPlayer.winRate,
        newPlayer.avatarUrl,
        newPlayer.joinDate,
        newPlayer.lastPlayed,
        newPlayer.country,
        newPlayer.breaks,
        newPlayer.highestBreak,
        newPlayer.description,
        newPlayer.matchesPlayed,
        newPlayer.provisional
      ]
    );

    // Clear player cache to refresh the player list
    clearPlayerCache(); // Clear all player cache entries

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating player from user profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to create player' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}