'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Dot,
  Edit,
  ExternalLink,
  LineChart,
  PlayCircle,
  Replace,
  ShieldCheck,
  Trophy,
  Users2,
} from 'lucide-react';

/**
 * Tournament Bracket Component (shadcn/ui)
 *
 * Drop-in, touch-friendly bracket viewer + lightweight admin controls.
 * Formats: single elimination, double elimination (winners/losers), round robin.
 *
 * Integrations
 * - Data source: Next.js API routes backed by PostgreSQL (you already have these).
 * - Live updates: WebSocket/SSE/polling via `transport` prop and `apiBase`.
 * - Admin gating: pass `isAdmin` to enable creation/reporting controls.
 * - Betting: optional panel + hook for external provider (real-money handled offsite).
 *
 * Usage
 * <TournamentBracket
 *    tournamentId={id}
 *    apiBase="/api"
 *    transport="ws"
 *    isAdmin={session?.user.role === 'admin'}
 * />
 */

// --- Types -----------------------------------------------------------------

export type TournamentFormat = 'single' | 'double' | 'round_robin';
export type BracketLane = 'winners' | 'losers' | 'finals' | 'rr';

export type Player = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  seed?: number | null;
  rating?: number | null; // optional ELO
};

export type Match = {
  id: string;
  round: number; // 1..N
  bracket: BracketLane;
  position: number; // ordering within round
  table?: string | number | null;
  raceTo?: number | null; // best-of or race-to
  scheduledAt?: string | null; // ISO
  playerA?: Player | null;
  playerB?: Player | null;
  scoreA?: number | null;
  scoreB?: number | null;
  winnerId?: string | null;
  status: 'pending' | 'live' | 'completed';
};

export type Tournament = {
  id: string;
  name: string;
  sport: 'billiards' | string;
  format: TournamentFormat;
  status: 'draft' | 'live' | 'completed';
  startsAt?: string | null;
  location?: string | null;
};

export type TournamentPayload = {
  tournament: Tournament;
  matches: Match[];
};

export type Transport = 'ws' | 'sse' | 'poll';

export type TournamentBracketProps = {
  tournamentId?: string;
  tournament?: Tournament;
  matches?: Match[];
  apiBase?: string; // e.g. "/api" or "https://your.domain/api"
  transport?: Transport;
  pollMs?: number; // only if transport=="poll"
  isAdmin?: boolean;
  className?: string;
  // callbacks (optional)
  onMatchClick?: (m: Match) => void;
  onReportScore?: (
    matchId: string,
    scoreA: number,
    scoreB: number
  ) => Promise<void> | void;
  onAssignTable?: (matchId: string, table: string) => Promise<void> | void;
  onSwapPlayers?: (matchId: string) => Promise<void> | void;
  onCreateNextRounds?: (tournamentId: string) => Promise<void> | void;
  // betting hooks
  onOpenBetting?: (m: Match) => void;
};

// --- Utilities --------------------------------------------------------------

const fmtTime = (iso?: string | null) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
};

function groupByRound(matches: Match[], lane: BracketLane) {
  const filtered = matches.filter((m) => m.bracket === lane);
  const rounds = new Map<number, Match[]>();
  for (const m of filtered) {
    if (!rounds.has(m.round)) rounds.set(m.round, []);
    rounds.get(m.round)!.push(m);
  }
  return Array.from(rounds.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, arr]) => arr.sort((x, y) => x.position - y.position));
}

// --- Live data hook ---------------------------------------------------------

