import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { User } from '@/models/user';
import { auth, currentUser } from '@clerk/nextjs/server';

// Helper function to create a user in the database
async function createUserInDatabase(userId: string) {
  // Get user data from Clerk using the currentUser function
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error('Could not retrieve user from Clerk');
  }
  
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
  const displayName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 
                     clerkUser.username || 'Anonymous';
  
  const userData = {
    id: clerkUser.id,
    username: clerkUser.username || '',
    email,
    displayName,
    avatarUrl: clerkUser.imageUrl || '',
  };

  // Insert the user into the database
  const result = await query<User>(
    `INSERT INTO users (id, username, email, display_name, avatar_url, created_at, last_login) 
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       display_name = EXCLUDED.display_name,
       avatar_url = EXCLUDED.avatar_url,
       last_login = NOW()
     RETURNING id, username, email, display_name as "displayName", 
               avatar_url as "avatarUrl", favorite_players as "favoritePlayers", 
               recently_viewed as "recentlyViewed", preferences, 
               created_at as "createdAt", last_login as "lastLogin"`,
    [userData.id, userData.username, userData.email, userData.displayName, userData.avatarUrl]
  );

  return result.rows[0];
}

export async function GET(request: NextRequest) {
  try {
    const authObject = await auth();
    const { userId } = authObject;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let result = await query<User>(`
      SELECT 
        id, username, email, display_name as "displayName", avatar_url as "avatarUrl",
        favorite_players as "favoritePlayers", recently_viewed as "recentlyViewed",
        preferences, created_at as "createdAt", last_login as "lastLogin"
      FROM users
      WHERE id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      // User doesn't exist in our database, create it from Clerk data
      const user = await createUserInDatabase(userId);
      
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
    const authObject = await auth();
    const { userId } = authObject;
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const userData: Partial<User> = await request.json();
    
    // First, check if user exists in our database
    const checkResult = await query<User>(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    
    if (checkResult.rows.length === 0) {
      // User doesn't exist, create them first
      await createUserInDatabase(userId);
    }
    
    // Prepare update query based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [userId]; // Start with userId at index 0 (for $1 in WHERE clause)
    let paramIndex = 2; // Start from $2 since $1 is userId
    
    if (userData.displayName !== undefined) {
      updateFields.push(`display_name = $${paramIndex}`);
      values.push(userData.displayName);
      paramIndex++;
    }
    
    if (userData.email !== undefined) {
      updateFields.push(`email = $${paramIndex}`);
      values.push(userData.email);
      paramIndex++;
    }
    
    if (userData.avatarUrl !== undefined) {
      updateFields.push(`avatar_url = $${paramIndex}`);
      values.push(userData.avatarUrl);
      paramIndex++;
    }
    
    if (userData.preferences !== undefined) {
      updateFields.push(`preferences = $${paramIndex}`);
      values.push(JSON.stringify(userData.preferences));
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build the query - userId is at $1, update parameters start at $2
    const queryStr = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $1
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