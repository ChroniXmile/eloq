// Enhanced Tournament Board with real-time updates and mobile-first design
// Includes WebSocket integration, touch gestures, and advanced features

'use client';

import * as React from 'react';
import { TournamentBoard } from './tournament-board';
import {
  TournamentBracket,
  BracketMatch,
  BracketPlayer,
} from '@/models/tournament-board';
import { TournamentUpdate } from '@/hooks/use-tournament-updates';
import { useTournamentUpdates } from '@/hooks/use-tournament-updates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Wifi,
  WifiOff,
  Settings,
  Users,
  TrendingUp,
  Activity,
  Smartphone,
  Monitor,
  RefreshCw,
  Maximize2,
  Minimize2,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTournamentBoardProps {
  tournamentId: string;
  initialBracket: TournamentBracket;
  players: BracketPlayer[];
  onMatchClick?: (match: BracketMatch) => void;
  onPlayerClick?: (player: BracketPlayer) => void;
  className?: string;
}

interface TouchGestureState {
  isGesturing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  scale: number;
}

export function EnhancedTournamentBoard({
  tournamentId,
  initialBracket,
  players,
  onMatchClick,
  onPlayerClick,
  className,
}: EnhancedTournamentBoardProps) {
  const [bracket, setBracket] =
    React.useState<TournamentBracket>(initialBracket);
  const [selectedMatch, setSelectedMatch] = React.useState<BracketMatch | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile' | 'auto'>(
    'auto'
  );
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);
  const [showAvatars, setShowAvatars] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const gestureStateRef = React.useRef<TouchGestureState>({
    isGesturing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    scale: 1,
  });

  // Real-time updates
  const { isConnected, isConnecting, error, connectionState, sendUpdate } =
    useTournamentUpdates({
      tournamentId,
      enabled: true,
      onUpdate: (update: TournamentUpdate) => {
        console.log('Tournament update received:', update);

        switch (update.type) {
          case 'match_update':
            if (update.matchId) {
              setBracket((prev) => {
                const updateBracket = (matches: BracketMatch[]) =>
                  matches.map((match) =>
                    match.id === update.matchId
                      ? { ...match, ...update.data }
                      : match
                  );

                return {
                  ...prev,
                  winnersBracket: prev.winnersBracket.map((round) => ({
                    ...round,
                    matches: updateBracket(round.matches),
                  })),
                  losersBracket: prev.losersBracket.map((round) => ({
                    ...round,
                    matches: updateBracket(round.matches),
                  })),
                  finals: updateBracket(prev.finals),
                  lastUpdated: new Date(),
                };
              });
            }
            break;

          case 'bracket_update':
            setBracket((prev) => ({ ...prev, ...update.data }));
            break;

          case 'tournament_status':
            setBracket((prev) => ({ ...prev, status: update.data.status }));
            break;
        }
      },
    });

  // Touch gesture handlers for mobile
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      gestureStateRef.current = {
        isGesturing: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        scale: gestureStateRef.current.scale,
      };
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      gestureStateRef.current.isGesturing = true;
    }
  }, []);

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (!gestureStateRef.current.isGesturing) return;

    if (e.touches.length === 1 && containerRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - gestureStateRef.current.startX;
      const deltaY = touch.clientY - gestureStateRef.current.startY;

      containerRef.current.scrollLeft =
        gestureStateRef.current.currentX - deltaX;
      containerRef.current.scrollTop =
        gestureStateRef.current.currentY - deltaY;
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      // Calculate scale based on distance (simplified)
      const scale = Math.max(0.5, Math.min(2, distance / 200));
      gestureStateRef.current.scale = scale;
    }
  }, []);

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    gestureStateRef.current.isGesturing = false;
  }, []);

  // Handle match updates from admin
  const handleMatchUpdate = React.useCallback(
    (matchId: string, updateData: Partial<BracketMatch>) => {
      sendUpdate(matchId, updateData);
    },
    [sendUpdate]
  );

  // Auto-detect optimal view mode
  React.useEffect(() => {
    const detectViewMode = () => {
      if (viewMode === 'auto') {
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        return isMobile ? 'mobile' : 'desktop';
      }
      return viewMode;
    };

    const handleResize = () => {
      if (viewMode === 'auto') {
        // Trigger re-render to adjust mobile layout
        setViewMode(detectViewMode());
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2">
      {isConnecting ? (
        <Badge variant="secondary" className="animate-pulse">
          <RefreshCw className="w-3 h-3 mr-1" />
          Connecting...
        </Badge>
      ) : isConnected ? (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <Wifi className="w-3 h-3 mr-1" />
          Live
        </Badge>
      ) : (
        <Badge variant="destructive">
          <WifiOff className="w-3 h-3 mr-1" />
          Offline
        </Badge>
      )}
      {error && (
        <Badge variant="destructive" className="text-xs">
          {error}
        </Badge>
      )}
    </div>
  );

  // Tournament stats
  const tournamentStats = React.useMemo(() => {
    const totalMatches =
      bracket.winnersBracket.reduce(
        (acc, round) => acc + round.matches.length,
        0
      ) +
      bracket.losersBracket.reduce(
        (acc, round) => acc + round.matches.length,
        0
      ) +
      bracket.finals.length;

    const completedMatches = [
      ...bracket.winnersBracket.flatMap((round) => round.matches),
      ...bracket.losersBracket.flatMap((round) => round.matches),
      ...bracket.finals,
    ].filter((match) => match.status === 'completed').length;

    const inProgressMatches = [
      ...bracket.winnersBracket.flatMap((round) => round.matches),
      ...bracket.losersBracket.flatMap((round) => round.matches),
      ...bracket.finals,
    ].filter((match) => match.status === 'in-progress').length;

    return {
      totalMatches,
      completedMatches,
      inProgressMatches,
      completionPercentage:
        totalMatches > 0
          ? Math.round((completedMatches / totalMatches) * 100)
          : 0,
    };
  }, [bracket]);

  return (
    <div className={cn('w-full h-full', className)}>
      {/* Enhanced Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5" />
                {bracket.tournamentName}
                <ConnectionStatus />
              </CardTitle>

              {/* Tournament Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {bracket.totalPlayers} Players
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Round {bracket.currentRound}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  {tournamentStats.completedMatches}/
                  {tournamentStats.totalMatches} Complete
                </span>
                {tournamentStats.inProgressMatches > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {tournamentStats.inProgressMatches} Live
                  </Badge>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="h-8 px-2"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="h-8 px-2"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              {/* Admin Panel */}
              <Sheet open={showAdminPanel} onOpenChange={setShowAdminPanel}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Tournament Admin</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Live Controls</h4>
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          onClick={() =>
                            handleMatchUpdate('all', { status: 'in-progress' })
                          }
                        >
                          Start All Matches
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.location.reload()}
                        >
                          Refresh Data
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Display Options</h4>
                      <div className="space-y-2">
                        <Button
                          variant={showAvatars ? 'default' : 'outline'}
                          className="w-full justify-start"
                          onClick={() => setShowAvatars(!showAvatars)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Show Avatars
                          {showAvatars ? ' (ON)' : ' (OFF)'}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Connection Status</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          Status: <ConnectionStatus />
                        </div>
                        <div>State: {connectionState}</div>
                        <div>Updates: Real-time</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tournament Board */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-lg border bg-card',
          isFullscreen && 'fixed inset-0 z-50 bg-background',
          viewMode === 'mobile' && 'touch-pan-x touch-pinch-zoom'
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <TournamentBoard
          bracket={bracket}
          players={players}
          onMatchClick={(match) => {
            setSelectedMatch(match);
            onMatchClick?.(match);
          }}
          onPlayerClick={onPlayerClick}
          isLive={isConnected}
          showAvatars={showAvatars}
          onAvatarToggle={setShowAvatars}
          className={cn(
            'h-full',
            viewMode === 'mobile' && 'scale-90 origin-top-left sm:scale-100'
          )}
        />

        {/* Mobile Navigation Overlay - Repositioned */}
        {viewMode === 'mobile' && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 sm:hidden">
            <Card className="px-2 py-1.5 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-xs">👆 Tap matches</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="text-xs">↔️ Swipe rounds</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="text-xs">🔍 Pinch zoom</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Match Detail Modal/Sheet */}
      {selectedMatch && (
        <Sheet
          open={!!selectedMatch}
          onOpenChange={() => setSelectedMatch(null)}
        >
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Match Details</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {selectedMatch.bracketType} - Round {selectedMatch.round}
                </p>
              </div>

              {selectedMatch.player1 && selectedMatch.player2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {selectedMatch.player1.name}
                      </span>
                      {selectedMatch.player1Score !== undefined && (
                        <Badge variant="outline">
                          {selectedMatch.player1Score}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Rating: {selectedMatch.player1.rating}
                    </span>
                  </div>

                  <div className="text-center text-muted-foreground">VS</div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {selectedMatch.player2.name}
                      </span>
                      {selectedMatch.player2Score !== undefined && (
                        <Badge variant="outline">
                          {selectedMatch.player2Score}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Rating: {selectedMatch.player2.rating}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium">Table</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMatch.tableNumber || 'TBD'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Time</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMatch.scheduledTime
                      ? new Date(
                          selectedMatch.scheduledTime
                        ).toLocaleTimeString()
                      : 'TBD'}
                  </div>
                </div>
              </div>

              {selectedMatch.player1Odds && selectedMatch.player2Odds && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Betting Odds</div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {selectedMatch.player1?.name}: {selectedMatch.player1Odds}
                      :1
                    </Badge>
                    <Badge variant="outline">
                      {selectedMatch.player2?.name}: {selectedMatch.player2Odds}
                      :1
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
