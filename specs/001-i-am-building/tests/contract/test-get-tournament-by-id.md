# Contract Test: GET /api/tournaments/{id}

## Test Setup
- Mock data service with sample tournaments
- API endpoint: GET /api/tournaments/{id}

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **And** a tournament with id "tournament-1" exists
- **When** a GET request is made to /api/tournaments/tournament-1
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - id property equal to "tournament-1"
  - name, date, location, prizePool, status, description properties
  - participants array with player objects containing id, name, ranking
  - results array with result objects containing playerId, position, prize

### Test Case 2: Tournament Not Found
- **Given** the API is running with mock data
- **And** a tournament with id "non-existent" does not exist
- **When** a GET request is made to /api/tournaments/non-existent
- **Then** the response should have status 404