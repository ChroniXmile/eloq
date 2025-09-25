# ELOQ - Pool/Billiards Score Tracking and Ranking Website

![ELOQ Logo](public/favicon.ico)

A modern, sleek pool/billiards score tracking and ranking website featuring an Elo-like rating system, player rankings, tournament management, and user dashboards.

## Features

- **Player Rankings**: Top 100 players ranked by Elo-like rating system
- **Player Profiles**: Detailed player information with statistics and rating history
- **Tournament Management**: Create and track tournaments with results
- **User Dashboards**: Personalized dashboards for registered users
- **Rating System**: Sophisticated Elo-like rating calculation based on match outcomes
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant interface

## Technologies Used

- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Strongly typed programming language for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Accessible UI components built with Radix UI and Tailwind CSS
- **PostgreSQL**: Robust relational database for data storage
- **Jest**: Testing framework for unit and integration tests

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/eloq-webapp.git
   cd eloq-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials and other settings
   ```

4. Run database migrations (if applicable):
   ```bash
   npm run db:migrate
   # or
   yarn db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code issues
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode

## Project Structure

```
eloq-webapp/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── components/      # Shared components
│   │   ├── lib/             # Utility functions
│   │   └── pages/           # Page components
│   ├── components/          # UI components
│   ├── models/             # Data models
│   ├── services/           # Business logic services
│   └── lib/                # Utility libraries
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/         # Integration tests
│   └── contract/           # Contract tests
├── public/                 # Static assets
└── ...
```

## Rating System

The ELOQ rating system is based on the Elo rating system used in chess, adapted for pool/billiards. Key features include:

- **Rack-share Scoring**: Uses rack-share as the primary observed score
- **Optional Balls-made Blending**: Supports optional blending with balls-made micro-score
- **Race Length Scaling**: Scales rating updates by race length
- **Event Strength Multipliers**: Applies multipliers based on event tier
- **Format Offset**: Applies small rating offset for winner-break format
- **Margin Dampening**: Uses logarithmic margin dampening
- **K-factor Selection**: Implements uncertainty-aware K-factors
- **Field Strength Adjustment**: Applies field strength multiplier based on average rating

### Rating Calculation Formula

The rating change (ΔR) for a player is calculated as:

```
ΔR = K × G_race × M_margin × (S* - E)
```

Where:
- K = K-factor based on player experience and rating
- G_race = √(T/T0) where T = total racks played, T0 = baseline race length
- M_margin = ln(1 + |racks_i - racks_j|) / (1 + 10^(|ΔR|/σ))
- S* = Observed score (blended if balls data is available)
- E = Expected score based on rating difference

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for all new features
- Maintain 80%+ test coverage

### Testing

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **Contract Tests**: Test API endpoints and data contracts
- **End-to-End Tests**: Test user workflows (using Cypress or Playwright)

### Git Workflow

1. Create a feature branch from `develop`
2. Make changes and commit frequently with descriptive messages
3. Push changes and create a Pull Request
4. Request code review from team members
5. Address feedback and merge after approval

## Deployment

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
docker build -t eloq-webapp .
docker run -p 3000:3000 eloq-webapp
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Next.js team for the amazing framework
- Shoutout to the Tailwind CSS community for the styling framework
- Appreciation to the shadcn/ui contributors for accessible components