import { Webhook, type WebhookRequiredHeaders } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

  // If there's no secret defined, error out
  if (!webhookSecret) {
    return new Response('Error: Missing Clerk webhook secret', {
      status: 500,
    });
  }

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid signature', {
      status: 400,
    });
  }

  // Get the ID and type of the webhook event
  const { id: userId } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    // Create a new user in our database when a user is created in Clerk
    try {
      const { email_addresses, first_name, last_name, username, image_url } = evt.data;
      const email = email_addresses?.[0]?.email_address || '';
      const displayName = [first_name, last_name].filter(Boolean).join(' ') || username || 'Anonymous';

      await query(
        `INSERT INTO users (id, username, email, display_name, avatar_url, created_at, last_login) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
         ON CONFLICT (id) DO UPDATE SET
           email = EXCLUDED.email,
           display_name = EXCLUDED.display_name,
           avatar_url = EXCLUDED.avatar_url,
           last_login = NOW()`,
        [userId, username, email, displayName, image_url]
      );

      console.log(`User ${userId} created in local database`);
    } catch (error) {
      console.error('Error creating user in local database:', error);
      return new Response('Error: Failed to create user in local database', {
        status: 500,
      });
    }
  } else if (eventType === 'user.updated') {
    // Update user in our database when a user is updated in Clerk
    try {
      const { email_addresses, first_name, last_name, username, image_url } = evt.data;
      const email = email_addresses?.[0]?.email_address || '';
      const displayName = [first_name, last_name].filter(Boolean).join(' ') || username || 'Anonymous';

      await query(
        `UPDATE users 
         SET email = $2, display_name = $3, avatar_url = $4, last_login = NOW()
         WHERE id = $1`,
        [userId, email, displayName, image_url]
      );

      console.log(`User ${userId} updated in local database`);
    } catch (error) {
      console.error('Error updating user in local database:', error);
      return new Response('Error: Failed to update user in local database', {
        status: 500,
      });
    }
  } else if (eventType === 'user.deleted') {
    // Remove user from our database when a user is deleted in Clerk
    try {
      await query('DELETE FROM users WHERE id = $1', [userId]);
      
      console.log(`User ${userId} deleted from local database`);
    } catch (error) {
      console.error('Error deleting user from local database:', error);
      return new Response('Error: Failed to delete user from local database', {
        status: 500,
      });
    }
  }

  return new Response('', { status: 200 });
}