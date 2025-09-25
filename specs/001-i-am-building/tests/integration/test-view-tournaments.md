# Integration Test: View Tournaments

## Test Setup
- Mock data service with tournament data
- Tournaments page component
- Navigation system

## Test Cases

### Test Case 1: Successful Display of Tournaments
- **Given** a user visits the tournaments page
- **When** the page loads
- **Then** the user should see a list of tournaments
- **And** each tournament entry should display name, date, location, and status
- **And** tournaments should be categorized by status (upcoming, ongoing, completed)

### Test Case 2: Tournament Details Navigation
- **Given** a user is viewing the tournaments list
- **When** they click on a tournament name
- **Then** they should be navigated to the tournament details page
- **And** the URL should change to /tournaments/{tournament-id}
- **And** the tournament details page should display information for the correct tournament