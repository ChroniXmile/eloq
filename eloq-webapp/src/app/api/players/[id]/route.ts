import { NextRequest } from 'next/server';
import { getPlayerById } from '@/lib/db/database-service';
import { getLatestBackup } from '@/lib/db/backup-service';
import { getPlayerById as getMockPlayerById } from '@/services/mock-data-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await getPlayerById(params.id);
    
    if (!player) {
      // Try backup data as fallback
      try {
        const latestBackupPath = await getLatestBackup('./backups');
        if (latestBackupPath) {
          const fs = (await import('fs')).default;
          const backupDataStr = fs.readFileSync(latestBackupPath, 'utf-8');
          const backupData = JSON.parse(backupDataStr);
          const backupPlayer = backupData.players.find((p: any) => p.id === params.id);
          
          if (backupPlayer) {
            return new Response(JSON.stringify(backupPlayer), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
        }
      } catch (backupError) {
        console.error('Error fetching player from backup:', backupError);
      }
      
      // If backup fails, try mock data as fallback
      try {
        const mockPlayer = getMockPlayerById(params.id);
        if (mockPlayer) {
          return new Response(JSON.stringify(mockPlayer), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (mockError) {
        console.error('Error fetching mock player:', mockError);
      }
      
      return new Response(JSON.stringify({ error: 'Player not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return new Response(JSON.stringify(player), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`Error fetching player with ID ${params.id}:`, error);
    
    // Fallback to backup data
    try {
      const latestBackupPath = await getLatestBackup('./backups');
      if (latestBackupPath) {
        const fs = (await import('fs')).default;
        const backupDataStr = fs.readFileSync(latestBackupPath, 'utf-8');
        const backupData = JSON.parse(backupDataStr);
        const backupPlayer = backupData.players.find((p: any) => p.id === params.id);
        
        if (backupPlayer) {
          return new Response(JSON.stringify(backupPlayer), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }
    } catch (backupError) {
      console.error('Error fetching player from backup:', backupError);
    }
  
    // If backup fails, fallback to mock data
    try {
      const mockPlayer = getMockPlayerById(params.id);
      if (mockPlayer) {
        return new Response(JSON.stringify(mockPlayer), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (mockError) {
      console.error('Error fetching mock player:', mockError);
    }
    
    return new Response(JSON.stringify({ error: 'Failed to fetch player' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}