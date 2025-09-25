# Contract Test: GET /api/players/{id}

## Test Setup
- Mock data service with 100 players
- API endpoint: GET /api/players/{id}

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **And** a player with id "player-1" exists
- **When** a GET request is made to /api/players/player-1
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - id property equal to "player-1"
  - name property with player's name
  - ranking property with player's ranking
  - wins, losses, winRate properties with player's statistics
  - avatarUrl property with player's avatar URL
  - joinDate and lastPlayed properties with valid dates
  - country, breaks, highestBreak properties with player's information
  - description property with player's bio

### Test Case 2: Player Not Found
- **Given** the API is running with mock data
- **And** a player with id "non-existent" does not exist
- **When** a GET request is made to /api/players/non-existent
- **Then** the response should have status 404