// Script to generate sample seeds data for the pool rating system
// This script creates a sample seeds.csv file with initial player ratings

import * as fs from 'fs';
import * as path from 'path';

interface SeedPlayer {
  player: string;
  rating: number;
  matches: number;
}

// Sample seeded players with initial ratings
const seededPlayers: SeedPlayer[] = [
  { player: 'John Smith', rating: 1850, matches: 50 },
  { player: 'Emma Johnson', rating: 1820, matches: 45 },
  { player: 'Michael Brown', rating: 1790, matches: 40 },
  { player: 'Sarah Davis', rating: 1760, matches: 35 },
  { player: 'David Wilson', rating: 1730, matches: 30 },
  { player: 'Jennifer Lee', rating: 1700, matches: 25 },
  { player: 'James Miller', rating: 1670, matches: 20 },
  { player: 'Lisa Taylor', rating: 1640, matches: 15 },
  { player: 'Robert Anderson', rating: 1610, matches: 10 },
  { player: 'Mary Thomas', rating: 1580, matches: 8 },
  { player: 'William Jackson', rating: 1550, matches: 6 },
  { player: 'Patricia White', rating: 1520, matches: 4 },
  { player: 'Thomas Harris', rating: 1490, matches: 2 },
  { player: 'Linda Martin', rating: 1460, matches: 1 },
  { player: 'Christopher Thompson', rating: 1430, matches: 0 }
];

// Generate CSV content from seed players
function generateSeedsCSV(players: SeedPlayer[]): string {
  // CSV header
  let csv = 'player,rating,matches\n';
  
  // Add each player as a row
  players.forEach(player => {
    csv += `"${player.player}",${player.rating},${player.matches}\n`;
  });
  
  return csv;
}

// Main function
async function main() {
  try {
    // Generate CSV content
    const csvContent = generateSeedsCSV(seededPlayers);
    
    // Write to data directory
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, 'seeds.csv');
    fs.writeFileSync(filePath, csvContent);
    
    console.log(`Generated seeds data for ${seededPlayers.length} players and saved to ${filePath}`);
  } catch (error) {
    console.error('Error generating seeds data:', error);
    process.exit(1);
  }
}

// Run the script
main();