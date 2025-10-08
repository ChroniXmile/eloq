# Development Guidelines

## Code Quality Standards

### File Headers and Documentation
- **Component Documentation**: Include comprehensive JSDoc-style comments at the top of complex components explaining purpose, integrations, and usage examples
- **Type Definitions**: Export all types and interfaces at the top of files for clarity and reusability
- **Usage Examples**: Provide commented usage examples at the end of component files showing typical implementation patterns

### Code Formatting
- **Client Components**: Always mark interactive React components with 'use client' directive at the top
- **Import Organization**: Group imports logically - external libraries first, then internal components, then utilities
- **Line Length**: Keep lines readable; break long parameter lists across multiple lines
- **Spacing**: Use consistent spacing around operators, after commas, and between logical blocks

### Naming Conventions
- **Components**: PascalCase for React components (TournamentBracket, PlayerRow, MatchCard)
- **Functions**: camelCase for functions and methods (validatePlayer, groupByRound, fmtTime)
- **Constants**: UPPER_SNAKE_CASE for constants (SIGMA, K_PROV, TIER_MULT)
- **Types**: PascalCase for types and interfaces (Player, Match, Tournament, BracketType)
- **Variables**: camelCase for variables (playerCount, matchId, tournamentId)
- **Private/Internal**: Prefix with underscore for internal properties (__prismIO)

### TypeScript Standards
- **Strict Typing**: Use explicit types for all function parameters and return values
- **Type Exports**: Export all custom types and interfaces for reuse across the codebase
- **Union Types**: Use string literal unions for constrained values ('single' | 'double' | 'round_robin')
- **Optional Properties**: Mark optional properties with ? (avatarUrl?: string)
- **Type Assertions**: Use 'as' for type assertions when necessary (row.eventTier as any)
- **Null Handling**: Use optional chaining (?.) and nullish coalescing (??) for safe property access

## Semantic Patterns

### React Component Patterns

#### Custom Hooks
```typescript
// Pattern: Encapsulate complex state logic in custom hooks
function useLiveTournament(params: {...}) {
  const [payload, setPayload] = useState<TournamentPayload | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);
  
  return payload;
}
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Separate data fetching and state management from UI rendering

#### Component Composition
```typescript
// Pattern: Break complex components into smaller, focused sub-components
function MatchCard({ m, onClick, isAdmin, onReport, ... }: {...}) {
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardContent>
        <PlayerRow player={m.playerA} highlight={...} />
        <PlayerRow player={m.playerB} highlight={...} />
      </CardContent>
    </Card>
  );
}
```
**Frequency**: Used in 2/5 files analyzed
**Purpose**: Improve readability, reusability, and maintainability

#### Conditional Rendering
```typescript
// Pattern: Use logical operators and ternary for conditional UI
{live ? (
  <Badge variant="destructive">Live</Badge>
) : completed ? (
  <Badge variant="outline">Final</Badge>
) : null}
```
**Frequency**: Used in 3/5 files analyzed
**Purpose**: Render UI elements based on state or props

### Data Validation Patterns

#### Comprehensive Validation Functions
```typescript
// Pattern: Return array of error messages for validation
export function validatePlayer(player: Player): string[] {
  const errors: string[] = [];
  
  if (!player.id) errors.push('Player ID is required');
  if (!player.name) errors.push('Player name is required');
  if (player.rating < 0) errors.push('Rating must be a positive number');
  
  return errors;
}
```
**Frequency**: Used in 1/5 files analyzed (but critical pattern)
**Purpose**: Centralized, testable validation logic with clear error messages

#### Test-Driven Validation
```typescript
// Pattern: Comprehensive test coverage for all validation rules
describe('validatePlayer', () => {
  it('should validate a valid player', () => {
    const player: Player = { /* valid data */ };
    const errors = validatePlayer(player);
    expect(errors).toHaveLength(0);
  });
  
  it('should reject player without ID', () => {
    const player: any = { /* missing id */ };
    const errors = validatePlayer(player);
    expect(errors).toContain('Player ID is required');
  });
});
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Ensure validation logic is correct and maintainable

### Algorithm Implementation Patterns

#### Mathematical Calculations
```python
# Pattern: Implement complex algorithms with clear variable names and comments
def expected_score(delta_R, delta=0.0):
    """E_i = 1 / (1 + 10^(-(ΔR + delta)/SIGMA))"""
    return 1.0 / (1.0 + 10.0 ** (-(delta_R + delta) / SIGMA))

def race_factor(T):
    return math.sqrt(max(T, 1.0) / T0)
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Implement rating system calculations with mathematical precision

#### Robust Data Handling
```python
# Pattern: Handle both scalar and pandas Series values safely
try:
    rating_scalar = float(rating_val)
except (TypeError, ValueError):
    try:
        if hasattr(rating_val, 'iloc'):
            rating_scalar = float(rating_val.iloc[0])
        else:
            rating_scalar = 1500.0
    except (AttributeError, IndexError, TypeError, ValueError):
        rating_scalar = 1500.0
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Handle data from CSV files that may be in different formats

### WebGL and Animation Patterns

