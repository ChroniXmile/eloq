# ELOQ System Setup Guide

## Overview

This guide explains how to set up and run the complete ELOQ system, which includes:

1. Python-based rating calculation engine
2. Next.js web application
3. PostgreSQL database

## Prerequisites

- Node.js 18+
- Python 3.x
- PostgreSQL 12+
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eloq
```

### 2. Install Dependencies

#### Python Dependencies
```bash
pip3 install pandas
```

#### Web Application Dependencies
```bash
cd eloq-webapp
npm install
```

### 3. Database Setup

#### Install PostgreSQL
Follow the official PostgreSQL installation guide for your operating system.

#### Create Database
```sql
CREATE DATABASE eloq_test;
CREATE USER postgres WITH PASSWORD '';
GRANT ALL PRIVILEGES ON DATABASE eloq_test TO postgres;
```

#### Configure Environment Variables
Create a `.env.local` file in the `eloq-webapp` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eloq_test
DB_USER=postgres
DB_PASSWORD=
```

### 4. Initialize Database

```bash
cd eloq-webapp
npx tsx scripts/init-db-with-python-data.ts
```

## Running the System

### 1. Start the Web Application

```bash
cd eloq-webapp
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Update Player Ratings

#### Option A: Manual Update
```bash
# From project root
python3 pool_elo.py --matches eloq-webapp/data/matches.csv
cd eloq-webapp
npx tsx scripts/import-ratings.ts
```

#### Option B: Automated Update
```bash
# From project root
./update-ratings.sh
```

## System Components

### Python Rating Engine (`pool_elo.py`)

The core rating calculation engine that processes match data and generates player ratings.

#### Usage
```bash
python3 pool_elo.py --matches matches.csv --seeds seeds.csv
# or without seeds
python3 pool_elo.py --matches matches.csv
```

### Web Application (`eloq-webapp`)

Next.js application that displays player rankings and provides a user interface.

#### Key Features
- Player rankings based on Elo-like rating system
- Player profiles with detailed statistics
- Tournament management
- User dashboards
- Responsive design

### Database Integration

The system uses PostgreSQL for persistent data storage with fallback to mock data.

#### Tables
- `players`: Player information and ratings
- `matches`: Individual match results
- `tournaments`: Tournament information
- `users`: User accounts and preferences

## Data Flow

1. **Match Data Collection**: Match results are collected and stored in `eloq-webapp/data/matches.csv`
2. **Rating Calculation**: The Python script processes the match data to calculate updated player ratings
3. **Rating Import**: The web application imports the calculated ratings into the database
4. **Display**: The web application displays player ratings, rankings, and statistics

## Scripts

### Rating Update Scripts
- `update-ratings.sh`: Main automation script for rating updates
- `run-rating-calculation.py`: Script to run the Python rating engine
- `run-complete-rating-update.sh`: Complete workflow script

### Database Scripts
- `init-db-with-python-data.ts`: Initialize database with Python-generated data
- `reset-database.ts`: Reset database to clean state
- `test-db-connection.ts`: Test database connectivity

### Data Generation Scripts
- `generate-matches-data.ts`: Generate sample match data for testing
- `generate-sample-data.ts`: Generate comprehensive sample data

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check database credentials in `.env.local`
3. Ensure database exists and user has proper permissions
4. Run `npx tsx test-db-connection.ts` to test connection

### Python Script Issues
1. Verify Python 3.x is installed
2. Check that required packages are installed (`pip3 install pandas`)
3. Ensure match data CSV format is correct

### Web Application Issues
1. Verify all dependencies are installed (`npm install`)
2. Check that environment variables are set correctly
3. Ensure database is initialized

## Customization

### Rating Algorithm Parameters
The Python script uses several parameters that can be adjusted:
- `SIGMA`: Elo scale (default: 400)
- `T0`: Baseline race length (default: 9)
- `K_PROV`: K-factor for provisional players (default: 40)
- `K_EST`: K-factor for established players (default: 20)
- `K_ELITE`: K-factor for elite players (rating >= 2400) (default: 10)
- Tier multipliers for event strength
- Format offset for winner-break format

### Web Application Customization
- Modify components in `src/components/`
- Update styles in `src/app/globals.css`
- Adjust data models in `src/models/`
- Extend services in `src/services/`

## Maintenance

### Regular Tasks
1. Update player ratings with new match data
2. Monitor database performance and optimize queries
3. Update dependencies regularly
4. Backup database periodically

### Rating Updates
Run rating updates whenever new match data is available:
```bash
./update-ratings.sh
```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Write tests for your changes
5. Commit your changes
6. Push to your fork
7. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.