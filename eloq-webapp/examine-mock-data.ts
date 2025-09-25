// Test script to examine mock data

import { initializeMockData, getPlayers } from './src/services/mock-data-service';

// Initialize mock data
initializeMockData();

// Get players
const players = getPlayers();

console.log('Number of players:', players.length);

// Check the first few players
for (let i = 0; i < Math.min(5, players.length); i++) {
  const player = players[i];
  console.log(`\nPlayer ${i + 1}:`);
  console.log('  ID:', player.id);
  console.log('  Name:', player.name);
  console.log('  Name length:', player.name.length);
  console.log('  Rating:', player.rating);
  console.log('  Ranking:', player.ranking);
  console.log('  Wins:', player.wins);
  console.log('  Losses:', player.losses);
  console.log('  Win Rate:', player.winRate);
  console.log('  Avatar URL:', player.avatarUrl);
  console.log('  Avatar URL length:', (player.avatarUrl || '').length);
  console.log('  Join Date:', player.joinDate);
  console.log('  Last Played:', player.lastPlayed);
  console.log('  Country:', player.country);
  console.log('  Country length:', (player.country || '').length);
  console.log('  Breaks:', player.breaks);
  console.log('  Highest Break:', player.highestBreak);
  console.log('  Description:', player.description);
  console.log('  Description length:', (player.description || '').length);
  console.log('  Matches Played:', player.matchesPlayed);
  console.log('  Provisional:', player.provisional);
}