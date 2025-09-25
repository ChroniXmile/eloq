# GET /api/players/{id}

## Description
Retrieve detailed information for a specific player

## Request
- Method: GET
- Path: /api/players/{id}
- Path Parameters:
  - id: string - Player's unique identifier

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "id": "string",
  "name": "string",
  "ranking": "number",
  "wins": "number",
  "losses": "number",
  "winRate": "number",
  "avatarUrl": "string",
  "joinDate": "string (ISO 8601)",
  "lastPlayed": "string (ISO 8601)",
  "country": "string",
  "breaks": "number",
  "highestBreak": "number",
  "description": "string"
}
```

### Error Responses
- 404 Not Found: Player with specified ID not found
- 500 Internal Server Error: Unexpected server error