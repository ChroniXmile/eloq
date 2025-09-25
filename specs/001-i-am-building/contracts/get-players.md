# GET /api/players

## Description
Retrieve the top 100 ranked players

## Request
- Method: GET
- Path: /api/players
- Query Parameters:
  - limit (optional): number - Maximum number of players to return (default: 100)
  - offset (optional): number - Number of players to skip (default: 0)

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "players": [
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
      "highestBreak": "number"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

### Error Responses
- 500 Internal Server Error: Unexpected server error