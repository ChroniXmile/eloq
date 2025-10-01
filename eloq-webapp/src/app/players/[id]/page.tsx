import { fetchPlayerById, fetchPlayerRatingHistory } from "@/lib/data-connection";
import { PlayerDetails } from "@/components/player-details";
import { Player } from "@/models/player";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static params for all players
export async function generateStaticParams() {
  // In a real app, you might want to fetch all player IDs from the database
  // For now, we'll return an empty array to use dynamic rendering
  return [];
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch player and rating history from the database
  const [player, ratingHistory] = await Promise.all([
    fetchPlayerById(id),
    fetchPlayerRatingHistory(id)
  ]);
  
  // If player not found, return 404
  if (!player) {
    notFound();
  }

  return (
    <div className="container py-8">
      <PlayerDetails player={player} ratingHistory={ratingHistory} />
    </div>
  );
}