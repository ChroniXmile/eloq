# ELOQ Rating System Integration

This document describes how the ELOQ web application integrates with the Python-based rating system.

## Overview

The ELOQ web application uses a Python script (`pool_elo.py`) to calculate player ratings based on match results. The web application then imports these ratings into a PostgreSQL database for display and further analysis.

## Components

### 1. Python Rating System (`pool_elo.py`)

The core rating calculation engine is implemented in Python. It takes match data as input and produces player ratings as output.

#### Features:
- Elo-like rating system adapted for pool/billiards
- Rack-share scoring with optional balls-made blending
- Race length scaling
- Event strength multipliers
- Format offsets for different break formats
- Margin dampening
- Uncertainty-aware K-factors
- Field strength adjustment

### 2. Data Flow

The data flows through the system as follows:

1. **Match Data Collection**: Match results are collected and stored in a CSV file (`matches.csv`)
2. **Rating Calculation**: The Python script processes the match data to calculate updated player ratings
3. **Rating Import**: The web application imports the calculated ratings into the PostgreSQL database
4. **Display**: The web application displays player ratings, rankings, and statistics

### 3. Integration Scripts

Several scripts coordinate the integration between the Python rating system and the web application:

#### `run-rating-calculation.py`
Runs the Python rating calculation script and generates CSV output files.

#### `update-ratings.sh`
Shell script that automates the entire rating update workflow:
1. Runs the Python rating calculation
2. Imports the results into the database

#### TypeScript Integration Scripts
Located in `src/lib/db/` and `scripts/`:
- `import-python-ratings.ts`: Imports Python-generated CSV data into the database
- `rating-coordinator.ts`: Coordinates the entire rating update process
- `init-from-python.ts`: Initializes the database with player ratings from Python-generated CSV

## API Endpoints

### `/api/ratings/update`
Endpoint to trigger rating updates:
- Runs the Python rating calculation
- Imports the results into the database
- Updates player rankings

### `/api/ratings/init`
Endpoint to initialize the database with Python-generated ratings:
- Initializes the database with player data from the Python script output

## Database Schema

The database schema includes tables for players, matches, tournaments, and users. Player ratings are stored in the `players` table.

## Setup and Usage

### Prerequisites
- Python 3.x
- Node.js 18+
- PostgreSQL database

### Running the Rating System

1. Prepare match data in `data/matches.csv`
2. Run the rating calculation:
   ```bash
   python3 pool_elo.py --matches data/matches.csv
   ```
3. Import the results into the database:
   ```bash
   cd eloq-webapp
   npx tsx scripts/import-ratings.ts
   ```

### Automated Workflow

To run the entire workflow automatically:
```bash
./update-ratings.sh
```

This script will:
1. Run the Python rating calculation
2. Import the results into the database
3. Update player rankings

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket connections to update ratings in real-time as matches are added
2. **Scheduled Jobs**: Set up cron jobs to automatically update ratings daily/weekly
3. **Rating History**: Store historical rating data for charting and trend analysis
4. **Advanced Analytics**: Add more sophisticated analytics and visualizations
5. **Match Validation**: Implement match data validation before processing
6. **Error Handling**: Improve error handling and reporting in the integration scripts