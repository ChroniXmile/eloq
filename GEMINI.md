# Project: eloq

This document provides a summary of the `eloq` project for the Gemini CLI.

## System Information

*   **Operating System:** darwin
*   **Project Directory:** `/Users/industcomp/Developer/Projects/eloq`

## Technology Stack

*   **Frontend (`eloq-webapp`):**
    *   Framework: Next.js (React)
    *   Language: TypeScript
    *   Styling: Tailwind CSS (inferred from `postcss.config.mjs` and `globals.css`)
    *   Linting/Formatting: ESLint, Prettier
*   **Backend/Scripting:**
    *   Language: Python
    *   Files: `pool_elo.py`, `run-rating-calculation.py`
*   **Package Management:** npm
*   **CI/CD & Tooling:**
    *   GitHub Actions (`.github/workflows`)
    *   VSCode (`.vscode/settings.json`)

## Project Structure Overview

The project is a monorepo containing a Python backend/scripting component and a Next.js web application.

```
/Users/industcomp/Developer/Projects/eloq/
├───.gitignore
├───package.json
├───pool_elo.py
├───run-rating-calculation.py
├───eloq-webapp/
│   ├───package.json
│   ├───next.config.ts
│   ├───tsconfig.json
│   ├───src/
│   │   ├───app/
│   │   │   ├───page.tsx
│   │   │   └───...
│   │   ├───components/
│   │   └───...
│   └───...
└───...
```
