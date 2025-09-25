// User dashboard page
// This page displays personalized information for logged-in users

import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Award,
  Target,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { fetchUserDashboard } from '@/lib/data-connection';

export default async function DashboardPage() {
  // Fetch user dashboard data from the database
  const dashboardData = await fetchUserDashboard();

  const { user, favoritePlayers, recentlyViewed, upcomingTournaments } =
    dashboardData;

  // Mock recent activity for now
  const recentActivity = [
    {
      id: 'activity-1',
      type: 'match',
      description: 'You commented on match between John Smith and Emma Johnson',
      timestamp: new Date('2023-06-20'),
    },
    {
      id: 'activity-2',
      type: 'player',
      description: 'You favorited player Michael Brown',
      timestamp: new Date('2023-06-19'),
    },
    {
      id: 'activity-3',
      type: 'tournament',
      description: 'You registered for Regional Open',
      timestamp: new Date('2023-06-18'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback>
              {user.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.displayName}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your favorite players and tournaments
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/profile">Edit Profile</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Players
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.favoritePlayers.length}
            </div>
            <p className="text-xs text-muted-foreground">Tracked players</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tournaments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingTournaments.length}
            </div>
            <p className="text-xs text-muted-foreground">Events this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">
              Actions in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Age</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(
                (new Date().getTime() - user.createdAt.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Days since joining</p>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Players */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Favorite Players
            </CardTitle>
            <CardDescription>
              Your most-watched players and their current standings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoritePlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer no-underline"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.avatarUrl} alt={player.name} />
                      <AvatarFallback>
                        {player.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold">#{player.ranking}</div>
                      <div className="text-sm text-muted-foreground">
                        Ranking
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">{player.rating}</div>
                      <div className="text-sm text-muted-foreground">
                        Rating
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${player.winRate >= 70 ? 'text-green-600' : player.winRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {player.winRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Win Rate
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" asChild>
                <Link href="/players">View All Players →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest actions and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.type === 'match' ? (
                      <Trophy className="h-4 w-4 text-blue-500" />
                    ) : activity.type === 'player' ? (
                      <Users className="h-4 w-4 text-green-500" />
                    ) : (
                      <Calendar className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" asChild>
                <Link href="/activity">View All Activity →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tournaments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tournaments
          </CardTitle>
          <CardDescription>Events you might be interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer no-underline"
              >
                <div>
                  <div className="font-medium">{tournament.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tournament.date).toLocaleDateString()} •{' '}
                    {tournament.location}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">
                    ${tournament.prizePool.toLocaleString()}
                  </div>
                  <Badge className="mt-1" variant="secondary">
                    {tournament.tier}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/tournaments">View All Tournaments →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Preferences
          </CardTitle>
          <CardDescription>Customize your ELOQ experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">
                {user.preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-muted-foreground">
                {user.preferences.notifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Favorite Stats</h4>
              <div className="flex flex-wrap gap-1">
                {user.preferences.favoriteStats.map((stat: string) => (
                  <Badge key={stat} variant="secondary">
                    {stat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/settings">Update Preferences →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
