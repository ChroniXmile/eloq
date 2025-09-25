# Contract Test: GET /api/tournaments

## Test Setup
- Mock data service with sample tournaments
- API endpoint: GET /api/tournaments

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **When** a GET request is made to /api/tournaments
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - tournaments array with tournament objects
  - each tournament object should have id, name, date, location, prizePool, status, participantCount
  - total property with total number of tournaments
  - limit property equal to 50 (default)
  - offset property equal to 0 (default)

### Test Case 2: Filter by Status
- **Given** the API is running with mock data including tournaments with different statuses
- **When** a GET request is made to /api/tournaments?status=upcoming
- **Then** the response should have status 200
- **And** the response body should contain only upcoming tournaments