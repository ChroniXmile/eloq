# GET /api/user/dashboard

## Description
Retrieve personalized dashboard information for the authenticated user

## Request
- Method: GET
- Path: /api/user/dashboard
- Headers:
  - Authorization: Bearer {token} - User authentication token

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "displayName": "string",
    "avatarUrl": "string"
  },
  "favoritePlayers": [
    {
      "id": "string",
      "name": "string",
      "ranking": "number",
      "winRate": "number"
    }
  ],
  "recentlyViewed": [
    {
      "entityType": "string",
      "entityId": "string",
      "name": "string",
      "timestamp": "string (ISO 8601)"
    }
  ],
  "upcomingTournaments": [
    {
      "id": "string",
      "name": "string",
      "date": "string (ISO 8601)",
      "location": "string"
    }
  ]
}
```

### Error Responses
- 401 Unauthorized: Missing or invalid authentication token
- 500 Internal Server Error: Unexpected server error