// Admin page for database initialization
// This page allows administrators to initialize the database and upload CSV files

'use client';

import { useState, useRef } from 'react';
import { initializeDatabase } from '@/lib/db/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Trophy,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AdminPage() {
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string; error?: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataTypeRef = useRef<string>('');
  
  // Test database connection
  const handleTestConnection = async () => {
    try {
      const result = await fetch('/api/test-connection');
      const data = await result.json();
      setConnectionResult(data);
    } catch (error) {
      setConnectionResult({ 
        success: false, 
        message: 'Failed to test database connection', 
        error: (error as Error).message 
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (file: File, dataType: string) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataType', dataType);
      
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setUploadStatus(result);
    } catch (error) {
      setUploadStatus({ 
        success: false, 
        message: 'Failed to upload CSV file', 
        error: (error as Error).message 
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (dataType: string) => {
    dataTypeRef.current = dataType;
    if (fileInputRef.current) {
      fileInputRef.current.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          await handleFileUpload(file, dataTypeRef.current);
        }
      };
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Database Administration</h1>
          <p className="text-muted-foreground mt-2">
            Initialize and manage your PostgreSQL database
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
              <CardDescription>
                Test and initialize your database connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectionResult ? (
                <Alert variant={connectionResult.success ? "default" : "destructive"}>
                  <AlertTitle className="flex items-center gap-2">
                    {connectionResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {connectionResult.success ? "Connected Successfully" : "Connection Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {connectionResult.message}
                    {connectionResult.error && (
                      <span className="block mt-1 text-xs">{connectionResult.error}</span>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Test your database connection to verify it's working properly
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleTestConnection} 
                className="w-full"
                variant={connectionResult?.success ? "secondary" : "default"}
              >
                {connectionResult?.success ? "Test Again" : "Test Connection"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Initialize Database Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Initialize Database
              </CardTitle>
              <CardDescription>
                Create tables and populate with mock data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                This will create the necessary tables and populate them with mock data for testing.
              </div>
            </CardContent>
            <CardFooter>
              <form action={initializeDatabase} className="w-full">
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Initialize Database
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        
        {/* CSV Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV Data
            </CardTitle>
            <CardDescription>
              Import player, match, and tournament data from CSV files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Players Upload */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-full flex flex-col gap-2 py-6">
                    <Users className="h-8 w-8" />
                    <span>Players</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Players CSV</DialogTitle>
                    <DialogDescription>
                      Import player data from a CSV file. The file should contain columns for id, name, rating, ranking, wins, losses, win_rate, avatar_url, join_date, last_played, country, breaks, highest_break, description, matches_played, and provisional.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="players-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input 
                        id="players-csv" 
                        type="file" 
                        accept=".csv" 
                        className="col-span-3"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'players');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => handleFileSelect('players')}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Matches Upload */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-full flex flex-col gap-2 py-6">
                    <Trophy className="h-8 w-8" />
                    <span>Matches</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Matches CSV</DialogTitle>
                    <DialogDescription>
                      Import match data from a CSV file. The file should contain columns for id, date, event_id, event_tier, format, discipline, balls_per_rack, race_to, player_i, player_j, racks_i, racks_j, balls_i, balls_j, and field_avg.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="matches-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input 
                        id="matches-csv" 
                        type="file" 
                        accept=".csv" 
                        className="col-span-3"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'matches');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => handleFileSelect('matches')}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Tournaments Upload */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-full flex flex-col gap-2 py-6">
                    <Calendar className="h-8 w-8" />
                    <span>Tournaments</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Tournaments CSV</DialogTitle>
                    <DialogDescription>
                      Import tournament data from a CSV file. The file should contain columns for id, name, date, location, prize_pool, tier, field_avg_rating, participants, results, status, and description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tournaments-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input 
                        id="tournaments-csv" 
                        type="file" 
                        accept=".csv" 
                        className="col-span-3"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'tournaments');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => handleFileSelect('tournaments')}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Upload Status */}
            {uploadStatus && (
              <div className="mt-6">
                <Alert variant={uploadStatus.success ? "default" : "destructive"}>
                  <AlertTitle className="flex items-center gap-2">
                    {uploadStatus.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {uploadStatus.success ? "Upload Successful" : "Upload Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {uploadStatus.message}
                    {uploadStatus.error && (
                      <span className="block mt-1 text-xs">{uploadStatus.error}</span>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
        />
      </div>
    </div>
  );
}