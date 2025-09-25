'use client';

import { Player } from "@/models/player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, Trophy, Users, BarChart3, PlusCircle, MinusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import Link from "next/link";
import PlayerRatingAreaChart from "@/components/player-rating-area-chart";



// Function to convert rating history to chart format
function formatRatingHistory(player: Player) {
  if (!player.ratingHistory || player.ratingHistory.length === 0) {
    // If there's no rating history, create a single point with current rating
    return [{
      date: new Date().toISOString().split('T')[0],
      [player.id]: player.rating
    }];
  }
  
  // Convert the rating history to the format expected by the chart
  return player.ratingHistory.map(historyEntry => ({
    date: historyEntry.date.toISOString().split('T')[0],
    [player.id]: historyEntry.rating
  }));
}

// Function to merge rating histories of multiple players
function mergeRatingHistories(players: Player[]) {
  if (players.length === 0) return [];
  
  // Create a map of all unique dates
  const allDates = new Set<string>();
  players.forEach(player => {
    if (player.ratingHistory) {
      player.ratingHistory.forEach(entry => {
        allDates.add(entry.date.toISOString().split('T')[0]);
      });
    } else {
      // If no history, add today's date
      allDates.add(new Date().toISOString().split('T')[0]);
    }
  });
  
  // Create a sorted array of dates
  const sortedDates = Array.from(allDates).sort();
  
  // Create the combined chart data with all players' data filled in for each date
  const combinedData: any[] = sortedDates.map(dateStr => {
    const dataPoint: any = { date: dateStr };
    
    // Add each player's rating for this date
    players.forEach(player => {
      // Find the rating for this specific date
      const matchingHistory = player.ratingHistory?.find(entry => 
        entry.date.toISOString().split('T')[0] === dateStr
      );
      
      if (matchingHistory) {
        dataPoint[player.id] = matchingHistory.rating;
      } else {
        // Find the closest date before this date with rating data
        const previousRating = player.ratingHistory
          ?.filter(entry => entry.date.toISOString().split('T')[0] < dateStr)
          .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
        
        // Use the previous rating if found, otherwise use current rating
        dataPoint[player.id] = previousRating ? previousRating.rating : player.rating;
      }
    });
    
    return dataPoint;
  });
  
  return combinedData;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 20;

  useEffect(() => {
    async function loadPlayers() {
      try {
        const response = await fetch('/api/players');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedPlayers = await response.json();
        
        // Sort players by rating in descending order
        const sortedPlayers = [...fetchedPlayers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        // Add mock rating history if players don't have it (for testing purposes)
        const playersWithHistory = sortedPlayers.map((player, index) => {
          if (!player.ratingHistory || player.ratingHistory.length === 0) {
            // Generate mock rating history for this player
            const history = [];
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3); // 3 months ago
            
            for (let i = 0; i < 12; i++) {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i * 7); // Every week
              
              // Create a fluctuating rating around the current rating
              const fluctuation = Math.random() * 100 - 50; // -50 to +50
              const rating = Math.max(1000, player.rating + fluctuation); // Ensure minimum rating of 1000
              
              history.push({
                date: new Date(date), // Create a new Date object to avoid reference issues
                rating: rating
              });
            }
            
            return {
              ...player,
              ratingHistory: history
            };
          }
          return player;
        });
        
        setPlayers(playersWithHistory);
        setFilteredPlayers(playersWithHistory);
        setCurrentPage(0);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch players:", error);
        setLoading(false);
      }
    }
    
    loadPlayers();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPlayers(players);
      setCurrentPage(0);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = players.filter(player => 
      player.name.toLowerCase().includes(lowerQuery) ||
      player.rating.toString().includes(query) ||
      (player.ranking && player.ranking.toString().includes(query))
    );
    
    setFilteredPlayers(filtered);
    setCurrentPage(0);
  };

  // Function to add a player to the chart
  const addPlayerToChart = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) return; // Already added
    
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Add the player to selected players
    const newSelectedPlayers = [...selectedPlayers, playerId];
    setSelectedPlayers(newSelectedPlayers);
    
    // Get all selected players with their rating histories
    const selectedPlayerObjects = players.filter(p => newSelectedPlayers.includes(p.id));
    
    // Create new combined chart data
    const newChartData = mergeRatingHistories(selectedPlayerObjects);
    setChartData(newChartData);
  };

  // Function to remove a player from the chart
  const removePlayerFromChart = (playerId: string) => {
    const newSelectedPlayers = selectedPlayers.filter(id => id !== playerId);
    setSelectedPlayers(newSelectedPlayers);
    
    if (newSelectedPlayers.length === 0) {
      // If no players selected, clear the chart
      setChartData([]);
    } else {
      // Get the remaining selected players
      const selectedPlayerObjects = players.filter(p => newSelectedPlayers.includes(p.id));
      
      // Create new combined chart data
      const newChartData = mergeRatingHistories(selectedPlayerObjects);
      setChartData(newChartData);
    }
  };

  

  // Players for the chart with unique colors
  const chartPlayers = players
    .filter(p => selectedPlayers.includes(p.id))
    .map((p, index) => {
      // Define a set of distinct colors for players
      const colors = [
        "hsl(210, 100%, 50%)", // Blue
        "hsl(135, 100%, 35%)", // Green
        "hsl(30, 100%, 50%)",  // Orange
        "hsl(270, 100%, 60%)", // Purple
        "hsl(330, 100%, 60%)", // Pink
        "hsl(60, 100%, 50%)",  // Yellow
        "hsl(0, 100%, 55%)",   // Red
        "hsl(180, 100%, 40%)", // Teal
      ];
      
      const color = colors[index % colors.length];
      return {
        id: p.id,
        name: p.name,
        color: color,
      };
    });

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-muted-foreground">Browse all registered players</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchBar 
                placeholder="Search by name, ranking, or rating..." 
                onSearch={handleSearch}
                className="max-w-md"
              />
            </CardContent>
          </Card>
          
          <div>Loading players...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
          <p className="text-muted-foreground">Browse all registered players</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar 
              placeholder="Search by name, ranking, or rating..." 
              onSearch={handleSearch}
              className="max-w-md"
            />
          </CardContent>
        </Card>
        
        {/* Players Table */}
        <Card>
          <CardHeader>
            <CardTitle>Player Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Rank</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Player</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Rating</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Wins</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Losses</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Win %</th>
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPlayers
                    .slice(currentPage * playersPerPage, (currentPage + 1) * playersPerPage)
                    .map((player) => (
                      <tr key={player.id} className="hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="pool-ball-solid w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold rounded-full">
                            #{player.ranking}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <Link href={`/players/${player.id}`} className="hover:underline">
                            {player.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{player.rating}</td>
                        <td className="py-3 px-4">{player.wins}</td>
                        <td className="py-3 px-4">{player.losses}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            player.winRate && player.winRate >= 70 
                              ? 'text-green-600' 
                              : player.winRate && player.winRate >= 50 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                          }`}>
                            {player.winRate || 0}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {selectedPlayers.includes(player.id) ? (
                            <button 
                              onClick={() => removePlayerFromChart(player.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800"
                              aria-label={`Remove ${player.name} from chart`}
                            >
                              <MinusCircle className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => addPlayerToChart(player.id)}
                              className="flex items-center gap-1 text-primary hover:text-primary/80"
                              aria-label={`Add ${player.name} to chart`}
                            >
                              <PlusCircle className="h-4 w-4" />
                              <span>Add</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(currentPage * playersPerPage + 1, filteredPlayers.length)} to {Math.min((currentPage + 1) * playersPerPage, filteredPlayers.length)} of {filteredPlayers.length} players
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded-md ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage + 1} of {Math.ceil(filteredPlayers.length / playersPerPage) || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPlayers.length / playersPerPage) - 1))}
                  disabled={currentPage === Math.ceil(filteredPlayers.length / playersPerPage) - 1 || filteredPlayers.length === 0}
                  className={`px-3 py-1 rounded-md ${currentPage === Math.ceil(filteredPlayers.length / playersPerPage) - 1 || filteredPlayers.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Player Ratings Comparison Chart */}
        {selectedPlayers.length > 0 && (
          <PlayerRatingAreaChart 
            playerData={chartData}
            players={chartPlayers}
            title="Player Rating History Comparison"
            description="Compare rating changes over time"
          />
        )}
      </div>
    </div>
  );
}