#### Effect Cleanup
```typescript
// Pattern: Always clean up resources in useEffect return
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;
  
  // Setup WebGL, event listeners, etc.
  
  return () => {
    stopRAF();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    if (gl.canvas.parentElement === container)
      container.removeChild(gl.canvas);
  };
}, [dependencies]);
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Prevent memory leaks and ensure proper cleanup

#### Performance Optimization
```typescript
// Pattern: Use requestAnimationFrame with conditional continuation
const render = (t: number) => {
  // Render logic
  
  let continueRAF = true;
  if (NOISE_IS_ZERO) {
    const settled = Math.abs(yaw - targetYaw) < 1e-4 && ...;
    if (settled) continueRAF = false;
  }
  
  if (continueRAF) {
    raf = requestAnimationFrame(render);
  } else {
    raf = 0;
  }
};
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Stop animation loops when not needed to save CPU/battery

## Internal API Usage

### shadcn/ui Component Library
```typescript
// Pattern: Import and compose shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Usage: Compose with custom logic
<Card className={cn('w-[260px]', live && 'ring-2 ring-green-500/60')}>
  <CardHeader className="py-2">
    <CardTitle className="text-sm">Round {m.round}</CardTitle>
  </CardHeader>
  <CardContent className="py-2">
    {/* Content */}
  </CardContent>
</Card>
```
**Frequency**: Used in 2/5 files analyzed
**Purpose**: Build accessible, consistent UI with pre-built components

### Utility Functions
```typescript
// Pattern: Use cn() utility for conditional className merging
import { cn } from '@/lib/utils';

<div className={cn(
  'flex items-center gap-2 rounded-md px-2 py-1',
  highlight && 'bg-primary/10'
)} />
```
**Frequency**: Used in 2/5 files analyzed
**Purpose**: Merge Tailwind classes conditionally without conflicts

### Data Grouping and Transformation
```typescript
// Pattern: Transform flat arrays into grouped structures
function groupByRound(matches: Match[], lane: BracketLane) {
  const filtered = matches.filter((m) => m.bracket === lane);
  const rounds = new Map<number, Match[]>();
  for (const m of filtered) {
    if (!rounds.has(m.round)) rounds.set(m.round, []);
    rounds.get(m.round)!.push(m);
  }
  return Array.from(rounds.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, arr]) => arr.sort((x, y) => x.position - y.position));
}
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Organize data for display in bracket views

## Code Idioms

### Safe Property Access
```typescript
// Pattern: Use optional chaining and nullish coalescing
const name = player?.name ?? 'TBD';
const rating = player?.rating ?? 1500;
const offset = { x: offset?.x ?? 0, y: offset?.y ?? 0 };
```
**Frequency**: Used in 4/5 files analyzed
**Purpose**: Safely access nested properties without runtime errors

### Array Filtering and Mapping
```typescript
// Pattern: Chain array methods for data transformation
const table = Array.from(stats.values()).sort(
  (x, y) =>
    y.w - x.w ||
    y.frames - x.frames ||
    (y.p.rating ?? 0) - (x.p.rating ?? 0)
);
```
**Frequency**: Used in 2/5 files analyzed
**Purpose**: Transform and sort data efficiently

### Type Guards and Narrowing
```typescript
// Pattern: Check for existence before using
if (!container) return;
if (!tournamentId) return;
if (pd.isna(field_avg)) return 1.0;
```
**Frequency**: Used in 5/5 files analyzed
**Purpose**: Prevent null/undefined errors and narrow types

### Memoization
```typescript
// Pattern: Use useMemo for expensive computations
const rounds = useMemo(() => groupByRound(matches, 'winners'), [matches]);
const initial = useMemo<TournamentPayload | null>(() => {
  if (tProp && mProp) return { tournament: tProp, matches: mProp };
  return null;
}, [tProp, mProp]);
```
**Frequency**: Used in 2/5 files analyzed
**Purpose**: Optimize performance by caching computed values

## Testing Standards

### Test Structure
```typescript
// Pattern: Organize tests with describe blocks and clear test names
describe('Data Validation', () => {
  describe('validatePlayer', () => {
    it('should validate a valid player', () => { /* test */ });
    it('should reject player without ID', () => { /* test */ });
    it('should reject player with negative rating', () => { /* test */ });
  });
});
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Organize tests logically and make failures easy to identify

### Test Data
```typescript
// Pattern: Create complete test objects with all required fields
const player: Player = {
  id: 'player-1',
  name: 'John Doe',
  rating: 1500,
  ranking: 1,
  wins: 10,
  losses: 5,
  // ... all other fields
};
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Ensure tests are comprehensive and realistic

### Assertion Patterns
```typescript
// Pattern: Use specific assertions for clear test intent
expect(errors).toHaveLength(0);
expect(errors).toContain('Player ID is required');
expect(player.rating).toBeGreaterThan(0);
```
**Frequency**: Used in 1/5 files analyzed
**Purpose**: Make test failures informative and actionable

## Best Practices Summary

1. **Type Safety**: Always use TypeScript with explicit types; avoid 'any' except when necessary
2. **Component Size**: Keep components focused; extract sub-components when logic becomes complex
3. **Error Handling**: Handle errors gracefully with try-catch and provide meaningful error messages
4. **Performance**: Use memoization, lazy loading, and conditional rendering to optimize performance
5. **Accessibility**: Use semantic HTML and ARIA attributes; leverage shadcn/ui for accessible components
6. **Testing**: Write comprehensive tests for validation logic and critical business logic
7. **Documentation**: Document complex algorithms, component props, and non-obvious logic
8. **Cleanup**: Always clean up resources (event listeners, timers, subscriptions) in useEffect returns
9. **Null Safety**: Use optional chaining and nullish coalescing throughout the codebase
10. **Code Reuse**: Extract common patterns into utility functions and custom hooks
