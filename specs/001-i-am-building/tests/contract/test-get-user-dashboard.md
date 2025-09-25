# Contract Test: GET /api/user/dashboard

## Test Setup
- Mock data service with user data
- API endpoint: GET /api/user/dashboard
- Authentication token required

## Test Cases

### Test Case 1: Successful Response
- **Given** the API is running with mock data
- **And** a valid authentication token is provided
- **When** a GET request is made to /api/user/dashboard
- **Then** the response should have status 200
- **And** the response should have Content-Type application/json
- **And** the response body should contain:
  - user object with id, username, displayName, avatarUrl
  - favoritePlayers array with player objects containing id, name, ranking, winRate
  - recentlyViewed array with viewed items containing entityType, entityId, name, timestamp
  - upcomingTournaments array with tournament objects containing id, name, date, location

### Test Case 2: Unauthorized Access
- **Given** the API is running with mock data
- **And** no authentication token is provided
- **When** a GET request is made to /api/user/dashboard
- **Then** the response should have status 401