function useLiveTournament(params: {
  tournamentId?: string;
  initial?: TournamentPayload | null;
  apiBase?: string;
  transport?: Transport;
  pollMs?: number;
}) {
  const {
    tournamentId,
    initial,
    apiBase = '/api',
    transport = 'ws',
    pollMs = 5000,
  } = params;
  const [payload, setPayload] = useState<TournamentPayload | null>(
    initial ?? null
  );
  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  // initial fetch if needed
  useEffect(() => {
    let ignore = false;
    async function bootstrap() {
      if (initial || !tournamentId) return;
      const res = await fetch(`${apiBase}/tournaments/${tournamentId}`);
      if (!res.ok) return;
      const data = (await res.json()) as TournamentPayload;
      if (!ignore) setPayload(data);
    }
    bootstrap();
    return () => {
      ignore = true;
    };
  }, [tournamentId, apiBase]);

  // live transport
  useEffect(() => {
    if (!tournamentId) return;

    if (transport === 'ws') {
      // ws URL helper
      const toWs = (u: string) => {
        try {
          const url = new URL(
            u,
            globalThis.location?.href ?? 'http://localhost'
          );
          url.protocol = url.protocol.replace('http', 'ws');
          return url.toString();
        } catch {
          return u.replace(/^http/, 'ws');
        }
      };
      const wsUrl = toWs(`${apiBase}/ws/tournaments/${tournamentId}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'tournament:update') {
            setPayload(msg.payload as TournamentPayload);
          } else if (msg.type === 'matches:update') {
            setPayload((prev) =>
              prev ? { ...prev, matches: msg.payload as Match[] } : prev
            );
          }
        } catch {}
      };
      ws.onclose = () => {
        wsRef.current = null;
      };
      return () => ws.close();
    }

    if (transport === 'sse') {
      const es = new EventSource(`${apiBase}/sse/tournaments/${tournamentId}`);
      sseRef.current = es;
      es.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'tournament:update') setPayload(msg.payload);
          if (msg.type === 'matches:update')
            setPayload((prev) =>
              prev ? { ...prev, matches: msg.payload as Match[] } : prev
            );
        } catch {}
      };
      es.onerror = () => {
        // silently let the browser retry
      };
      return () => es.close();
    }

    if (transport === 'poll') {
      let alive = true;
      const tick = async () => {
        if (!alive) return;
        const res = await fetch(`${apiBase}/tournaments/${tournamentId}`);
        if (res.ok) {
          const data = (await res.json()) as TournamentPayload;
          setPayload(data);
        }
        if (alive) setTimeout(tick, pollMs);
      };
      tick();
      return () => {
        alive = false;
      };
    }
  }, [transport, apiBase, pollMs, tournamentId]);

  return payload;
}

// --- Pan/Zoom container (touch friendly) -----------------------------------

function usePanZoom() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({ x: 0, y: 0, scale: 1 });
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.1 : 0.9;
      setState((s) => ({
        ...s,
        scale: Math.min(2.2, Math.max(0.6, s.scale * factor)),
      }));
    };

    const onPointerDown = (e: PointerEvent) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.current.size) return;
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1) {
        setState((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
      }

      if (pointers.current.size === 2) {
        const pts = Array.from(pointers.current.values());
        const dist = (
          a: { x: number; y: number },
          b: { x: number; y: number }
        ) => Math.hypot(a.x - b.x, a.y - b.y);
        const [a, b] = pts;
        const [pa, pb] = pts; // previous approximated by last set
        const prevDist = dist(pa, pb);
        const currDist = dist(a, b);
        const factor = currDist / Math.max(1, prevDist);
        setState((s) => ({
          ...s,
          scale: Math.min(2.2, Math.max(0.6, s.scale * factor)),
        }));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return { wrapperRef, state };
}

// --- UI atoms ---------------------------------------------------------------

function PlayerRow({
  player,
  highlight,
}: {
  player?: Player | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1',
        highlight && 'bg-primary/10'
      )}
    >
      <Avatar className="h-6 w-6">
        {player?.avatarUrl ? (
          <AvatarImage src={player.avatarUrl} alt={player?.name ?? 'player'} />
        ) : (
          <AvatarFallback className="text-[10px]">
            {abbr(player?.name)}
          </AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-medium truncate max-w-[140px]">
        {player?.name ?? 'TBD'}
      </span>
      {player?.seed ? (
        <Badge variant="outline" className="ml-auto text-[10px]">
          #{player.seed}
        </Badge>
      ) : null}
    </div>
  );
}

const abbr = (name?: string | null) => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0];
  const last = parts[parts.length - 1]?.[0];
  return (first ?? '').concat(last ?? '').toUpperCase();
};

function MatchCard({
  m,
  onClick,
  isAdmin,
  onReport,
  onAssignTable,
  onSwap,
  onBet,
}: {
  m: Match;
  onClick?: (m: Match) => void;
  isAdmin?: boolean;
  onReport?: (m: Match) => void;
  onAssignTable?: (m: Match) => void;
  onSwap?: (m: Match) => void;
  onBet?: (m: Match) => void;
}) {
  const live = m.status === 'live';
  const completed = m.status === 'completed';

  return (
    <Card
      className={cn(
        'w-[260px] select-none shadow-sm border-muted-foreground/10',
        live && 'ring-2 ring-green-500/60',
        completed && 'opacity-90'
      )}
    >
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span>Round {m.round}</span>
            {m.bracket !== 'rr' && (
              <Badge variant="secondary" className="text-[10px] capitalize">
                {m.bracket}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            {live ? (
              <Badge
                variant="destructive"
                className="uppercase tracking-wide text-[10px]"
              >
                Live
              </Badge>
            ) : completed ? (
              <Badge variant="outline" className="text-[10px]">
                Final
              </Badge>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Match Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onClick?.(m)}>
                  <ArrowRight className="h-4 w-4 mr-2" /> View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBet?.(m)}>
                  <LineChart className="h-4 w-4 mr-2" /> Betting markets
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onReport?.(m)}>
                      <Edit className="h-4 w-4 mr-2" /> Report score
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssignTable?.(m)}>
                      <PlayCircle className="h-4 w-4 mr-2" /> Assign table
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSwap?.(m)}>
                      <Replace className="h-4 w-4 mr-2" /> Swap players
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {m.table ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Table {m.table}
            </>
          ) : (
            <>
              <Dot className="h-4 w-4" /> {fmtTime(m.scheduledAt)}
            </>
          )}
          {m.raceTo ? (
            <span className="ml-auto">Race to {m.raceTo}</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PlayerRow
              player={m.playerA}
              highlight={m.winnerId === m.playerA?.id}
            />
            <Badge
              variant={m.winnerId === m.playerA?.id ? 'default' : 'secondary'}
              className="ml-auto"
            >
              {m.scoreA ?? '-'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <PlayerRow
              player={m.playerB}
              highlight={m.winnerId === m.playerB?.id}
            />
            <Badge
              variant={m.winnerId === m.playerB?.id ? 'default' : 'secondary'}
              className="ml-auto"
            >
              {m.scoreB ?? '-'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Admin dialogs ----------------------------------------------------------

function ReportScoreDialog({
  open,
  onOpenChange,
  match,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  match: Match | null;
  onSubmit: (scoreA: number, scoreB: number) => void;
}) {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');

  useEffect(() => {
    if (match) {
      setA(match.scoreA?.toString() ?? '0');
      setB(match.scoreB?.toString() ?? '0');
    }
  }, [match]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report score</DialogTitle>
          <DialogDescription>
            Update the final score for Round {match?.round} — Match #
            {match?.position}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <Label className="text-xs">
              {match?.playerA?.name ?? 'Player A'}
            </Label>
            <Input
              inputMode="numeric"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">
              {match?.playerB?.name ?? 'Player B'}
            </Label>
            <Input
              inputMode="numeric"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              const nA = Number.parseInt(a || '0');
              const nB = Number.parseInt(b || '0');
              onSubmit(nA, nB);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignTableDialog({
  open,
  onOpenChange,
  match,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  match: Match | null;
  onSubmit: (table: string) => void;
}) {
  const [table, setTable] = useState<string>('');
  useEffect(() => {
    if (match?.table) setTable(String(match.table));
  }, [match]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign table</DialogTitle>
          <DialogDescription>
            Set an optional table number or label.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <Label className="text-xs mb-2">Table</Label>
          <Input
            value={table}
            onChange={(e) => setTable(e.target.value)}
            placeholder="e.g. 5 or TV-Table"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSubmit(table);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Betting panel (placeholder for external integration) ------------------

function BettingHint({ onClick }: { onClick?: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={onClick}>
            <LineChart className="h-4 w-4 mr-2" /> Betting
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[220px] text-xs">
          Integrate with your licensed betting partner via redirect or SDK. Odds
          and stakes should be hosted offsite; use webhooks for settlement.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// --- Layouts ---------------------------------------------------------------

function SingleElimBracket({
  matches,
  isAdmin,
  handlers,
}: {
  matches: Match[];
  isAdmin?: boolean;
  handlers: Handlers;
}) {
  const rounds = useMemo(() => groupByRound(matches, 'winners'), [matches]);
  return (
    <div className="flex gap-6">
      {rounds.map((roundMatches, i) => (
        <div key={i} className="flex flex-col gap-4">
          {roundMatches.map((m) => (
            <MatchCard
              key={m.id}
              m={m}
              isAdmin={isAdmin}
              onClick={handlers.onMatchClick}
              onReport={() => handlers.onReport(m)}
              onAssignTable={() => handlers.onAssignTable(m)}
              onSwap={() => handlers.onSwap(m)}
              onBet={() => handlers.onBet(m)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DoubleElimBracket({
  matches,
  isAdmin,
  handlers,
}: {
  matches: Match[];
  isAdmin?: boolean;
  handlers: Handlers;
}) {
  const winners = useMemo(() => groupByRound(matches, 'winners'), [matches]);
  const losers = useMemo(() => groupByRound(matches, 'losers'), [matches]);
  const finals = useMemo(() => groupByRound(matches, 'finals'), [matches]);

  return (
    <Tabs defaultValue="winners" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="winners">Winners</TabsTrigger>
        <TabsTrigger value="losers">Losers</TabsTrigger>
        <TabsTrigger value="finals">Finals</TabsTrigger>
      </TabsList>
      <TabsContent value="winners">
        <div className="flex gap-6">
          {winners.map((roundMatches, i) => (
            <div key={i} className="flex flex-col gap-4">
              {roundMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  m={m}
                  isAdmin={isAdmin}
                  onClick={handlers.onMatchClick}
                  onReport={() => handlers.onReport(m)}
                  onAssignTable={() => handlers.onAssignTable(m)}
                  onSwap={() => handlers.onSwap(m)}
                  onBet={() => handlers.onBet(m)}
                />
              ))}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="losers">
        <div className="flex gap-6">
          {losers.map((roundMatches, i) => (
            <div key={i} className="flex flex-col gap-4">
              {roundMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  m={m}
                  isAdmin={isAdmin}
                  onClick={handlers.onMatchClick}
                  onReport={() => handlers.onReport(m)}
                  onAssignTable={() => handlers.onAssignTable(m)}
                  onSwap={() => handlers.onSwap(m)}
                  onBet={() => handlers.onBet(m)}
                />
              ))}
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="finals">
        <div className="flex gap-6">
          {finals.map((roundMatches, i) => (
            <div key={i} className="flex flex-col gap-4">
              {roundMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  m={m}
                  isAdmin={isAdmin}
                  onClick={handlers.onMatchClick}
                  onReport={() => handlers.onReport(m)}
                  onAssignTable={() => handlers.onAssignTable(m)}
                  onSwap={() => handlers.onSwap(m)}
                  onBet={() => handlers.onBet(m)}
                />
              ))}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function RoundRobinView({
  matches,
  isAdmin,
  handlers,
}: {
  matches: Match[];
  isAdmin?: boolean;
  handlers: Handlers;
}) {
  // derive standings (wins, frames diff) from completed matches in RR lane
  const rrMatches = useMemo(
    () => matches.filter((m) => m.bracket === 'rr'),
    [matches]
  );
  const players = useMemo(() => {
    const set = new Map<string, Player>();
    rrMatches.forEach((m) => {
      if (m.playerA) set.set(m.playerA.id, m.playerA);
      if (m.playerB) set.set(m.playerB.id, m.playerB);
    });
    return Array.from(set.values());
  }, [rrMatches]);

  const table = useMemo(() => {
    const stats = new Map<
      string,
      { p: Player; w: number; l: number; frames: number }
    >();
    players.forEach((p) => stats.set(p.id, { p, w: 0, l: 0, frames: 0 }));
    rrMatches.forEach((m) => {
      if (m.status !== 'completed' || !m.playerA || !m.playerB) return;
      const a = stats.get(m.playerA.id)!;
      const b = stats.get(m.playerB.id)!;
      const sA = m.scoreA ?? 0;
      const sB = m.scoreB ?? 0;
      if (sA > sB) {
        a.w += 1;
        b.l += 1;
      } else if (sB > sA) {
        b.w += 1;
        a.l += 1;
      }
      a.frames += sA - sB;
      b.frames += sB - sA;
    });
    return Array.from(stats.values()).sort(
      (x, y) =>
        y.w - x.w ||
        y.frames - x.frames ||
        (y.p.rating ?? 0) - (x.p.rating ?? 0)
    );
  }, [players, rrMatches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Matches <Users2 className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rrMatches.map((m) => (
              <MatchCard
                key={m.id}
                m={m}
                isAdmin={isAdmin}
                onClick={handlers.onMatchClick}
                onReport={() => handlers.onReport(m)}
                onAssignTable={() => handlers.onAssignTable(m)}
                onSwap={() => handlers.onSwap(m)}
                onBet={() => handlers.onBet(m)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Standings <Trophy className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {table.map(({ p, w, l, frames }, idx) => (
              <div key={p.id} className="flex items-center gap-3">
                <Badge
                  variant={idx === 0 ? 'default' : 'secondary'}
                  className="w-6 justify-center"
                >
                  {idx + 1}
                </Badge>
                <Avatar className="h-7 w-7">
                  {p.avatarUrl ? (
                    <AvatarImage src={p.avatarUrl} alt={p.name} />
                  ) : (
                    <AvatarFallback>{abbr(p.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">
                    {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    W {w} · L {l} · Frames {frames}
                  </span>
                </div>
                {idx === 0 && <Crown className="h-4 w-4 ml-auto" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Handlers façade -------------------------------------------------------

type Handlers = {
  onMatchClick: (m: Match) => void;
  onReport: (m: Match) => void;
  onAssignTable: (m: Match) => void;
  onSwap: (m: Match) => void;
  onBet: (m: Match) => void;
};

// --- Main component ---------------------------------------------------------

export default function TournamentBracket(props: TournamentBracketProps) {
  const {
    tournamentId,
    tournament: tProp,
    matches: mProp,
    apiBase = '/api',
    transport = 'ws',
    pollMs = 5000,
    isAdmin = false,
    className,
    onMatchClick,
    onReportScore,
    onAssignTable,
    onSwapPlayers,
    onCreateNextRounds,
    onOpenBetting,
  } = props;

  const initial = useMemo<TournamentPayload | null>(() => {
    if (tProp && mProp) return { tournament: tProp, matches: mProp };
    return null;
  }, [tProp, mProp]);

  const payload = useLiveTournament({
    tournamentId,
    apiBase,
    transport,
    pollMs,
    initial,
  });

  const t = payload?.tournament ?? tProp;
  const matches = payload?.matches ?? mProp ?? [];

  const { wrapperRef, state } = usePanZoom();

  const [reportOpen, setReportOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  const handlers: Handlers = {
    onMatchClick: (m) => onMatchClick?.(m),
    onReport: (m) => {
      setActiveMatch(m);
      setReportOpen(true);
    },
    onAssignTable: (m) => {
      setActiveMatch(m);
      setAssignOpen(true);
    },
    onSwap: (m) => onSwapPlayers?.(m.id),
    onBet: (m) => onOpenBetting?.(m),
  };

  if (!t) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Dot className="h-5 w-5" /> Loading tournament…
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5" />
          <h2 className="text-xl font-semibold tracking-tight">{t.name}</h2>
          <Badge variant="secondary" className="capitalize">
            {t.format.replace('_', ' ')}
          </Badge>
          {t.status === 'live' && (
            <Badge className="bg-green-600 hover:bg-green-600">Live</Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <BettingHint
            onClick={() => onOpenBetting?.(activeMatch ?? matches[0])}
          />
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Admin <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCreateNextRounds?.(t.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Advance rounds
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Separator />

      {/* Canvas */}
      <Card>
        <CardContent className="p-0">
          <div
            ref={wrapperRef}
            className="relative h-[70vh] touch-pan-x touch-pan-y overflow-hidden"
          >
            <ScrollArea className="absolute inset-0">
              <div
                className="min-w-[900px] p-6"
                style={{
                  transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
                  transformOrigin: '0 0',
                  transition: 'transform 80ms linear',
                }}
              >
                {t.format === 'single' && (
                  <SingleElimBracket
                    matches={matches}
                    isAdmin={isAdmin}
                    handlers={handlers}
                  />
                )}
                {t.format === 'double' && (
                  <DoubleElimBracket
                    matches={matches}
                    isAdmin={isAdmin}
                    handlers={handlers}
                  />
                )}
                {t.format === 'round_robin' && (
                  <RoundRobinView
                    matches={matches}
                    isAdmin={isAdmin}
                    handlers={handlers}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Admin Dialogs */}
      <ReportScoreDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        match={activeMatch}
        onSubmit={async (a, b) => {
          if (!activeMatch) return;
          if (props.onReportScore)
            await props.onReportScore(activeMatch.id, a, b);
          else {
            // default API call
            await fetch(`${apiBase}/matches/${activeMatch.id}/report`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scoreA: a, scoreB: b }),
            });
          }
        }}
      />

      <AssignTableDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        match={activeMatch}
        onSubmit={async (table) => {
          if (!activeMatch) return;
          if (props.onAssignTable)
            await props.onAssignTable(activeMatch.id, table);
          else {
            await fetch(`${apiBase}/matches/${activeMatch.id}/assign-table`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ table }),
            });
          }
        }}
      />
    </div>
  );
}

// --- Example helper: server fetch (optional) -------------------------------
// You may remove these if using your own data layer.
export async function fetchTournamentPayload(
  apiBase: string,
  id: string
): Promise<TournamentPayload> {
  const res = await fetch(`${apiBase}/tournaments/${id}`);
  if (!res.ok) throw new Error('Failed to fetch tournament');
  return (await res.json()) as TournamentPayload;
}

// --- Example: usage in a Next.js route/page -------------------------------
//
// import TournamentBracket from "@/components/tournament/TournamentBracket";
// export default function Page({ params }: { params: { id: string } }) {
//   return (
//     <div className="container py-6">
//       <TournamentBracket tournamentId={params.id} apiBase="/api" transport="ws" isAdmin={false} />
//     </div>
//   );
// }
