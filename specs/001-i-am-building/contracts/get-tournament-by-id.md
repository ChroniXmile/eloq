# GET /api/tournaments/{id}

## Description
Retrieve detailed information for a specific tournament

## Request
- Method: GET
- Path: /api/tournaments/{id}
- Path Parameters:
  - id: string - Tournament's unique identifier

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "id": "string",
  "name": "string",
  "date": "string (ISO 8601)",
  "location": "string",
  "prizePool": "number",
  "status": "string",
  "description": "string",
  "participants": [
    {
      "id": "string",
      "name": "string",
      "ranking": "number"
    }
  ],
  "results": [
    {
      "playerId": "string",
      "position": "number",
      "prize": "number"
    }
  ]
}
```

### Error Responses
- 404 Not Found: Tournament with specified ID not found
- 500 Internal Server Error: Unexpected server error