# ELOQ Rating System Documentation

## Overview

The ELOQ rating system is an Elo-like rating system adapted for pool/billiards. It's based on the Python reference implementation (`pool_elo.py`) and integrated with a Next.js web application using PostgreSQL for data storage.

## Components

### Python Rating Engine (`pool_elo.py`)

The core rating calculation engine that processes match data and generates player ratings using an Elo-like algorithm with adaptations for pool:

- **Rack-share scoring**: Uses rack-share as the primary observed score
- **Optional balls-made blending**: Supports optional blending with balls-made micro-score
- **Race length scaling**: Scales rating updates by race length
- **Event strength multipliers**: Applies multipliers based on event tier
- **Format offset**: Applies small rating offset for winner-break format
- **Margin dampening**: Uses logarithmic margin dampening
- **K-factor selection**: Implements uncertainty-aware K-factors
- **Field strength adjustment**: Applies field strength multiplier based on average rating

### Web Application (`eloq-webapp`)

Next.js application that displays player ratings and provides a user interface for viewing rankings, player profiles, and tournament information.

### Database (`PostgreSQL`)

Storage for player data, match results, tournament information, and user accounts.

## Data Flow

1. **Match Data Collection**: Match results are collected and stored in a CSV file (`data/matches.csv`)
2. **Rating Calculation**: The Python script processes the match data to calculate updated player ratings
3. **Rating Import**: The web application imports the calculated ratings into the PostgreSQL database
4. **Display**: The web application displays player ratings, rankings, and statistics

## Scripts

### `run-rating-calculation.py`

Python script that runs the rating calculation and generates CSV output files.

### `update-ratings.sh`

Shell script that automates the entire rating update workflow:
1. Runs the Python rating calculation
2. Imports the results into the database

### TypeScript Scripts in `eloq-webapp/scripts/`

- `update-player-ratings.ts`: Orchestrates the complete player rating update workflow
- `import-ratings.ts`: Imports Python-generated CSV data into the database
- `generate-matches-data.ts`: Generates sample match data for testing
- `init-db-with-python-data.ts`: Initializes the database with Python-generated player data

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

The database includes tables for:
- `players`: Player information and ratings
- `matches`: Individual match results
- `tournaments`: Tournament information
- `users`: User accounts and preferences

## Setup and Usage

### Prerequisites

- Python 3.x
- Node.js 18+
- PostgreSQL database

### Running the Rating System

1. Prepare match data in `eloq-webapp/data/matches.csv`
2. Run the rating calculation:
   ```bash
   python3 pool_elo.py --matches eloq-webapp/data/matches.csv
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