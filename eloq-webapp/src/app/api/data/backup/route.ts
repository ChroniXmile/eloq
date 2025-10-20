import { NextRequest } from 'next/server';
import { createDatabaseBackup } from '@/lib/db/backup-service';
import path from 'path';
import { initializeDataConnection } from '@/lib/data-connection';

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDataConnection();
    
    // Generate a backup file path with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(
      process.cwd(), 
      'backups', 
      `db-backup-${timestamp}.json`
    );
    
    // Create the backup
    const result = await createDatabaseBackup(backupPath);
    
    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message,
          backupFile: result.backupFile
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error creating database backup:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: (error as Error).message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Database backup endpoint. Send a POST request to create a backup.',
      usage: 'POST /api/data/backup'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}