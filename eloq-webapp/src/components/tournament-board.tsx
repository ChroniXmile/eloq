// Modern Tournament Board component with double elimination bracket
// Interactive, searchable, mobile-responsive tournament visualization

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trophy,
  Clock,
  MapPin,
  TrendingUp,
  Users,
  Filter,
  Settings,
  RefreshCw,
} from 'lucide-react';
import {
  TournamentBracket,
  BracketMatch,
  BracketPlayer,
  BracketUIConfig,
  BracketNavigationState,
  MatchStatus,
  BracketType,
} from '@/models/tournament-board';
import { cn } from '@/lib/utils';

interface TournamentBoardProps {
  bracket: TournamentBracket;
  players: BracketPlayer[];
  onMatchClick?: (match: BracketMatch) => void;
  onPlayerClick?: (player: BracketPlayer) => void;
  isLive?: boolean;
  className?: string;
  showAvatars?: boolean;
  onAvatarToggle?: (show: boolean) => void;
}

interface BracketMatchProps {
  match: BracketMatch;
  players: BracketPlayer[];
  config: BracketUIConfig;
  onClick?: () => void;
  isHighlighted?: boolean;
  searchTerm?: string;
  showAvatars?: boolean;
}

interface BracketColumnProps {
  round: any; // BracketRound
  config: BracketUIConfig;
  players: BracketPlayer[];
  onMatchClick?: (match: BracketMatch) => void;
  highlightedMatchId?: string;
  searchTerm?: string;
  showAvatars?: boolean;
}

