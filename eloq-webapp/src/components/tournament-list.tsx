// Modern tournament list component using shadcn/ui
// This component displays a list of tournaments with their key information

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
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Search,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tournament } from '@/models/tournament';
import Link from 'next/link';

interface TournamentListProps {
  tournaments: Tournament[];
  isLoading?: boolean;
}

export function TournamentList({ tournaments, isLoading = false }: TournamentListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Tournament; direction: 'asc' | 'desc' } | null>(null);

  const filteredTournaments = React.useMemo(() => {
    let filtered = tournaments;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tournament => 
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [tournaments, searchTerm, sortConfig]);

  const requestSort = (key: keyof Tournament) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'major':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100';
      case 'national':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100';
      case 'regional':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100';
      case 'local':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
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
                <TableHead>Tournament</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
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
            placeholder="Search tournaments..."
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
            <DropdownMenuItem onClick={() => requestSort('date')}>
              Sort by Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('name')}>
              Sort by Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('tier')}>
              Sort by Tier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('status')}>
              Sort by Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('name')}
                  className="px-0 font-bold"
                >
                  Tournament
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
                  onClick={() => requestSort('date')}
                  className="px-0 font-bold"
                >
                  Date
                  {sortConfig?.key === 'date' && (
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
                  onClick={() => requestSort('location')}
                  className="px-0 font-bold"
                >
                  Location
                  {sortConfig?.key === 'location' && (
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
                  onClick={() => requestSort('tier')}
                  className="px-0 font-bold"
                >
                  Tier
                  {sortConfig?.key === 'tier' && (
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
                  onClick={() => requestSort('participants')}
                  className="px-0 font-bold"
                >
                  <Users className="mr-1 h-4 w-4" />
                  {sortConfig?.key === 'participants' && (
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
                  onClick={() => requestSort('status')}
                  className="px-0 font-bold"
                >
                  Status
                  {sortConfig?.key === 'status' && (
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
            {filteredTournaments.map((tournament) => (
              <TableRow 
                key={tournament.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => window.location.href = `/tournaments/${tournament.id}`}
              >
                <TableCell>
                  <div className="font-medium">{tournament.name}</div>
                  <div className="text-sm text-muted-foreground md:hidden">
                    {new Date(tournament.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tournament.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTierColor(tournament.tier)}>
                    {tournament.tier.charAt(0).toUpperCase() + tournament.tier.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{tournament.participants?.length || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredTournaments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No tournaments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}