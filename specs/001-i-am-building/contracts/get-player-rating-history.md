# GET /api/players/rating-history/{id}

## Description
Retrieve rating history for a specific player

## Request
- Method: GET
- Path: /api/players/rating-history/{id}
- Path Parameters:
  - id: string - Player's unique identifier

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "playerId": "string",
  "playerName": "string",
  "currentRating": "number",
  "ratingHistory": [
    {
      "date": "string (ISO 8601)",
      "matchId": "string",
      "opponent": "string",
      "opponentRating": "number",
      "ratingBefore": "number",
      "ratingAfter": "number",
      "ratingChange": "number",
      "event": "string"
    }
  ]
}
```

### Error Responses
- 404 Not Found: Player with specified ID not found
- 500 Internal Server Error: Unexpected server error