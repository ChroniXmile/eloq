// Tournament detail page
// This page displays detailed information about a specific tournament

import { fetchTournamentById } from "@/lib/data-connection";
import { TournamentDetails } from "@/components/tournament-details";
import { Tournament } from "@/models/tournament";
import { notFound } from "next/navigation";

// Generate static params for all tournaments
export async function generateStaticParams() {
  // In a real app, you might want to fetch all tournament IDs from the database
  // For now, we'll return an empty array to use dynamic rendering
  return [];
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch tournament from the database
  const tournament: Tournament | undefined = await fetchTournamentById(id);
  
  // If tournament not found, return 404
  if (!tournament) {
    notFound();
  }

  return (
    <div className="container py-8">
      <TournamentDetails tournament={tournament} />
    </div>
  );
}