const DEFAULT_UI_CONFIG: BracketUIConfig = {
  cellWidth: 260,
  cellHeight: 90,
  horizontalSpacing: 80,
  verticalSpacing: 12,
  roundSpacing: 140,
  fontSize: {
    playerName: 12,
    matchInfo: 9,
    roundTitle: 13,
  },
  colors: {
    background: 'bg-card',
    border: 'border-border',
    text: 'text-foreground',
    highlight: 'bg-primary/10 border-primary',
    winner:
      'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    loser: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  },
};

function BracketMatchComponent({
  match,
  players,
  config,
  onClick,
  isHighlighted,
  searchTerm,
  showAvatars = false,
}: BracketMatchProps) {
  const player1 = players.find((p) => p.id === match.player1?.id);
  const player2 = players.find((p) => p.id === match.player2?.id);

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'bye':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const isMatchHighlighted =
    searchTerm &&
    ((player1?.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
      false) ||
      (player2?.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      isHighlighted);

  return (
    <div
      className={cn(
        'relative border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md',
        config.colors.background,
        config.colors.border,
        isMatchHighlighted && config.colors.highlight,
        match.status === 'completed' && config.colors.winner,
        'hover:scale-105'
      )}
      style={{
        width: config.cellWidth,
        minHeight: config.cellHeight,
      }}
      onClick={onClick}
    >
      {/* Status Badge & Table */}
      <div className="flex justify-between items-start mb-1">
        <Badge
          className={cn('text-xs px-2 py-0.5', getStatusColor(match.status))}
        >
          {match.status.replace('-', ' ')}
        </Badge>
        {match.tableNumber && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.tableNumber}
          </div>
        )}
      </div>

      {/* Players - Compact Layout */}
      <div className="space-y-1 flex-1">
        {/* Player 1 */}
        <div
          className={cn(
            'flex items-center gap-1.5 p-1.5 rounded text-xs',
            match.player1Score !== undefined &&
              match.player2Score !== undefined &&
              match.player1Score > match.player2Score &&
              'bg-green-100 dark:bg-green-900/20'
          )}
        >
          {showAvatars && (
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={player1?.avatarUrl} alt={player1?.name} />
              <AvatarFallback className="text-xs">
                {player1?.name?.slice(0, 2).toUpperCase() ?? '??'}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'font-medium truncate leading-tight',
                  isMatchHighlighted &&
                    player1?.name
                      .toLowerCase()
                      .includes(searchTerm?.toLowerCase() ?? '') &&
                    'bg-yellow-200 dark:bg-yellow-800'
                )}
              >
                {player1?.name ?? 'TBD'}
              </div>
              {match.player1Odds && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded flex-shrink-0">
                  {match.player1Odds}:1
                </span>
              )}
            </div>
          </div>
          {match.player1Score !== undefined && (
            <div className="text-xs font-bold flex-shrink-0">
              {match.player1Score}
            </div>
          )}
        </div>

        {/* Match Time - Centered */}
        {match.scheduledTime && (
          <div className="flex items-center justify-center py-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(match.scheduledTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}

        {/* Player 2 */}
        <div
          className={cn(
            'flex items-center gap-1.5 p-1.5 rounded text-xs',
            match.player1Score !== undefined &&
              match.player2Score !== undefined &&
              match.player2Score > match.player1Score &&
              'bg-green-100 dark:bg-green-900/20'
          )}
        >
          {showAvatars && (
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={player2?.avatarUrl} alt={player2?.name} />
              <AvatarFallback className="text-xs">
                {player2?.name?.slice(0, 2).toUpperCase() ?? '??'}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'font-medium truncate leading-tight',
                  isMatchHighlighted &&
                    player2?.name
                      .toLowerCase()
                      .includes(searchTerm?.toLowerCase() ?? '') &&
                    'bg-yellow-200 dark:bg-yellow-800'
                )}
              >
                {player2?.name ?? 'TBD'}
              </div>
              {match.player2Odds && (
                <span className="text-xs bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded flex-shrink-0">
                  {match.player2Odds}:1
                </span>
              )}
            </div>
          </div>
          {match.player2Score !== undefined && (
            <div className="text-xs font-bold flex-shrink-0">
              {match.player2Score}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BracketColumn({
  round,
  config,
  players,
  onMatchClick,
  highlightedMatchId,
  searchTerm,
  showAvatars = false,
}: BracketColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Round Title - Compact */}
      <div className="text-center">
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
          {round.title}
        </h3>
        <div className="text-xs text-muted-foreground/70 mt-0.5">
          {round.matches.length} matches
        </div>
      </div>

      {/* Matches - Tighter Spacing */}
      <div className="space-y-2">
        {round.matches.map((match: BracketMatch, index: number) => (
          <div key={match.id} className="relative">
            <BracketMatchComponent
              match={match}
              players={players}
              config={config}
              onClick={() => onMatchClick?.(match)}
              isHighlighted={highlightedMatchId === match.id}
              searchTerm={searchTerm}
              showAvatars={showAvatars}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TournamentBoard({
  bracket,
  players,
  onMatchClick,
  onPlayerClick,
  isLive = false,
  className,
  showAvatars = false,
  onAvatarToggle,
}: TournamentBoardProps) {
  const [navigationState, setNavigationState] =
    React.useState<BracketNavigationState>({
      currentRound: bracket.currentRound,
      zoomLevel: 1,
      scrollPosition: { x: 0, y: 0 },
      searchTerm: '',
      searchResults: [],
    });

  const [uiConfig] = React.useState<BracketUIConfig>(DEFAULT_UI_CONFIG);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Search functionality
  const filteredBracket = React.useMemo(() => {
    if (!navigationState.searchTerm) return bracket;

    // Filter matches that contain search term in player names
    const filtered = {
      ...bracket,
      winnersBracket: bracket.winnersBracket
        .map((round) => ({
          ...round,
          matches: round.matches.filter((match) => {
            const player1 = players.find((p) => p.id === match.player1?.id);
            const player2 = players.find((p) => p.id === match.player2?.id);
            return (
              (player1?.name
                .toLowerCase()
                .includes(navigationState.searchTerm.toLowerCase()) ??
                false) ||
              (player2?.name
                .toLowerCase()
                .includes(navigationState.searchTerm.toLowerCase()) ??
                false)
            );
          }),
        }))
        .filter((round) => round.matches.length > 0),
      losersBracket: bracket.losersBracket
        .map((round) => ({
          ...round,
          matches: round.matches.filter((match) => {
            const player1 = players.find((p) => p.id === match.player1?.id);
            const player2 = players.find((p) => p.id === match.player2?.id);
            return (
              (player1?.name
                .toLowerCase()
                .includes(navigationState.searchTerm.toLowerCase()) ??
                false) ||
              (player2?.name
                .toLowerCase()
                .includes(navigationState.searchTerm.toLowerCase()) ??
                false)
            );
          }),
        }))
        .filter((round) => round.matches.length > 0),
    };

    return filtered;
  }, [bracket, players, navigationState.searchTerm]);

  const handleSearch = (term: string) => {
    setNavigationState((prev) => ({ ...prev, searchTerm: term }));
  };

  const handleZoom = (delta: number) => {
    setNavigationState((prev) => ({
      ...prev,
      zoomLevel: Math.max(0.5, Math.min(2, prev.zoomLevel + delta)),
    }));
  };

  const scrollToRound = (roundNumber: number) => {
    const roundElement = containerRef.current?.querySelector(
      `[data-round="${roundNumber}"]`
    );
    roundElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Header Controls */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {bracket.tournamentName} - Double Elimination
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {bracket.totalPlayers} Players
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Round {bracket.currentRound}
                </span>
                {isLive && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    LIVE
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(-0.1)}
                disabled={navigationState.zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(navigationState.zoomLevel * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(0.1)}
                disabled={navigationState.zoomLevel >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search players or matches..."
                className="pl-10"
                value={navigationState.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Quick Navigation */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToRound(1)}
              >
                Round 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToRound(bracket.currentRound)}
              >
                Current
              </Button>
              {bracket.finals.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToRound(bracket.finals[0].round)}
                >
                  Finals
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bracket Visualization */}
      <Card className="flex-1">
        <CardContent className="p-4 h-full">
          <div
            ref={containerRef}
            className="w-full h-full overflow-auto"
            style={{
              transform: `scale(${navigationState.zoomLevel})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="flex gap-6 min-w-max">
              {/* Winners Bracket - Left Side */}
              <div className="flex flex-col">
                <div className="text-center mb-3">
                  <h2 className="text-base font-bold text-green-600 dark:text-green-400">
                    Winners
                  </h2>
                </div>

                <div className="flex gap-6 relative">
                  {filteredBracket.winnersBracket.map((round, index) => (
                    <div key={round.roundNumber} className="relative">
                      <div data-round={round.roundNumber}>
                        <BracketColumn
                          round={round}
                          config={uiConfig}
                          players={players}
                          onMatchClick={onMatchClick}
                          highlightedMatchId={
                            navigationState.highlightedMatchId
                          }
                          searchTerm={navigationState.searchTerm}
                          showAvatars={showAvatars}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Section - Finals */}
              {filteredBracket.finals.length > 0 && (
                <div className="flex flex-col items-center justify-center px-4">
                  {/* Finals Header */}
                  <div className="text-center mb-3 relative z-10">
                    <div className="bg-background px-3 py-1 rounded border">
                      <h2 className="text-base font-bold text-yellow-600 dark:text-yellow-400">
                        Championship
                      </h2>
                    </div>
                  </div>

                  {/* Finals Matches */}
                  <div className="flex gap-3 relative z-10">
                    {filteredBracket.finals.map((match) => (
                      <div key={match.id} className="relative">
                        <BracketMatchComponent
                          match={match}
                          players={players}
                          config={uiConfig}
                          onClick={() => onMatchClick?.(match)}
                          isHighlighted={
                            navigationState.highlightedMatchId === match.id
                          }
                          searchTerm={navigationState.searchTerm}
                          showAvatars={showAvatars}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Losers Bracket - Right Side */}
              {filteredBracket.losersBracket.length > 0 && (
                <div className="flex flex-col">
                  <div className="text-center mb-3">
                    <h2 className="text-base font-bold text-red-600 dark:text-red-400">
                      Losers
                    </h2>
                  </div>

                  <div className="flex gap-6 relative">
                    {filteredBracket.losersBracket.map((round, index) => (
                      <div key={round.roundNumber} className="relative">
                        <div data-round={round.roundNumber}>
                          <BracketColumn
                            round={round}
                            config={uiConfig}
                            players={players}
                            onMatchClick={onMatchClick}
                            highlightedMatchId={
                              navigationState.highlightedMatchId
                            }
                            searchTerm={navigationState.searchTerm}
                            showAvatars={showAvatars}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
