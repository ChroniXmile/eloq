# Agent Guidelines for ELOQ Project

## Build/Lint/Test Commands

### Webapp (eloq-webapp/)
- **Dev server**: `cd eloq-webapp && npm run dev`
- **Build**: `cd eloq-webapp && npm run build`
- **Lint**: `cd eloq-webapp && npm run lint`
- **Tests**: `cd eloq-webapp && npx jest`
- **Single test**: `cd eloq-webapp && npx jest path/to/file.test.ts`
- **Type check**: `cd eloq-webapp && npx tsc --noEmit`

### Database
- **Init DB**: `cd eloq-webapp && npm run init-db`
- **Test DB**: `cd eloq-webapp && npm run test-db`
- **Migrate**: `cd eloq-webapp && npm run migrate`

## Code Style Guidelines

### Language Usage
- TypeScript for webapp components/services, Python for rating calculations
- Follow ESLint (Next.js config) and Prettier formatting
- No comments unless explicitly requested by user

### Imports & Modules
- Use `@/` aliases for internal imports (e.g., `@/models/player`)
- Group imports: React/Next.js, UI components, utilities, types
- Single quotes for strings

### Naming Conventions
- **Variables/Functions**: camelCase (`calculateRating`, `playerData`)
- **Components/Types**: PascalCase (`PlayerCard`, `Player`)
- **Files**: kebab-case for components (`player-card.tsx`), camelCase for utilities (`playerService.ts`)
- **Constants**: UPPER_SNAKE_CASE (`K_FACTOR`, `DEFAULT_RATING`)

### TypeScript
- Strong typing with interfaces for all data structures
- Use JSDoc comments for public APIs
- Prefer `interface` over `type` for object shapes
- Explicit return types for functions

### Error Handling
- Validate inputs and return error arrays
- Use try/catch for async operations
- Prevent XSS/SQL injection through proper validation

### Testing
- Jest for unit/integration tests
- Maintain 80%+ coverage
- Use mock data for development
- Test rating calculations thoroughly

### UI/UX
- shadcn/ui components for consistency
- WCAG 2.1 AA accessibility compliance
- Responsive, mobile-first design
- Tailwind CSS with design system
- Avoid emojis unless user requests

### Security
- No secrets/keys in code; use environment variables
- Validate all inputs
- Use absolute paths for file operations

### Git Workflow
- Feature branches from develop
- Descriptive commit messages
- Run lint/tests before commits

## Project Rules Integration

### From .trae/rules/project_rules.md
- Implement Elo-like rating system per pool_rating_spec.md
- Use exact formulas: expected score, race scaling, margin dampening, K-factors
- Support optional features: balls-made blending, event multipliers, format offsets
- Follow Next.js best practices
- Plan for PostgreSQL integration

### From .github/instructions/codacy.instructions.md
- Run Codacy analysis after file edits
- Use provider: gh, organization: ChroniXmile, repository: eloq
- Check security vulnerabilities after dependency changes

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
