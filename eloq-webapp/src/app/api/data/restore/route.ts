import { NextRequest } from 'next/server';
import { restoreDatabaseFromBackup, getLatestBackup, listAvailableBackups } from '@/lib/db/backup-service';
import path from 'path';
import { initializeDataConnection } from '@/lib/data-connection';

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDataConnection();
    
    // Get the backup file to restore from request body
    const { backupFile } = await request.json();
    
    let backupPath: string;
    
    if (!backupFile) {
      // If no specific file is provided, use the latest backup
      const latestBackup = await getLatestBackup(path.join(process.cwd(), 'backups'));
      if (!latestBackup) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'No backup files found'
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      backupPath = latestBackup;
    } else {
      backupPath = path.join(process.cwd(), 'backups', backupFile);
    }
    
    // Restore the database from the backup
    const result = await restoreDatabaseFromBackup(backupPath);
    
    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message
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
    console.error('Error restoring database from backup:', error);
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
  try {
    // List all available backups
    const backupDir = path.join(process.cwd(), 'backups');
    const backups = await listAvailableBackups(backupDir);
    
    return new Response(
      JSON.stringify({
        message: 'Database restore endpoint. Send a POST request to restore from a backup.',
        usage: 'POST /api/data/restore (with backupFile in body)',
        availableBackups: backups
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error listing backups:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error listing backup files',
        error: (error as Error).message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}