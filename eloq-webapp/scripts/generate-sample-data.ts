// Script to generate sample match data for the pool rating system
// This script creates a sample matches.csv file with realistic pool match data

import * as fs from 'fs';
import * as path from 'path';

interface Match {
  date: string;
  event_tier: string;
  format: string;
  discipline: string;
  balls_per_rack: number;
  race_to: number;
  player_i: string;
  player_j: string;
  racks_i: number;
  racks_j: number;
  balls_i: number;
  balls_j: number;
  field_avg?: number;
}

// Sample player names
const playerNames = [
  'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
  'Jennifer Lee', 'James Miller', 'Lisa Taylor', 'Robert Anderson', 'Mary Thomas',
  'William Jackson', 'Patricia White', 'Thomas Harris', 'Linda Martin', 'Christopher Thompson',
  'Barbara Garcia', 'Daniel Martinez', 'Elizabeth Robinson', 'Matthew Clark', 'Susan Rodriguez',
  'Anthony Lewis', 'Jessica Lee', 'Kevin Walker', 'Sarah Hall', 'Brian Allen',
  'Ashley Young', 'Jason Hernandez', 'Brittany King', 'Eric Wright', 'Michelle Lopez',
  'Adam Hill', 'Stephanie Scott', 'Ryan Green', 'Rebecca Adams', 'Jonathan Baker',
  'Nicole Gonzalez', 'Jeffrey Nelson', 'Katherine Carter', 'Gary Mitchell', 'Samantha Perez'
];

// Event tiers
const eventTiers = ['local', 'regional', 'national', 'major'];

// Formats
const formats = ['alternate', 'winner'];

// Disciplines
const disciplines = ['9-ball', '10-ball', '8-ball'];

// Generate sample matches
function generateSampleMatches(count: number): Match[] {
  const matches: Match[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random date within the last year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    // Random event tier
    const eventTier = eventTiers[Math.floor(Math.random() * eventTiers.length)];
    
    // Random format
    const format = formats[Math.floor(Math.random() * formats.length)];
    
    // Random discipline
    const discipline = disciplines[Math.floor(Math.random() * disciplines.length)];
    
    // Random balls per rack (typically 9 or 10 for 9-ball, 10 for 10-ball, 8 for 8-ball)
    const ballsPerRack = discipline === '9-ball' ? 9 : 
                         discipline === '10-ball' ? 10 : 8;
    
    // Random race to (typically 7-11 for most events)
    const raceTo = 7 + Math.floor(Math.random() * 5);
    
    // Random players
    const playerIIndex = Math.floor(Math.random() * playerNames.length);
    let playerJIndex = Math.floor(Math.random() * playerNames.length);
    // Ensure players are different
    while (playerJIndex === playerIIndex) {
      playerJIndex = Math.floor(Math.random() * playerNames.length);
    }
    
    const playerI = playerNames[playerIIndex];
    const playerJ = playerNames[playerJIndex];
    
    // Generate random rack scores (ensure one player wins)
    const racksI = Math.floor(Math.random() * (raceTo + 1));
    const racksJ = racksI === raceTo ? 
                   Math.max(0, raceTo - Math.floor(Math.random() * 3) - 1) : 
                   raceTo;
    
    // Generate ball counts based on racks won and balls per rack
    const ballsI = racksI * ballsPerRack + Math.floor(Math.random() * ballsPerRack);
    const ballsJ = racksJ * ballsPerRack + Math.floor(Math.random() * ballsPerRack);
    
    // Random field average rating (1500-2200)
    const fieldAvg = 1500 + Math.floor(Math.random() * 700);
    
    matches.push({
      date: date.toISOString().split('T')[0],
      event_tier: eventTier,
      format,
      discipline,
      balls_per_rack: ballsPerRack,
      race_to,
      player_i: playerI,
      player_j: playerJ,
      racks_i,
      racks_j,
      balls_i: ballsI,
      balls_j: ballsJ,
      field_avg: fieldAvg
    });
  }
  
  // Sort matches by date
  matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return matches;
}

// Generate CSV content from matches
function generateCSV(matches: Match[]): string {
  // CSV header
  let csv = 'date,event_tier,format,discipline,balls_per_rack,race_to,player_i,player_j,racks_i,racks_j,balls_i,balls_j,field_avg\n';
  
  // Add each match as a row
  matches.forEach(match => {
    csv += `${match.date},${match.event_tier},${match.format},${match.discipline},${match.balls_per_rack},${match.race_to},"${match.player_i}","${match.player_j}",${match.racks_i},${match.racks_j},${match.balls_i},${match.balls_j},${match.field_avg || ''}\n`;
  });
  
  return csv;
}

// Main function
async function main() {
  try {
    // Generate 200 sample matches
    const matches = generateSampleMatches(200);
    
    // Generate CSV content
    const csvContent = generateCSV(matches);
    
    // Write to data directory
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, 'matches.csv');
    fs.writeFileSync(filePath, csvContent);
    
    console.log(`Generated ${matches.length} sample matches and saved to ${filePath}`);
  } catch (error) {
    console.error('Error generating sample data:', error);
    process.exit(1);
  }
}

// Run the script
main();