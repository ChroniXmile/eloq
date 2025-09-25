# Contract Test: GET /api/players/rating-history/{id}

## Test Setup
- Mock data service with player rating history
- API endpoint: GET /api/players/rating-history/{id}

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **And** a player with id "player-1" exists with rating history
- **When** a GET request is made to /api/players/rating-history/player-1
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - playerId property equal to "player-1"
  - playerName property with player's name
  - currentRating property with player's current rating
  - ratingHistory array with rating history objects containing date, matchId, opponent, opponentRating, ratingBefore, ratingAfter, ratingChange, event

### Test Case 2: Player Not Found
- **Given** the API is running with mock data
- **And** a player with id "non-existent" does not exist
- **When** a GET request is made to /api/players/rating-history/non-existent
- **Then** the response should have status 404