import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatabaseBackup, RotateCcw, Download, Upload, HardDrive } from 'lucide-react';
import { createDatabaseBackup } from '@/lib/db/backup-service';
import { promises as fsPromises } from 'fs';
import path from 'path';
import * as React from 'react';

export default async function BackupManagementPage() {
  // List available backups
  const backupDir = path.join(process.cwd(), 'backups');
  let backupFiles: string[] = [];
  
  try {
    const dirContents = await fsPromises.readdir(backupDir);
    backupFiles = dirContents
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        // Sort by date - assuming format is db-backup-YYYY-MM-DDTHH:MM:SSZ.json
        const dateA = new Date(a.match(/db-backup-(.+)Z\.json/)?.[1] || '');
        const dateB = new Date(b.match(/db-backup-(.+)Z\.json/)?.[1] || '');
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  } catch (error) {
    console.error('Error reading backup directory:', error);
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Database Backup Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and restore database backups
          </p>
        </div>

        {/* Create Backup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseBackup className="h-5 w-5" />
              Create New Backup
            </CardTitle>
            <CardDescription>
              Create a backup of the current database state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              action={async () => {
                'use server';
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupPath = path.join(
                  process.cwd(), 
                  'backups', 
                  `db-backup-${timestamp}.json`
                );
                await createDatabaseBackup(backupPath);
                // Refresh the page after backup is created
                // In a real app, you would use router.refresh() or similar
              }}
            >
              <Button type="submit">
                <DatabaseBackup className="mr-2 h-4 w-4" />
                Create Backup Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Available Backups Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available Backups</CardTitle>
            <CardDescription>
              {backupFiles.length > 0 
                ? `Found ${backupFiles.length} backup(s)` 
                : 'No backups available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backupFiles.length > 0 ? (
              <div className="space-y-4">
                {backupFiles.map((file, index) => {
                  // Parse date from filename
                  const dateMatch = file.match(/db-backup-(.+)Z\.json/);
                  const date = dateMatch ? new Date(dateMatch[1].replace(/-/g, ':')) : null;
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{file}</div>
                        {date && (
                          <div className="text-sm text-muted-foreground">
                            {date.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <form 
                          action={async () => {
                            'use server';
                            // Code to restore from this backup
                            console.log('Restore from backup:', file);
                          }}
                        >
                          <Button variant="outline" size="sm" type="submit">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <DatabaseBackup className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No backups available</h3>
                <p className="text-muted-foreground">
                  Create your first backup using the button above
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backup Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Settings</CardTitle>
            <CardDescription>
              Configure automatic backup scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Backups</h4>
                  <p className="text-sm text-muted-foreground">
                    Scheduled every hour
                  </p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Next Backup</h4>
                  <p className="text-sm text-muted-foreground">
                    In 45 minutes
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep last 10 backups
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}