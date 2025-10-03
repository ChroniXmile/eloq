// Real-time tournament updates hook using WebSocket/Server-Sent Events
// Provides live updates for tournament brackets and match results

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TournamentBracket,
  BracketMatch,
  BracketPlayer,
} from '@/models/tournament-board';

export interface TournamentUpdate {
  type:
    | 'match_update'
    | 'bracket_update'
    | 'player_update'
    | 'tournament_status';
  matchId?: string;
  bracketId?: string;
  playerId?: string;
  data: any;
  timestamp: Date;
}

export interface UseTournamentUpdatesOptions {
  tournamentId: string;
  enabled?: boolean;
  onUpdate?: (update: TournamentUpdate) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseTournamentUpdatesReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
  sendUpdate: (matchId: string, updateData: Partial<BracketMatch>) => void;
  subscribeToMatch: (matchId: string) => void;
  unsubscribeFromMatch: (matchId: string) => void;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
}

class TournamentWebSocketManager {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private subscribers = new Map<
    string,
    Set<(update: TournamentUpdate) => void>
  >();
  private isConnecting = false;

  constructor(
    private tournamentId: string,
    private options: {
      onUpdate?: (update: TournamentUpdate) => void;
      maxReconnectAttempts?: number;
      reconnectInterval?: number;
    } = {}
  ) {
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectInterval = options.reconnectInterval || 3000;
  }

  connect(): Promise<void> {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        // Try WebSocket first (for real-time bidirectional communication)
        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/tournaments/${this.tournamentId}`;

        console.log('Connecting to tournament WebSocket:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('Tournament WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const update: TournamentUpdate = JSON.parse(event.data);
            this.handleUpdate(update);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('Tournament WebSocket disconnected');
          this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Tournament WebSocket error:', error);
          this.isConnecting = false;
          this.scheduleReconnect();
          reject(error);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleUpdate(update: TournamentUpdate) {
    // Notify all subscribers
    this.subscribers.forEach((callbacks, matchId) => {
      // Notify match-specific subscribers
      if (update.matchId && (matchId === update.matchId || matchId === 'all')) {
        callbacks.forEach((callback) => callback(update));
      }
    });

    // Notify general subscribers
    const generalSubscribers = this.subscribers.get('general');
    generalSubscribers?.forEach((callback) => callback(update));

    // Call global update handler
    this.options.onUpdate?.(update);
  }

  subscribe(
    matchId: string,
    callback: (update: TournamentUpdate) => void
  ): () => void {
    if (!this.subscribers.has(matchId)) {
      this.subscribers.set(matchId, new Set());
    }

    this.subscribers.get(matchId)!.add(callback);

    // Send subscription message to server
    this.send({
      type: 'subscribe',
      matchId,
      tournamentId: this.tournamentId,
    });

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(matchId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(matchId);
        }
      }

      // Send unsubscription message to server
      this.send({
        type: 'unsubscribe',
        matchId,
        tournamentId: this.tournamentId,
      });
    };
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.isConnecting = false;

    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.reconnectInterval}ms`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectInterval);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.subscribers.clear();
    this.isConnecting = false;
  }

  getConnectionState(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    if (this.isConnecting) return 'connecting';

    if (this.ws) {
      switch (this.ws.readyState) {
        case WebSocket.CONNECTING:
          return 'connecting';
        case WebSocket.OPEN:
          return 'connected';
        case WebSocket.CLOSED:
          return 'disconnected';
        case WebSocket.CLOSING:
          return 'disconnected';
      }
    }

    return 'disconnected';
  }

  sendMatchUpdate(matchId: string, updateData: Partial<BracketMatch>) {
    this.send({
      type: 'match_update',
      matchId,
      tournamentId: this.tournamentId,
      data: updateData,
      timestamp: new Date(),
    });
  }
}

// React hook for tournament updates
export function useTournamentUpdates(
  options: UseTournamentUpdatesOptions
): UseTournamentUpdatesReturn {
  const { tournamentId, enabled = true, onUpdate } = options;
  const managerRef = useRef<TournamentWebSocketManager | null>(null);
  const [connectionState, setConnectionState] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Initialize WebSocket manager
  useEffect(() => {
    if (!enabled || !tournamentId) return;

    managerRef.current = new TournamentWebSocketManager(tournamentId, {
      onUpdate: (update) => {
        onUpdate?.(update);
        setError(null);
      },
      maxReconnectAttempts: options.maxReconnectAttempts,
      reconnectInterval: options.reconnectInterval,
    });

    // Update connection state
    const updateConnectionState = () => {
      const state = managerRef.current?.getConnectionState();
      setConnectionState(state || 'disconnected');

      if (state === 'error') {
        setError('Connection error occurred');
      }
    };

    const interval = setInterval(updateConnectionState, 1000);

    // Initial connection
    managerRef.current
      .connect()
      .then(updateConnectionState)
      .catch((err) => {
        console.error('Failed to connect to tournament updates:', err);
        setError('Failed to connect to live updates');
        setConnectionState('error');
      });

    return () => {
      clearInterval(interval);
      managerRef.current?.disconnect();
    };
  }, [
    tournamentId,
    enabled,
    onUpdate,
    options.maxReconnectAttempts,
    options.reconnectInterval,
  ]);

  const sendUpdate = useCallback(
    (matchId: string, updateData: Partial<BracketMatch>) => {
      managerRef.current?.sendMatchUpdate(matchId, updateData);
    },
    []
  );

  const subscribeToMatch = useCallback((matchId: string) => {
    return managerRef.current?.subscribe(matchId, () => {}) || (() => {});
  }, []);

  const unsubscribeFromMatch = useCallback((matchId: string) => {
    return managerRef.current?.subscribe(matchId, () => {}) || (() => {});
  }, []);

  return {
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    error,
    reconnectAttempts: managerRef.current?.['reconnectAttempts'] || 0,
    sendUpdate,
    subscribeToMatch,
    unsubscribeFromMatch,
    connectionState,
  };
}

// Hook for subscribing to specific match updates
export function useMatchUpdates(
  matchId: string,
  onUpdate?: (update: TournamentUpdate) => void
) {
  const [updates, setUpdates] = useState<TournamentUpdate[]>([]);
  const managerRef = useRef<TournamentWebSocketManager | null>(null);

  useEffect(() => {
    if (!matchId) return;

    // This would need to be connected to the global tournament updates context
    // For now, this is a placeholder for match-specific updates
    const handleUpdate = (update: TournamentUpdate) => {
      if (update.matchId === matchId) {
        setUpdates((prev) => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
        onUpdate?.(update);
      }
    };

    // Subscribe to global tournament updates (would need to be implemented)
    // subscribeToMatchUpdates(matchId, handleUpdate);

    return () => {
      // unsubscribeFromMatchUpdates(matchId);
    };
  }, [matchId, onUpdate]);

  return updates;
}
