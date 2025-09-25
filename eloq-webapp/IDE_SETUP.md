# IDE Setup for ELOQ Webapp

This document outlines the IDE setup for the ELOQ Webapp project.

## Installed Components

We've installed the following shadcn/ui components:

- accordion
- alert
- badge
- checkbox
- dropdown-menu
- tabs
- tooltip

These components are now available in the `src/components/ui` directory.

## IDE Configuration

We've set up the following IDE configurations in the `.vscode` directory:

### Extensions

Recommended VS Code extensions are listed in `.vscode/extensions.json`:

- Prettier (code formatting)
- Tailwind CSS IntelliSense
- TypeScript Next
- ESLint
- JSON support
- React support
- React Native support
- ES7 React/Redux/React-Native snippets

### Settings

IDE settings in `.vscode/settings.json` include:

- TypeScript configuration
- Code formatting on save with Prettier
- ESLint integration
- Tailwind CSS class detection
- Emmet support for React

### Debugging

Launch configurations in `.vscode/launch.json`:

- Next.js server-side debugging
- Next.js client-side debugging
- Full stack debugging

### Tasks

Build tasks in `.vscode/tasks.json`:

- Development server (`npm run dev`)
- Production build (`npm run build`)
- Linting (`npm run lint`)

## Verification

TypeScript and ESLint are properly configured:

- TypeScript compilation passes without errors
- ESLint is integrated with the IDE
- Tailwind CSS IntelliSense is working
- Code formatting is applied on save

## Usage

To start working with the project:

1. Install the recommended VS Code extensions
2. Open the project in VS Code
3. Run `npm run dev` to start the development server
4. Use the shadcn/ui components from `src/components/ui`
