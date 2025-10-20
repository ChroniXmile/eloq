# Project Context

## Purpose
ELOQ is a modern pool/billiards score tracking and ranking platform implementing a sophisticated Elo-like rating system for professional pool players. Provides comprehensive tournament management, player statistics, and real-time ranking updates based on match outcomes with transparent rating calculations.

## Tech Stack
- Next.js 15.5.3 with App Router and Turbopack
- React 19.1.0 with TypeScript 5
- Tailwind CSS 4 with shadcn/ui components
- PostgreSQL with pg driver
- Clerk for authentication
- Radix UI primitives for accessibility
- Jest and Testing Library for testing
- Python 3 for rating algorithm reference implementation

## Project Conventions

### Code Style
- **Naming**: PascalCase for components/types, camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **Client Components**: Mark with 'use client' directive at top
- **Import Organization**: External libraries first, then internal components, then utilities
- **Type Safety**: Explicit types for all function parameters and return values; avoid 'any'
- **Null Safety**: Use optional chaining (?.) and nullish coalescing (??)
- **Comments**: JSDoc-style for complex components; minimal inline comments (code should be self-documenting)

### Architecture Patterns
- **Component-Based**: Modular, reusable UI components with composition over inheritance
- **Service Layer**: Business logic separated from presentation in services/
- **Custom Hooks**: Encapsulate complex state logic (useLiveTournament pattern)
- **Server Components**: Leverage Next.js server components for performance
- **Type Exports**: Export all types/interfaces at top of files
- **Effect Cleanup**: Always clean up resources in useEffect returns

### Testing Strategy
- Comprehensive tests for validation logic and critical business logic
- Organize with describe blocks and clear test names
- Create complete test objects with all required fields
- Use specific assertions (toHaveLength, toContain, toBeGreaterThan)
- Unit tests in tests/unit/, integration in tests/integration/, contracts in tests/contract/

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- Pull requests for code review
- Test before merge

## Domain Context
Pool/billiards rating system with specialized Elo-like algorithm:
- **Rack-share scoring**: Primary metric (not just win/loss)
- **Race length scaling**: Adjusts for match duration (race to 7 vs race to 11)
- **Event tiers**: Local, regional, national, major with strength multipliers
- **Format offsets**: Alternate break vs winner break
- **K-factors**: Provisional (80), established (40), elite (20) based on match count
- **Field strength**: Adjusts based on average event rating
- **Margin dampening**: Logarithmic calculations prevent rating inflation
- **Optional balls-made**: Micro-scoring for enhanced accuracy

## Important Constraints
- WCAG 2.1 AA accessibility compliance required
- Mobile-first responsive design
- Real-time updates for live tournaments
- Transparent rating calculations (users must understand rating changes)
- Performance optimization (memoization, lazy loading, conditional rendering)
- Never remove user code including test cases unless explicitly requested
- Do not automatically add tests unless requested

## External Dependencies
- **Clerk**: User authentication and session management
- **PostgreSQL**: Primary database for persistent storage
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Accessible component primitives
- **Recharts**: Chart and data visualization
- **Python rating engine**: Standalone pool_elo.py for rating calculations
