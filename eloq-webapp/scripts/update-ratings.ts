#!/usr/bin/env tsx

// Script to run the complete rating update workflow
// This script orchestrates the entire process of updating player ratings:
// 1. Runs the Python rating calculation script
// 2. Generates the final ratings CSV
// 3. Imports the ratings into the database

import { updatePlayerRatings } from '../src/lib/rating-coordinator';
import generateFinalRatings from './generate-final-ratings';
import * as path from 'path';

async function main() {
  try {
    console.log('Starting rating update process...');
    
    // Define paths
    const matchesFile = path.join(__dirname, '..', 'data', 'matches.csv');
    const seedsFile = path.join(__dirname, '..', 'data', 'seeds.csv'); // Optional
    
    // Check if matches file exists
    const fs = (await import('fs')).default;
    if (!fs.existsSync(matchesFile)) {
      console.error(`Matches file not found: ${matchesFile}`);
      console.error('Please create a matches.csv file in the data directory with match data');
      process.exit(1);
    }
    
    // Run the rating update process
    console.log('Running Python rating calculation...');
    const result = await updatePlayerRatings(matchesFile, seedsFile);
    
    if (result.success) {
      console.log('Rating update process completed successfully!');
      console.log(result.message);
    } else {
      console.error('Rating update process failed:');
      console.error(result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running rating update process:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export default main;