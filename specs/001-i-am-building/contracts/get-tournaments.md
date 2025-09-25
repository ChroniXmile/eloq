# GET /api/tournaments

## Description
Retrieve list of tournaments

## Request
- Method: GET
- Path: /api/tournaments
- Query Parameters:
  - status (optional): enum - Filter by tournament status (upcoming, ongoing, completed)
  - limit (optional): number - Maximum number of tournaments to return (default: 50)
  - offset (optional): number - Number of tournaments to skip (default: 0)

## Response
- Status: 200 OK
- Content-Type: application/json

### Success Response Body
```json
{
  "tournaments": [
    {
      "id": "string",
      "name": "string",
      "date": "string (ISO 8601)",
      "location": "string",
      "prizePool": "number",
      "status": "string",
      "participantCount": "number"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

### Error Responses
- 500 Internal Server Error: Unexpected server error