# ELOQ Project Context

## Project Overview

ELOQ is a modern pool/billiards score tracking and ranking website featuring an Elo-like rating system for player rankings. The project consists of two main components:

1. A Python script (`pool_elo.py`) that implements the Elo-like rating algorithm for calculating player ratings based on match outcomes
2. A Next.js web application (`eloq-webapp`) that provides a sleek, responsive interface for viewing player rankings, player information, user dashboards, and tournament information

## Project Structure

```markdown
eloq/
├── pool_elo.py                 # Python script implementing Elo-like rating algorithm
├── pool_rating_spec.md         # Specification for the rating system
├── eloq-webapp/                # Next.js web application
│   ├── package.json            # Project dependencies and scripts
│   ├── src/
│   │   ├── app/                # Next.js app directory with pages
│   │   ├── components/         # Shared UI components
│   │   ├── models/             # Data models (Player, Match, Tournament, User)
│   │   ├── services/           # Business logic services
│   │   └── lib/                # Utility libraries
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

## Core Technologies

### Backend/Algorithm

- Python 3
- Pandas for data processing
- Mathematical algorithms for Elo-like rating calculations

### Web Application

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- React 19
- PostgreSQL (planned, currently using mock data)

## Key Features

### Rating System

The ELOQ rating system is based on the Elo rating system used in chess, adapted for pool/billiards with these key features:

- **Rack-share Scoring**: Uses rack-share as the primary observed score
- **Optional Balls-made Blending**: Supports optional blending with balls-made micro-score
- **Race Length Scaling**: Scales rating updates by race length
- **Event Strength Multipliers**: Applies multipliers based on event tier
- **Format Offset**: Applies small rating offset for winner-break format
- **Margin Dampening**: Uses logarithmic margin dampening
- **K-factor Selection**: Implements uncertainty-aware K-factors
- **Field Strength Adjustment**: Applies field strength multiplier based on average rating

### Web Application Features

- **Player Rankings**: Top 100 players ranked by Elo-like rating system
- **Player Profiles**: Detailed player information with statistics and rating history
- **Tournament Management**: Create and track tournaments with results
- **User Dashboards**: Personalized dashboards for registered users
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant interface

## Data Models

### Player

- id: string (unique identifier)
- name: string (player's full name)
- rating: number (Elo-like rating)
- ranking: number (current ranking from 1-100)
- wins: number (total wins)
- losses: number (total losses)
- winRate: number (calculated win percentage)
- avatarUrl: string (URL to player's avatar image)
- joinDate: Date (date player joined)
- lastPlayed: Date (date of last game)
- country: string (player's country)
- breaks: number (total century breaks)
- highestBreak: number (highest score achieved)
- description: string (brief bio)
- matchesPlayed: number (total matches played)
- provisional: boolean (true if < 30 matches)

### Match

- id: string (unique identifier)
- date: Date (match date)
- eventId: string (reference to tournament)
- eventTier: enum (local, regional, national, major)
- format: enum (alternate, winner)
- discipline: string (e.g., 9-ball, 10-ball)
- ballsPerRack: number (typical: 9, 10, 15)
- raceTo: number (target for winner)
- playerI: string (reference to player I)
- playerJ: string (reference to player J)
- racksI: number (racks won by player I)
- racksJ: number (racks won by player J)
- ballsI: number (balls pocketed by player I, optional)
- ballsJ: number (balls pocketed by player J, optional)
- fieldAvg: number (event field average rating, optional)

## Development Commands

### Python Rating Script

```bash
python3 pool_elo.py --matches matches.csv --seeds seeds.csv
# or without seeds
python3 pool_elo.py --matches matches.csv
```

### Web Application Development

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Testing
npm test
npm run test:watch
```

## Development Guidelines

### Code Style

- TypeScript for the web application
- ESLint and Prettier for code formatting
- Follow Next.js and React best practices

### Testing

- Jest for unit tests
- React Testing Library for component tests
- Write tests for all new features
- Maintain 80%+ test coverage

### Rating Algorithm Implementation

The web application implements the same rating calculation logic as the Python script:

- Uses the same constants (SIGMA = 400, T0 = 9, etc.)
- Implements the same formulas for expected score, race scaling, margin dampening
- Applies the same K-factor selection based on player experience and rating
- Supports the same optional features (balls-made blending, event strength multipliers)

## Project Status

This is a work-in-progress project with:

- A complete Python implementation of the rating algorithm
- A Next.js web application with mock data
- Planned integration of the rating algorithm with the web application
- Plans for PostgreSQL database integration
