# Technology Stack

## Programming Languages
- **TypeScript 5**: Primary language for web application
- **Python 3**: Reference implementation of rating algorithm (pool_elo.py)
- **JavaScript**: Configuration files and build scripts

## Frontend Technologies

### Core Framework
- **Next.js 15.5.3**: React framework with App Router and Turbopack
- **React 19.1.0**: UI library with latest features
- **React DOM 19.1.0**: React rendering for web

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS
- **shadcn/ui**: Accessible component library
- **Radix UI**: Primitive component library for accessibility
  - react-accordion, react-avatar, react-checkbox, react-dialog
  - react-dropdown-menu, react-label, react-navigation-menu
  - react-progress, react-scroll-area, react-select
  - react-separator, react-slot, react-tabs, react-tooltip
- **Framer Motion 12**: Animation library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging utility

### Visualization & Effects
- **Recharts 2**: Chart and data visualization library
- **canvas-confetti**: Celebration effects
- **@tsparticles**: Particle effects engine
- **cobe**: 3D globe visualization
- **ogl**: WebGL library

### Utilities
- **date-fns 4**: Date manipulation and formatting
- **next-themes**: Theme management (dark/light mode)
- **react-day-picker**: Date picker component

## Backend Technologies

### Database
- **PostgreSQL**: Primary database
- **pg 8.16.3**: PostgreSQL client for Node.js

### Authentication
- **Clerk**: User authentication and session management
  - @clerk/nextjs 6.32.2
  - @clerk/clerk-sdk-node 4.13.23
  - @clerk/themes 2.4.21

### API & Webhooks
- **Svix 1.76.1**: Webhook management

### Data Processing
- **csv-parse 6.1.0**: CSV file parsing
- **dotenv 17.2.2**: Environment variable management

## Development Tools

### Build & Development
- **Turbopack**: Next.js bundler (via --turbopack flag)
- **tsx 4.20.5**: TypeScript execution for scripts
- **PostCSS**: CSS processing with Tailwind

### Testing
- **Jest 30.1.3**: Testing framework
- **ts-jest 29.4.4**: TypeScript support for Jest
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/jest-dom 6.8.0**: Custom Jest matchers
- **@testing-library/user-event 14.6.1**: User interaction simulation

### Code Quality
- **ESLint 9**: JavaScript/TypeScript linting
  - eslint-config-next 15.5.3
  - @eslint/eslintrc 3
- **Prettier 3.6.2**: Code formatting
- **TypeScript 5**: Static type checking

## Development Commands

### Primary Commands
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands
```bash
npm run init-db      # Initialize database (npx tsx init-database.ts)
npm run test-db      # Test database connection (npx tsx test-database.ts)
npm run migrate      # Run database migrations up (npx tsx run-migrations.ts up)
npm run rollback     # Rollback database migrations (npx tsx run-migrations.ts down)
```

### Testing Commands
```bash
npm test             # Run test suite with Jest
npm run test:watch   # Run tests in watch mode (if configured)
```

## Environment Requirements

### Runtime
- **Node.js**: 18.x or later (recommended: 20.x)
- **Package Manager**: npm, yarn, or pnpm
- **Database**: PostgreSQL (version 12+)

### Environment Variables
Required in `.env` or `.env.local`:
- Database connection credentials
- Clerk authentication keys
- API endpoints and secrets
- Feature flags (if applicable)

## Type Definitions
- **@types/node**: Node.js type definitions
- **@types/react**: React type definitions
- **@types/react-dom**: React DOM type definitions
- **@types/jest**: Jest type definitions
- **@types/pg**: PostgreSQL client type definitions
- **@types/canvas-confetti**: Canvas confetti type definitions

## Configuration Files
- `tsconfig.json`: TypeScript compiler configuration
- `next.config.ts`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration (via @tailwindcss/postcss)
- `postcss.config.mjs`: PostCSS configuration
- `jest.config.js`: Jest testing configuration
- `eslint.config.mjs`: ESLint configuration
- `.prettierrc`: Prettier formatting rules
- `components.json`: shadcn/ui component configuration

## Python Reference Implementation
- **pool_elo.py**: Standalone Python script implementing the rating algorithm
- Used for validation and reference of rating calculations
- Processes CSV files (matches.csv, seeds.csv)
- Outputs rating reports and final ratings
