// Tournaments page
// This page displays a list of all tournaments

import { TournamentList } from "@/components/tournament-list";
import { fetchTournaments } from "@/lib/data-connection";
import { Tournament } from "@/models/tournament";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  PlusCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TournamentsPage() {
  // Fetch tournaments from the database
  const tournaments: Tournament[] = await fetchTournaments();

  // Calculate some stats
  const totalTournaments = tournaments.length;
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').length;
  const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing').length;
  const completedTournaments = tournaments.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tournaments</h1>
          <p className="text-muted-foreground">
            Browse and register for upcoming pool tournaments
          </p>
        </div>
        <Button asChild>
          <Link href="/tournaments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tournament
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTournaments}</div>
            <p className="text-xs text-muted-foreground">Tournaments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTournaments}</div>
            <p className="text-xs text-muted-foreground">Events scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingTournaments}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTournaments}</div>
            <p className="text-xs text-muted-foreground">Finished events</p>
          </CardContent>
        </Card>
      </div>

      {/* Tournament List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tournaments</CardTitle>
          <CardDescription>
            Browse all tournaments by date, location, or tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TournamentList tournaments={tournaments} />
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our tournaments are organized by tier level, from local events to major championships. 
            Each tournament follows standardized rules and uses our Elo-like rating system to 
            update player rankings based on performance.
          </p>
          <p className="text-muted-foreground">
            Players can register for upcoming tournaments, view brackets, and track results. 
            Tournament directors can create and manage events through the admin panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}