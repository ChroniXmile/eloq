// Modern player details component using shadcn/ui
// This component displays detailed information about a specific player

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Award, 
  Target, 
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { Player } from '@/models/player';
import Link from 'next/link';

interface PlayerDetailsProps {
  player: Player;
}

export function PlayerDetails({ player }: PlayerDetailsProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 1800) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (rating >= 1600) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (rating >= 1400) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600 dark:text-green-400';
    if (winRate >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (ratingChange: number) => {
    if (ratingChange > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (ratingChange < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rankings
        </Link>
      </Button>

      {/* Player Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={player.avatarUrl} alt={player.name} />
              <AvatarFallback className="text-2xl">
                {player.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-3xl font-bold">{player.name}</h1>
                {player.provisional && (
                  <Badge variant="secondary">Provisional</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-xl font-bold">#{player.ranking}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <Badge className={getRatingColor(player.rating)}>
                    {player.rating}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">
                    Joined {new Date(player.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className={`text-2xl font-bold ${getWinRateColor(player.winRate)}`}>
                  {player.winRate}%
                </div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {player.wins}W - {player.losses}L
                </div>
                <div className="text-sm text-muted-foreground">Record</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{player.matchesPlayed}</div>
            <Progress value={(player.matchesPlayed / 100) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Century Breaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              {player.breaks}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Break</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{player.highestBreak}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              {player.country}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Player biography and additional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {player.description}
          </p>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <p className="text-sm text-muted-foreground">
                Last played on {new Date(player.lastPlayed).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Performance Trend</h4>
              <div className="flex items-center gap-2">
                {getTrendIcon(5)} {/* Mock rating change */}
                <span className="text-sm">+5 points in last match</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button>View Match History</Button>
        <Button variant="outline">Compare with Another Player</Button>
        <Button variant="outline">Add to Favorites</Button>
      </div>
    </div>
  );
}