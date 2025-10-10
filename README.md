# ELOQ - Pool/Billiards Rating System

ELOQ is a modern pool/billiards score tracking and ranking website featuring an Elo-like rating system for player rankings.

## Project Overview

This project consists of two main components:

1. A Python-based Elo-like rating system (`pool_elo.py`) that calculates player ratings based on match outcomes
2. A Next.js web application (`eloq-webapp`) that provides a sleek, responsive interface for viewing player rankings and statistics

## Features

### Rating System

The ELOQ rating system is based on the Elo rating system used in chess, adapted specifically for pool/billiards with these advanced features:

- **Rack-share Scoring**: Uses rack-share as the primary observed score
- **Optional Balls-made Blending**: Supports optional blending with balls-made micro-score
- **Race Length Scaling**: Scales rating updates by race length
- **Event Strength Multipliers**: Applies multipliers based on event tier (local, regional, national, major)
- **Format Offset**: Applies small rating offset for winner-break format
- **Margin Dampening**: Uses logarithmic margin dampening
- **K-factor Selection**: Implements uncertainty-aware K-factors
- **Field Strength Adjustment**: Applies field strength multiplier based on average rating

### Web Application

- **Player Rankings**: Top 100 players ranked by Elo-like rating system
- **Player Profiles**: Detailed player information with statistics and rating history
- **Tournament Management**: Create and track tournaments with results
- **User Dashboards**: Personalized dashboards for registered users
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant interface

## Technology Stack

### Backend/Algorithm

- Python 3 with pandas for data processing
- Mathematical algorithms for Elo-like rating calculations

### Frontend

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- React 19

### Database

- PostgreSQL (with fallback to mock data for development)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.x
- PostgreSQL database (optional, for production deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eloq
   ```

2. Install Python dependencies:
   ```bash
   pip3 install pandas
   ```

3. Install web application dependencies:
   ```bash
   cd eloq-webapp
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the `eloq-webapp` directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=eloq_test
   DB_USER=postgres
   DB_PASSWORD=
   ```

### Development

1. Run the development server:
   ```bash
   cd eloq-webapp
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Rating System Integration

The web application integrates with the Python rating system to calculate and display player ratings:

1. **Match Data Collection**: Match results are collected and stored in `eloq-webapp/data/matches.csv`
2. **Rating Calculation**: The Python script (`pool_elo.py`) processes the match data to calculate updated player ratings
3. **Rating Import**: The web application imports the calculated ratings into the database
4. **Display**: The web application displays player ratings, rankings, and statistics

To update player ratings:

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

Or use the automated workflow:
```bash
./update-ratings.sh
```

## Project Structure

```
eloq/
├── pool_elo.py                 # Python script implementing Elo-like rating algorithm
├── pool_rating_spec.md         # Specification for the rating system
├── update-ratings.sh           # Automation script for rating updates
├── run-rating-calculation.py  # Script to run Python rating engine
├── demo-rating-update.sh       # Demonstration script
├── run-complete-rating-update.sh # Complete workflow script
├── eloq-webapp/                # Next.js web application
│   ├── package.json            # Project dependencies and scripts
│   ├── src/
│   │   ├── app/                # Next.js app directory with pages
│   │   ├── components/         # Shared UI components
│   │   ├── models/             # Data models (Player, Match, Tournament, User)
│   │   ├── services/           # Business logic services
│   │   ├── lib/                # Utility libraries
│   │   └── ...
│   └── ...
└── specs/                      # Feature specifications
    └── 001-i-am-building/
        ├── spec.md             # Feature specification
        ├── plan.md             # Implementation plan
        ├── data-model.md       # Data model definitions
        ├── research.md         # Research findings
        ├── quickstart.md       # Quickstart guide
        └── ...
```

## Documentation

- `pool_rating_spec.md` - Complete specification for the Elo-like rating system
- `INTEGRATION_SUMMARY.md` - Summary of how the Python rating system integrates with the web application
- `INTEGRATION_OVERVIEW.md` - Detailed overview of the integration architecture
- `RATING_SYSTEM_DOCS.md` - Documentation for the rating system
- `eloq-webapp/src/app/documentation/page.tsx` - In-app documentation

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

## Acknowledgments

- Inspired by the Elo rating system used in chess
- Built with Next.js, TypeScript, and Tailwind CSS
- Uses shadcn/ui components for a consistent design system