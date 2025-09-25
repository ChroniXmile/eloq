# Contract Test: GET /api/players

## Test Setup
- Mock data service with 100 players
- API endpoint: GET /api/players

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **When** a GET request is made to /api/players
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - players array with 100 player objects
  - each player object should have id, name, ranking, wins, losses, winRate, avatarUrl, joinDate, lastPlayed, country, breaks, highestBreak
  - total property equal to 100
  - limit property equal to 100
  - offset property equal to 0

### Test Case 2: Limited Response
- **Given** the API is running with mock data
- **When** a GET request is made to /api/players?limit=10
- **Then** the response should have status 200
- **And** the response body should contain:
  - players array with 10 player objects
  - total property equal to 100
  - limit property equal to 10
  - offset property equal to 0

### Test Case 3: Offset Response
- **Given** the API is running with mock data
- **When** a GET request is made to /api/players?offset=50
- **Then** the response should have status 200
- **And** the response body should contain:
  - players array with 50 player objects (players 51-100)
  - total property equal to 100
  - limit property equal to 100
  - offset property equal to 50