<!--
SYNC IMPACT REPORT
==================
Version change: 0.1.0 → 0.2.0
Modified principles: 
- Added Principle VI. Accessibility and Responsive Design
Added sections:
- Accessibility Standards in Additional Constraints
- Responsive Design Standards in Additional Constraints
Templates requiring updates:
- ✅ Updated .specify/templates/plan-template.md
- ✅ Updated .specify/templates/spec-template.md
- ✅ Updated .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# ELOQ Constitution

## Core Principles

### I. Library-First Approach

Every feature starts as a standalone library; Libraries must be self-contained, independently testable, and documented; Clear purpose required - no organizational-only libraries. In the context of a Next.js web application, this means creating reusable components and modules that can be independently tested and documented.

### II. CLI Interface

Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats. For development tools and automation scripts, CLI interfaces should be provided to enable easy integration into development workflows.

### III. Test-First (NON-NEGOTIABLE)

TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced. All code changes must follow the Test-First approach with strict adherence to the Red-Green-Refactor cycle.

### IV. Integration Testing

Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas. Integration tests are required for API endpoints, database interactions, and component integrations.

### V. Simplicity

Start simple, YAGNI principles; MAJOR.MINOR.BUILD format; Text I/O ensures debuggability; Structured logging required. Avoid over-engineering and implement only what is needed. Follow the YAGNI (You Aren't Gonna Need It) principle.

### VI. Accessibility and Responsive Design

All user interfaces must be accessible and responsive; Accessibility standards (WCAG 2.1 AA) and responsive design (mobile-first with desktop optimization) are non-negotiable requirements. Every component and page must be tested for accessibility compliance and responsive behavior across device sizes.

## Additional Constraints

Technology Stack Requirements:

- Primary framework: Next.js with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL
- Component library: shadcn/ui
- State management: React hooks and context

Performance Standards:

- Page load times under 200ms for static content
- API response times under 500ms for database queries
- Bundle size optimized for fast loading
- Mobile and desktop responsive design
- First Contentful Paint under 1.5s on 3G networks

Accessibility Standards:

- WCAG 2.1 AA compliance mandatory
- Semantic HTML structure required
- ARIA attributes for complex components
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios meeting WCAG standards

Security Requirements:

- All data transmission over HTTPS
- Input validation and sanitization for all user inputs
- Content Security Policy (CSP) headers
- Protection against common web vulnerabilities (XSS, CSRF, SQL injection)

Deployment Constraints:

- Containerized deployment using Docker
- CI/CD pipeline with automated testing
- Staging environment for pre-production validation
- Rollback capability for deployments

## Development Workflow

Quality Gates:

1. Feature specification following the spec-template.md format
2. Implementation plan created using plan-template.md
3. Code review by at least one peer developer
4. All automated tests must pass (unit, integration, contract)
5. Performance benchmarks met
6. Security scanning completed
7. Manual QA verification in staging environment
8. Accessibility audit passed
9. Responsive design validation completed

Review Process:

- All changes must be submitted via pull requests
- PRs must include a description of changes and testing approach
- At least one approval required before merging
- Constitution compliance check required for all PRs

Deployment Process:

- Main branch deploys automatically to production
- Staging environment updates on merge to develop branch
- Hotfixes follow separate branch strategy
- Release tags created for each production deployment

## Governance

Constitution Supersedes All Other Practices:
This constitution takes precedence over all other development practices, guidelines, or conventions. Any conflicts between this document and other project documentation should be resolved in favor of this constitution.

Amendment Process:

- Changes to this constitution require majority approval from core team
- All amendments must be documented with rationale
- Migration plan required for breaking changes
- Versioning follows semantic versioning (MAJOR.MINOR.PATCH)

Compliance Verification:

- All PRs/reviews must verify compliance with constitutional principles
- Regular audits of codebase for constitutional adherence
- Violations must be justified with clear rationale
- Use plan-template.md and spec-template.md for runtime development guidance

**Version**: 0.2.0 | **Ratified**: 2025-09-20 | **Last Amended**: 2025-09-20