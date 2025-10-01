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
  ArrowLeft,
} from 'lucide-react';
import { Player } from '@/models/player';
import Link from 'next/link';
import ProfileCard from '@/components/jazzycard';
import CountUp from '@/components/CountUp';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PlayerDetailsProps {
  player: Player;
  ratingHistory?: {
    date: Date;
    matchId: string;
    opponent: string;
    opponentRating: number;
    ratingBefore: number;
    ratingAfter: number;
    ratingChange: number;
    event: string;
  }[];
}

export function PlayerDetails({ player, ratingHistory }: PlayerDetailsProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 1800)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (rating >= 1600)
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (rating >= 1400)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600 dark:text-green-400';
    if (winRate >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (ratingChange: number) => {
    if (ratingChange > 0)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (ratingChange < 0)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Convert rating history to chart data format
  const chartData =
    ratingHistory && ratingHistory.length > 0
      ? ratingHistory.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString('en', {
            month: 'short',
            year: '2-digit',
          }),
          rating: entry.ratingAfter,
        }))
      : [
          { date: 'Jan 24', rating: player.rating },
          { date: 'Current', rating: player.rating },
        ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rankings
        </Link>
      </Button>

      {/* Player Header - ProfileCard and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jazzy Card - Top Left */}
        <div className="lg:col-span-1">
          <ProfileCard
            // avatarUrl={player.avatarUrl || '<Placeholder for avatar URL>'}
            avatarUrl={'/avatars/shane.webp'}
            iconUrl={'/avatars/iconpattern.png'}
            grainUrl={'/avatars/grain.webp'}
            name={player.name}
            title={`#${player.ranking} | Rating: ${player.rating}`}
            handle={player.country || 'Player'}
            status={player.provisional ? 'Provisional' : 'Established'}
            contactText="❤️"
            miniAvatarUrl={player.avatarUrl}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => {
              window.location.href = `/players/${player.id}`;
            }}
          />
        </div>

        {/* Ranking History Chart - Next to Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Rating History
              </CardTitle>
              <CardDescription>
                Your rating progression over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}`, 'Rating']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Matches Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp to={player.matchesPlayed} duration={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Century Breaks
            </CardTitle>
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
          <p className="text-muted-foreground">{player.description}</p>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <p className="text-sm text-muted-foreground">
                Last played on{' '}
                {new Date(player.lastPlayed).toLocaleDateString()}
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
