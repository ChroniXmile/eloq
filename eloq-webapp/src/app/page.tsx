import { PlayerRankingList } from "@/components/player-ranking-list";
import { fetchPlayers } from "@/lib/data-connection";
import { Player } from "@/models/player";
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientDots } from "@/components/ui/gradient-dots";
import Link from "next/link";

export default async function Home() {
  // Fetch players from the database
  const players: Player[] = await fetchPlayers();

  // Get top players for featured section
  const topPlayers = players.slice(0, 5);
  
  // Calculate some stats
  const totalPlayers = players.length;
  const validRatedPlayers = players.filter(player => 
    typeof player.rating === 'number' && !isNaN(player.rating)
  );
  const avgRating = validRatedPlayers.length > 0 
    ? Math.round(validRatedPlayers.reduce((sum, player) => sum + player.rating, 0) / validRatedPlayers.length)
    : 0;
    
  const validMatchPlayers = players.filter(player => 
    typeof player.matchesPlayed === 'number' && !isNaN(player.matchesPlayed)
  );
  const totalMatches = validMatchPlayers.reduce((sum, player) => sum + player.matchesPlayed, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 relative overflow-hidden">
        <GradientDots className="-z-10 opacity-30" dotSize={2} spacing={30} duration={40} />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Pool/Billiards <span className="text-primary">Rankings</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Track player performance and rankings with our Elo-like rating system
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/players">View All Players</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tournaments">Browse Tournaments</Link>
          </Button>
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlayers}</div>
              <p className="text-xs text-muted-foreground">Active in the system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating}</div>
              <p className="text-xs text-muted-foreground">Across all players</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMatches}</div>
              <p className="text-xs text-muted-foreground">Total this season</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{topPlayers[0]?.ranking || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {topPlayers[0]?.name || 'No players'} leads
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Players */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Players</h2>
          <Button variant="link" asChild>
            <Link href="/players">View All →</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {topPlayers.map((player) => (
            <Link key={player.id} href={`/players/${player.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="pool-ball-solid w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    #{player.ranking}
                  </div>
                  <div>
                    <CardTitle>{player.name}</CardTitle>
                    <CardDescription>{player.country}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{player.rating}</span>
                    <span className={`text-lg font-semibold ${player.winRate && player.winRate >= 70 ? 'text-green-600' : player.winRate && player.winRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {player.winRate || 0}%
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {player.wins}W - {player.losses}L
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Rankings Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 100 Players</h2>
        <PlayerRankingList players={players} />
      </section>

      {/* About Section */}
      <section className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">About Our Rating System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our Elo-like rating system tracks player performance across tournaments, 
              adjusting ratings based on match outcomes, opponent strength, and other factors.
            </p>
            <p className="text-muted-foreground">
              Players start with a provisional rating and transition to established status 
              after 30 matches. Ratings are updated after each match based on performance 
              relative to expectations.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}