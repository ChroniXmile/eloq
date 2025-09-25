# Integration Test: View Top 100 Players

## Test Setup
- Mock data service with 100 players
- Landing page with rankings list component
- Navigation system

## Test Cases

### Test Case 1: Successful Display of Rankings
- **Given** a user visits the landing page
- **When** the page loads
- **Then** the user should see a list of 100 players
- **And** each player entry should display name, ranking, wins, losses, and win rate
- **And** players should be sorted by ranking (1 to 100)

### Test Case 2: Player Navigation
- **Given** a user is viewing the rankings list
- **When** they click on a player's name
- **Then** they should be navigated to the player details page
- **And** the URL should change to /players/{player-id}
- **And** the player details page should display information for the correct player