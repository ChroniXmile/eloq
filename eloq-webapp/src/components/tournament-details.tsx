// Modern tournament details component using shadcn/ui
// This component displays detailed information about a specific tournament

'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Target,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Tournament } from '@/models/tournament';
import Link from 'next/link';

interface TournamentDetailsProps {
  tournament: Tournament;
}

export function TournamentDetails({ tournament }: TournamentDetailsProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'major':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'national':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'regional':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'local':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/tournaments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournaments
        </Link>
      </Button>

      {/* Tournament Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="pool-table-bg w-24 h-24 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{formatDate(tournament.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span>{tournament.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <Badge className={getTierColor(tournament.tier)}>
                    {tournament.tier.charAt(0).toUpperCase() + tournament.tier.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  {tournament.prizePool.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  {tournament.participants?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Field Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(tournament.fieldAvgRating).toFixed(2)}</div>
            <Progress value={((tournament.fieldAvgRating - 1000) / 1000) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournament.participants?.length || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {tournament.participants?.length ? 'Registered players' : 'No participants yet'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(tournament.status)} variant="secondary">
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground mt-2">
              {tournament.status === 'completed' 
                ? 'Tournament finished' 
                : tournament.status === 'ongoing' 
                ? 'Currently in progress' 
                : 'Scheduled for future date'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {tournament.description && (
        <Card>
          <CardHeader>
            <CardTitle>Tournament Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {tournament.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>
            Registered players for this tournament
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.participants && tournament.participants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tournament.participants.slice(0, 6).map((participantId, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-lg border p-3">
                  <div className="pool-ball-solid w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">Player {index + 1}</div>
                    <div className="text-sm text-muted-foreground">Rating: 1500</div>
                  </div>
                </div>
              ))}
              {tournament.participants.length > 6 && (
                <div className="flex items-center justify-center rounded-lg border p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">+{tournament.participants.length - 6}</div>
                    <div className="text-sm text-muted-foreground">More players</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No participants registered</h3>
              <p className="text-muted-foreground">
                Players will be registered closer to the tournament date
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button>Register for Tournament</Button>
        <Button variant="outline">View Bracket</Button>
        <Button variant="outline">Tournament Rules</Button>
      </div>
    </div>
  );
}