import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { User } from '@/models/user';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await query<User>(`
      SELECT 
        id, username, email, display_name as "displayName", avatar_url as "avatarUrl",
        favorite_players as "favoritePlayers", recently_viewed as "recentlyViewed",
        preferences, created_at as "createdAt", last_login as "lastLogin"
      FROM users
      WHERE id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const user = result.rows[0];
    
    // Parse JSON fields
    const parsedUser: User = {
      ...user,
      recentlyViewed: typeof user.recentlyViewed === 'string' ? JSON.parse(user.recentlyViewed) : user.recentlyViewed || [],
      preferences: typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences || {}
    };
    
    return new Response(JSON.stringify(parsedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const userData: Partial<User> = await request.json();
    
    // Prepare update query based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 2; // Start from $2 since $1 is userId
    
    if (userData.displayName !== undefined) {
      updateFields.push(`display_name = ${paramIndex}`);
      values.push(userData.displayName);
      paramIndex++;
    }
    
    if (userData.email !== undefined) {
      updateFields.push(`email = ${paramIndex}`);
      values.push(userData.email);
      paramIndex++;
    }
    
    if (userData.avatarUrl !== undefined) {
      updateFields.push(`avatar_url = ${paramIndex}`);
      values.push(userData.avatarUrl);
      paramIndex++;
    }
    
    if (userData.preferences !== undefined) {
      updateFields.push(`preferences = ${paramIndex}`);
      values.push(JSON.stringify(userData.preferences));
      paramIndex++;
    }
    
    // Add userId to the end of values array
    values.push(userId);
    
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build the query
    const queryStr = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = ${paramIndex}
      RETURNING id, username, email, display_name as "displayName", avatar_url as "avatarUrl",
                favorite_players as "favoritePlayers", recently_viewed as "recentlyViewed",
                preferences, created_at as "createdAt", last_login as "lastLogin"
    `;
    
    const result = await query<User>(queryStr, values);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updatedUser = result.rows[0];
    
    // Parse JSON fields
    const parsedUser: User = {
      ...updatedUser,
      recentlyViewed: typeof updatedUser.recentlyViewed === 'string' ? JSON.parse(updatedUser.recentlyViewed) : updatedUser.recentlyViewed || [],
      preferences: typeof updatedUser.preferences === 'string' ? JSON.parse(updatedUser.preferences) : updatedUser.preferences || {}
    };
    
    return new Response(JSON.stringify(parsedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}