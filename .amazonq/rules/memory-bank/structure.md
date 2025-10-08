# Project Structure

## Directory Organization

### Root Level
```
eloq/
├── eloq-webapp/          # Main Next.js web application
├── specs/                # Project specifications and documentation
├── data/                 # Data files and logs
├── pool_elo.py          # Python reference implementation of rating algorithm
├── pool_rating_spec.md  # Detailed rating system specification
└── [config directories] # Various tool configurations (.codacy, .github, etc.)
```

### Web Application Structure (eloq-webapp/)
```
eloq-webapp/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── api/          # API route handlers
│   │   └── [pages]/      # Page components and routes
│   ├── components/       # Reusable UI components
│   ├── models/          # TypeScript data models and types
│   ├── services/        # Business logic and data services
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and helpers
│   └── middleware.ts    # Next.js middleware
├── tests/
│   ├── unit/            # Unit tests for components and functions
│   ├── integration/     # Integration tests for features
│   └── contract/        # API contract tests
├── public/              # Static assets (images, icons, etc.)
└── [config files]       # Configuration files (tsconfig, jest, etc.)
```

## Core Components

### Frontend Architecture
- **App Router**: Next.js 15 App Router for file-based routing and server components
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **State Management**: React hooks and server state management
- **Styling**: Tailwind CSS with custom theme configuration
- **Authentication**: Clerk for user authentication and session management

### Backend Architecture
- **API Routes**: Next.js API routes for server-side logic
- **Database**: PostgreSQL for persistent data storage
- **Services Layer**: Business logic separated from API handlers
- **Models**: TypeScript interfaces and types for data structures

### Key Component Relationships
```
Pages (app/) 
  ↓ uses
Components (components/)
  ↓ uses
Services (services/)
  ↓ uses
Models (models/)
  ↓ interacts with
Database (PostgreSQL)
```

## Architectural Patterns

### Design Patterns
- **Component-Based Architecture**: Modular, reusable UI components
- **Service Layer Pattern**: Business logic separated from presentation
- **Repository Pattern**: Data access abstraction through services
- **Server Components**: Leverage Next.js server components for performance
- **API Route Handlers**: RESTful API design with Next.js route handlers

### Code Organization Principles
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Type Safety**: Comprehensive TypeScript types throughout the application
- **Modular Design**: Small, focused modules with single responsibilities
- **Testability**: Components and services designed for easy testing
- **Accessibility First**: WCAG 2.1 AA compliance built into components

### Data Flow
1. **User Interaction** → Component
2. **Component** → Service (business logic)
3. **Service** → Database/API
4. **Database/API** → Service (data transformation)
5. **Service** → Component (state update)
6. **Component** → UI (render)

## Special Directories

### Configuration Directories
- `.amazonq/`: Amazon Q AI assistant rules and memory bank
- `.codacy/`: Code quality and analysis configurations
- `.github/`: GitHub workflows and instructions
- `.specify/`: Project specification templates and memory
- `.trae/`: Project rules and ignore patterns

### Specifications (specs/)
- `001-i-am-building/`: Current project specifications
  - `data-model.md`: Database schema and data structures
  - `plan.md`: Development plan and milestones
  - `spec.md`: Detailed feature specifications
  - `tasks.md`: Task breakdown and tracking
  - `contracts/`: API contracts and interfaces
  - `tests/`: Test specifications

## Module Dependencies

### Primary Dependencies
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type system
- **Tailwind CSS 4**: Styling framework
- **PostgreSQL**: Database (via pg driver)
- **Clerk**: Authentication
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built accessible components

### Development Dependencies
- **Jest**: Testing framework
- **Testing Library**: React component testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **tsx**: TypeScript execution for scripts
