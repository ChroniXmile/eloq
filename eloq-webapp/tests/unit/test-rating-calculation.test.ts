// Unit tests for rating calculation logic
// This file contains tests for the Elo-like rating calculation logic

import { describe, it, expect } from '@jest/globals';
import { calculateExpectedScore, calculateRaceScaling, calculateMarginDampening, determineKFactor, calculateFieldStrengthMultiplier, calculateRatingChange } from '../../src/services/player-service';
import { Match } from '../../src/models/match';
import { Player } from '../../src/models/player';

describe('Rating Calculation Logic', () => {
  describe('calculateExpectedScore', () => {
    it('should calculate expected score correctly for alternate format', () => {
      const ratingDifference = 100; // Player I is 100 points stronger
      const format: 'alternate' | 'winner' = 'alternate';
      
      const expectedScore = calculateExpectedScore(ratingDifference, format);
      
      // With no format offset, expected score should be ~0.64
      expect(expectedScore).toBeCloseTo(0.64, 2);
    });
    
    it('should calculate expected score correctly for winner format', () => {
      const ratingDifference = 100; // Player I is 100 points stronger
      const format: 'alternate' | 'winner' = 'winner';
      
      const expectedScore = calculateExpectedScore(ratingDifference, format);
      
      // With +15 format offset, expected score should be ~0.68
      expect(expectedScore).toBeCloseTo(0.68, 2);
    });
    
    it('should return 0.5 when rating difference is 0', () => {
      const ratingDifference = 0;
      const format: 'alternate' | 'winner' = 'alternate';
      
      const expectedScore = calculateExpectedScore(ratingDifference, format);
      
      expect(expectedScore).toBeCloseTo(0.5, 2);
    });
  });
  
  describe('calculateRaceScaling', () => {
    it('should calculate race scaling correctly', () => {
      const totalRacks = 18; // 2 * T0 where T0 = 9
      
      const raceScaling = calculateRaceScaling(totalRacks);
      
      // Should be sqrt(18/9) = sqrt(2) ≈ 1.41
      expect(raceScaling).toBeCloseTo(Math.sqrt(2), 2);
    });
    
    it('should return 1 when total racks equals T0', () => {
      const totalRacks = 9; // T0 = 9
      
      const raceScaling = calculateRaceScaling(totalRacks);
      
      expect(raceScaling).toBeCloseTo(1, 2);
    });
  });
  
  describe('calculateMarginDampening', () => {
    it('should calculate margin dampening correctly', () => {
      const rackDifference = 5;
      const ratingDifference = 200;
      
      const marginDampening = calculateMarginDampening(rackDifference, ratingDifference);
      
      // Should be log(1 + 5) / (1 + 10^(200/400)) = log(6) / (1 + 10^0.5)
      const expected = Math.log(1 + 5) / (1 + Math.pow(10, 0.5));
      expect(marginDampening).toBeCloseTo(expected, 2);
    });
    
    it('should return 0 when rack difference is 0', () => {
      const rackDifference = 0;
      const ratingDifference = 100;
      
      const marginDampening = calculateMarginDampening(rackDifference, ratingDifference);
      
      expect(marginDampening).toBeCloseTo(0, 2);
    });
  });
  
  describe('determineKFactor', () => {
    it('should return provisional K factor for players with < 30 matches', () => {
      const player = {
        matchesPlayed: 25,
        rating: 1500
      } as Player;
      
      const kFactor = determineKFactor(player);
      
      expect(kFactor).toBe(40); // K_PROV
    });
    
    it('should return established K factor for players with >= 30 matches and rating < 2400', () => {
      const player = {
        matchesPlayed: 35,
        rating: 2000
      } as Player;
      
      const kFactor = determineKFactor(player);
      
      expect(kFactor).toBe(20); // K_EST
    });
    
    it('should return elite K factor for players with rating >= 2400', () => {
      const player = {
        matchesPlayed: 50,
        rating: 2500
      } as Player;
      
      const kFactor = determineKFactor(player);
      
      expect(kFactor).toBe(10); // K_ELITE
    });
  });
  
  describe('calculateFieldStrengthMultiplier', () => {
    it('should return 1.0 when field average is undefined', () => {
      const multiplier = calculateFieldStrengthMultiplier(undefined);
      
      expect(multiplier).toBe(1.0);
    });
    
    it('should calculate field strength multiplier correctly', () => {
      const fieldAvg = 1700; // 200 points above baseline of 1500
      
      const multiplier = calculateFieldStrengthMultiplier(fieldAvg);
      
      // Should be 1 + 0.5 * (1700 - 1500) / 400 = 1 + 0.5 * 0.5 = 1.25
      expect(multiplier).toBeCloseTo(1.25, 2);
    });
    
    it('should clamp field strength multiplier between 0.9 and 1.3', () => {
      // Very low field average
      const lowMultiplier = calculateFieldStrengthMultiplier(500); // Much below 1500
      expect(lowMultiplier).toBeCloseTo(0.9, 2);
      
      // Very high field average
      const highMultiplier = calculateFieldStrengthMultiplier(3000); // Much above 1500
      expect(highMultiplier).toBeCloseTo(1.3, 2);
    });
  });
  
  describe('calculateRatingChange', () => {
    it('should calculate rating change correctly for a win', () => {
      const player = {
        id: 'player-1',
        name: 'Player 1',
        rating: 1600,
        matchesPlayed: 40,
        wins: 25,
        losses: 15
      } as Player;
      
      const opponentRating = 1500;
      
      const match: Match = {
        id: 'match-1',
        date: new Date(),
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
        fieldAvg: 1550
      };
      
      const won = true;
      
      const ratingChange = calculateRatingChange(player, opponentRating, match, won);
      
      // We expect a positive rating change since the player won
      expect(ratingChange).toBeGreaterThan(0);
    });
    
    it('should calculate rating change correctly for a loss', () => {
      const player = {
        id: 'player-1',
        name: 'Player 1',
        rating: 1400,
        matchesPlayed: 40,
        wins: 15,
        losses: 25
      } as Player;
      
      const opponentRating = 1500;
      
      const match: Match = {
        id: 'match-1',
        date: new Date(),
        eventId: 'tournament-1',
        eventTier: 'local',
        format: 'winner',
        discipline: '10-ball',
        ballsPerRack: 10,
        raceTo: 9,
        playerI: 'player-1',
        playerJ: 'player-2',
        racksI: 7,
        racksJ: 9,
        ballsI: 70,
        ballsJ: 90,
        fieldAvg: 1450
      };
      
      const won = false;
      
      const ratingChange = calculateRatingChange(player, opponentRating, match, won);
      
      // We expect a negative rating change since the player lost
      expect(ratingChange).toBeLessThan(0);
    });
  });
});