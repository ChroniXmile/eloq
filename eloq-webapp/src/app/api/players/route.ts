import { NextRequest } from 'next/server';
import { getPlayers } from '@/lib/db/database-service';
import { getLatestBackup, listAvailableBackups } from '@/lib/db/backup-service';
import { getPlayers as getMockPlayers } from '@/services/mock-data-service';

export async function GET(request: NextRequest) {
  try {
    const players = await getPlayers();
    return new Response(JSON.stringify(players), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching players from database:', error);
    
    // Fallback to backup data
    try {
      const latestBackupPath = await getLatestBackup('./backups');
      if (latestBackupPath) {
        const fs = (await import('fs')).default;
        const backupDataStr = fs.readFileSync(latestBackupPath, 'utf-8');
        const backupData = JSON.parse(backupDataStr);
        return new Response(JSON.stringify(backupData.players), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (backupError) {
      console.error('Error fetching players from backup:', backupError);
    }
    
    // If backup fails, fallback to mock data
    try {
      const mockPlayers = getMockPlayers();
      return new Response(JSON.stringify(mockPlayers), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (mockError) {
      console.error('Error fetching mock players:', mockError);
    }
    
    return new Response(JSON.stringify({ error: 'Failed to fetch players' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}