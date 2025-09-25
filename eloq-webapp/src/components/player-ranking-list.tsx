// Modern player ranking list component using shadcn/ui
// This component displays a list of players with their rankings and key statistics

'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Player } from '@/models/player';
import Link from 'next/link';

interface PlayerRankingListProps {
  players: Player[];
  isLoading?: boolean;
}

export function PlayerRankingList({ players, isLoading = false }: PlayerRankingListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Player; direction: 'asc' | 'desc' } | null>(null);

  const filteredPlayers = React.useMemo(() => {
    let filtered = players;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [players, searchTerm, sortConfig]);

  const requestSort = (key: keyof Player) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1800) return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100';
    if (rating >= 1600) return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100';
    if (rating >= 1400) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600 dark:text-green-400';
    if (winRate >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-10"
              disabled
            />
          </div>
          <Button variant="outline" disabled>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden md:table-cell">Record</TableHead>
                <TableHead>Win %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => requestSort('ranking')}>
              Sort by Rank
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('rating')}>
              Sort by Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('name')}>
              Sort by Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('winRate')}>
              Sort by Win Rate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <Button
                  variant="ghost"
                  onClick={() => requestSort('ranking')}
                  className="px-0 font-bold"
                >
                  Rank
                  {sortConfig?.key === 'ranking' && (
                    <>
                      {sortConfig.direction === 'asc' ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('name')}
                  className="px-0 font-bold"
                >
                  Player
                  {sortConfig?.key === 'name' && (
                    <>
                      {sortConfig.direction === 'asc' ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('rating')}
                  className="px-0 font-bold"
                >
                  Rating
                  {sortConfig?.key === 'rating' && (
                    <>
                      {sortConfig.direction === 'asc' ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => requestSort('wins')}
                  className="px-0 font-bold"
                >
                  Record
                  {sortConfig?.key === 'wins' && (
                    <>
                      {sortConfig.direction === 'asc' ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('winRate')}
                  className="px-0 font-bold"
                >
                  Win %
                  {sortConfig?.key === 'winRate' && (
                    <>
                      {sortConfig.direction === 'asc' ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow 
                key={player.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => window.location.href = `/players/${player.id}`}
              >
                <TableCell className="font-bold">
                  <div className="flex items-center">
                    {player.ranking <= 3 ? (
                      <Trophy className={`h-4 w-4 mr-1 ${
                        player.ranking === 1 ? 'text-yellow-500' : 
                        player.ranking === 2 ? 'text-gray-400' : 'text-amber-800'
                      }`} />
                    ) : null}
                    #{player.ranking}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={player.avatarUrl} alt={player.name} />
                      <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {player.wins}W - {player.losses}L
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRatingColor(player.rating)}>
                    {player.rating}
                    {player.provisional && (
                      <span className="ml-1 text-xs">※</span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center space-x-2">
                    <span>{player.wins}W - {player.losses}L</span>
                    <Progress 
                      value={(player.wins / (player.wins + player.losses)) * 100} 
                      className="w-24" 
                      aria-label="Win rate progress"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${getWinRateColor(player.winRate)}`}>
                    {player.winRate}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredPlayers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No players found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}