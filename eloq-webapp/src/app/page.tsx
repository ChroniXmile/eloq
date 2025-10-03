import { PlayerRankingList } from '@/components/player-ranking-list';
import { fetchPlayers } from '@/lib/data-connection';
import { Player } from '@/models/player';
import { Trophy, Users, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientDots } from '@/components/ui/gradient-dots';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Globe } from '@/components/ui/globe';
import { PlayerTournamentBeam } from '@/components/ui/player-tournament-beam';
import CountUp from '@/components/CountUp';
// import ProfileCard from '@/components/jazzycard';
import ProfileCard from '@/components/jazzycard';
import Link from 'next/link';
import HomeHero from '@/components/home-hero';
import { ConfettiName } from '@/components/ConfettiOver';
import React from 'react';

export default async function Home() {
  // Fetch players from the database
  const players: Player[] = await fetchPlayers();

  // Get top players for featured section
  const topPlayers = players.slice(0, 5);

  // Calculate some stats
  const totalPlayers = players.length;
  const validRatedPlayers = players.filter(
    (player) => typeof player.rating === 'number' && !isNaN(player.rating)
  );
  const avgRating =
    validRatedPlayers.length > 0
      ? Math.round(
          validRatedPlayers.reduce((sum, player) => sum + player.rating, 0) /
            validRatedPlayers.length
        )
      : 0;

  const validMatchPlayers = players.filter(
    (player) =>
      typeof player.matchesPlayed === 'number' && !isNaN(player.matchesPlayed)
  );
  const totalMatches = validMatchPlayers.reduce(
    (sum, player) => sum + player.matchesPlayed,
    0
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 relative overflow-hidden bg-background">
        <HomeHero />
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 mt-8">
          Track player performance and ratings with our accurate ELO system
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

      {/* Bento Grid Section */}
      <section className="py-8">
        <BentoGrid className="max-w-none mx-auto px-4">
          <BentoCard
            name="Player Rankings"
            className="md:col-span-2"
            background={
              <div className="absolute inset-0 rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1">
                <PlayerTournamentBeam />
              </div>
            }
            Icon={Trophy}
            description="Track player rankings with our Elo-like rating system."
            href="/players"
            cta="View Rankings"
          />
          <BentoCard
            name="Tournaments"
            className="md:col-span-1"
            background={
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl" />
            }
            Icon={Calendar}
            description="Browse upcoming tournaments and match results."
            href="/tournaments"
            cta="View Tournaments"
          />
          <BentoCard
            name="Performance Stats"
            className="md:col-span-1"
            background={
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl" />
            }
            Icon={TrendingUp}
            description={`🏆 Avg. Rating: ${avgRating} 📊`}
            href="/profile"
            cta="View Stats"
          />
          <BentoCard
            name="Match History"
            className="md:col-span-2"
            background={
              <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 transition duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">
                    <CountUp
                      to={totalMatches}
                      duration={3}
                      className="font-bold text-5xl md:text-6xl"
                    />
                  </div>
                  <div className="text-lg text-primary/70 mt-2">
                    Matches Played
                  </div>
                </div>
              </div>
            }
            Icon={BarChart3}
            description="Review your match history and performance trends."
            href="/profile"
            cta="View History"
          />
          <BentoCard
            name="Community"
            className="md:col-span-1"
            background={
              <div className="absolute inset-0 rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1">
                <Globe className="size-full accent-auto" />
              </div>
            }
            Icon={Users}
            description="Connect with other players in the pool community."
            href="/players"
            cta="Join Community"
          />
          <BentoCard
            name="Leaderboards"
            className="md:col-span-1"
            background={
              <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 transition duration-500 ease-in-out transform hover:scale-105 hover:-translate-y-1">
                <ConfettiName topPlayers={topPlayers} />
              </div>
            }
            Icon={TrendingUp}
            description="See top performers in various categories."
            href="/players"
            cta="View Leaders"
          />
          <BentoCard
            name="Tournament Calendar"
            className="md:col-span-1"
            background={
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl" />
            }
            Icon={Calendar}
            description="Stay updated with upcoming events and schedules."
            href="/calendar"
            cta="View Calendar"
          />
        </BentoGrid>
      </section>

      {/* Stats Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Players
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlayers}</div>
              <p className="text-xs text-muted-foreground">
                Active in the system
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
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="block"
            >
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
                    <span
                      className={`text-lg font-semibold ${player.winRate && player.winRate >= 70 ? 'text-green-600' : player.winRate && player.winRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
                    >
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
              Our Elo-like rating system tracks player performance across
              tournaments, adjusting ratings based on match outcomes, opponent
              strength, and other factors.
            </p>
            <p className="text-muted-foreground">
              Players start with a provisional rating and transition to
              established status after 30 matches. Ratings are updated after
              each match based on performance relative to expectations.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
