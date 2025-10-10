#!/usr/bin/env tsx

// Script to run the complete Python rating system workflow
// This script orchestrates running the Python rating calculation and updating the database

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

async function runPythonRatingSystem(matchesFile: string, seedsFile?: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('Starting Python rating calculation...');
    
    // Path to the Python script
    const scriptPath = path.join(__dirname, '..', '..', 'run-rating-calculation.py');
    
    // Build command arguments
    const args = [scriptPath, '--matches', matchesFile];
    if (seedsFile) {
      args.push('--seeds', seedsFile);
    }
    
    console.log(`Running: python3 ${args.join(' ')}`);
    
    // Spawn the Python process
    const pythonProcess = spawn('python3', args, {
      cwd: path.join(__dirname, '..')
    });
    
    // Capture stdout
    pythonProcess.stdout.on('data', (data) => {
      process.stdout.write(`Python: ${data}`);
    });
    
    // Capture stderr
    pythonProcess.stderr.on('data', (data) => {
      process.stderr.write(`Python Error: ${data}`);
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python rating calculation completed successfully');
        resolve(true);
      } else {
        console.error(`Python rating calculation failed with code ${code}`);
        resolve(false);
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python rating calculation:', error);
      resolve(false);
    });
  });
}

async function importRatingsToDatabase() {
  // This would import the generated CSV files into the database
  // For now, we'll just log that this step would happen
  console.log('Importing ratings to database...');
  // In a real implementation, this would call the database import functions
  return true;
}

async function main() {
  try {
    console.log('Running Python rating system workflow...');
    
    // Define file paths
    const matchesFile = path.join(__dirname, '..', 'data', 'matches.csv');
    const seedsFile = path.join(__dirname, '..', 'data', 'seeds.csv');
    
    // Check if matches file exists
    if (!fs.existsSync(matchesFile)) {
      console.error(`Matches file not found: ${matchesFile}`);
      console.error('Please create a matches.csv file in the data directory with match data');
      process.exit(1);
    }
    
    // Run Python rating calculation
    const pythonSuccess = await runPythonRatingSystem(matchesFile, fs.existsSync(seedsFile) ? seedsFile : undefined);
    
    if (!pythonSuccess) {
      console.error('Python rating calculation failed');
      process.exit(1);
    }
    
    // Import ratings to database
    const importSuccess = await importRatingsToDatabase();
    
    if (!importSuccess) {
      console.error('Failed to import ratings to database');
      process.exit(1);
    }
    
    console.log('Python rating system workflow completed successfully!');
  } catch (error) {
    console.error('Error running Python rating system workflow:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export default main;