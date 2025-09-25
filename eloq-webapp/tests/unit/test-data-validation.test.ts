// Unit tests for data validation
// This file contains tests for validating player, match, tournament, and user data

import { describe, it, expect } from '@jest/globals';
import { validatePlayer, validateMatch, validateTournament, validateUser } from '../../src/models/player';
import { Player } from '../../src/models/player';
import { Match } from '../../src/models/match';
import { Tournament } from '../../src/models/tournament';
import { User } from '../../src/models/user';

describe('Data Validation', () => {
  describe('validatePlayer', () => {
    it('should validate a valid player', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should reject player without ID', () => {
      const player: any = {
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Player ID is required');
    });
    
    it('should reject player without name', () => {
      const player: any = {
        id: 'player-1',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Player name is required');
    });
    
    it('should reject player with negative rating', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: -100,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Rating must be a positive number');
    });
    
    it('should reject player with invalid ranking', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 150,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Ranking must be between 1 and 100');
    });
    
    it('should reject player with negative wins', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: -5,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Wins must be non-negative');
    });
    
    it('should reject player with negative losses', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: -3,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Losses must be non-negative');
    });
    
    it('should reject player with invalid win rate', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 150,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: 15,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Win rate must be between 0 and 100');
    });
    
    it('should reject player with negative matches played', () => {
      const player: Player = {
        id: 'player-1',
        name: 'John Doe',
        rating: 1500,
        ranking: 1,
        wins: 10,
        losses: 5,
        winRate: 67,
        avatarUrl: 'https://example.com/avatar.jpg',
        joinDate: new Date('2023-01-01'),
        lastPlayed: new Date('2023-06-01'),
        country: 'USA',
        breaks: 3,
        highestBreak: 147,
        description: 'Professional player',
        matchesPlayed: -5,
        provisional: false
      };
      
      const errors = validatePlayer(player);
      
      expect(errors).toContain('Matches played must be non-negative');
    });
  });
  
  describe('validateMatch', () => {
    it('should validate a valid match', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should reject match without ID', () => {
      const match: any = {
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Match ID is required');
    });
    
    it('should reject match without playerI', () => {
      const match: any = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Player I is required');
    });
    
    it('should reject match without playerJ', () => {
      const match: any = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Player J is required');
    });
    
    it('should reject match with same playerI and playerJ', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-1',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Player I and Player J must be different players');
    });
    
    it('should reject match without date', () => {
      const match: any = {
        id: 'match-1',
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Match date is required');
    });
    
    it('should reject match with invalid event tier', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'invalid' as any,
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Event tier must be one of: local, regional, national, major');
    });
    
    it('should reject match with invalid format', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'invalid' as any,
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Format must be one of: alternate, winner');
    });
    
    it('should reject match with negative race to', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: -5,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Race to must be a positive integer');
    });
    
    it('should reject match with negative racksI', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: -2,
        racksJ: 7,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Racks won by player I must be non-negative');
    });
    
    it('should reject match with negative racksJ', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: -3,
        ballsI: 81,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Racks won by player J must be non-negative');
    });
    
    it('should reject match with negative ballsI', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: -10,
        ballsJ: 63,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Balls pocketed by player I must be non-negative');
    });
    
    it('should reject match with negative ballsJ', () => {
      const match: Match = {
        id: 'match-1',
        date: new Date('2023-06-01'),
        eventId: 'tournament-1',
        eventTier: 'regional',
        format: 'alternate',
        discipline: '9-ball',
        ballsPerRack: 9,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 9,
        racksJ: 7,
        ballsI: 81,
        ballsJ: -5,
        fieldAvg: 1500
      };
      
      const errors = validateMatch(match);
      
      expect(errors).toContain('Balls pocketed by player J must be non-negative');
    });
  });
  
  describe('validateTournament', () => {
    it('should validate a valid tournament', () => {
      const tournament: Tournament = {
        id: 'tournament-1',
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should reject tournament without ID', () => {
      const tournament: any = {
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Tournament ID is required');
    });
    
    it('should reject tournament without name', () => {
      const tournament: any = {
        id: 'tournament-1',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Tournament name is required');
    });
    
    it('should reject tournament without date', () => {
      const tournament: any = {
        id: 'tournament-1',
        name: 'Regional Championship',
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Tournament date is required');
    });
    
    it('should reject tournament with invalid tier', () => {
      const tournament: Tournament = {
        id: 'tournament-1',
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'invalid' as any,
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Tier must be one of: local, regional, national, major');
    });
    
    it('should reject tournament with invalid status', () => {
      const tournament: Tournament = {
        id: 'tournament-1',
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'invalid' as any,
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Status must be one of: upcoming, ongoing, completed');
    });
    
    it('should reject tournament with negative prize pool', () => {
      const tournament: Tournament = {
        id: 'tournament-1',
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: -5000,
        tier: 'regional',
        fieldAvgRating: 1600,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Prize pool must be non-negative');
    });
    
    it('should reject tournament with negative field average rating', () => {
      const tournament: Tournament = {
        id: 'tournament-1',
        name: 'Regional Championship',
        date: new Date('2023-07-15'),
        location: 'New York',
        prizePool: 25000,
        tier: 'regional',
        fieldAvgRating: -200,
        participants: ['player-1', 'player-2', 'player-3'],
        results: [
          { playerId: 'player-1', position: 1, prize: 10000 },
          { playerId: 'player-2', position: 2, prize: 5000 }
        ],
        status: 'upcoming',
        description: 'Regional championship tournament'
      };
      
      const errors = validateTournament(tournament);
      
      expect(errors).toContain('Field average rating must be non-negative');
    });
  });
  
  describe('validateUser', () => {
    it('should validate a valid user', () => {
      const user: User = {
        id: 'user-1',
        username: 'john_doe',
        email: 'john@example.com',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toHaveLength(0);
    });
    
    it('should reject user without ID', () => {
      const user: any = {
        username: 'john_doe',
        email: 'john@example.com',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toContain('User ID is required');
    });
    
    it('should reject user without username', () => {
      const user: any = {
        id: 'user-1',
        email: 'john@example.com',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toContain('Username is required');
    });
    
    it('should reject user without email', () => {
      const user: any = {
        id: 'user-1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toContain('Email is required');
    });
    
    it('should reject user with invalid email', () => {
      const user: User = {
        id: 'user-1',
        username: 'john_doe',
        email: 'invalid-email',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toContain('Email must be a valid email address');
    });
    
    it('should reject user without display name', () => {
      const user: any = {
        id: 'user-1',
        username: 'john_doe',
        email: 'john@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        favoritePlayers: ['player-1', 'player-2'],
        recentlyViewed: [
          {
            entityType: 'player',
            entityId: 'player-1',
            timestamp: new Date('2023-06-01')
          }
        ],
        preferences: {
          theme: 'dark',
          notifications: true
        },
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date('2023-06-01')
      };
      
      const errors = validateUser(user);
      
      expect(errors).toContain('Display name is required');
    });
  });
});