# Data Model: Pool/Billiards Website

## Player Entity

### Description
Represents a pool/billiards player with ranking and performance statistics.

### Fields
- **id**: string (unique identifier)
- **name**: string (player's full name)
- **rating**: number (Elo-like rating based on pool_elo.py algorithm)
- **ranking**: number (current ranking from 1-100 based on rating)
- **wins**: number (total wins)
- **losses**: number (total losses)
- **winRate**: number (calculated win percentage)
- **avatarUrl**: string (URL to player's avatar image)
- **joinDate**: Date (date player joined the ranking system)
- **lastPlayed**: Date (date of last tournament/game)
- **country**: string (player's country)
- **breaks**: number (total century breaks)
- **highestBreak**: number (highest score achieved)
- **description**: string (brief bio/description)
- **matchesPlayed**: number (total matches played)
- **provisional**: boolean (true if player has played fewer than 30 matches)

### Validation Rules
- Rating must be a positive number
- Ranking must be between 1 and 100
- Wins and losses must be non-negative
- Win rate must be between 0 and 100
- Name is required
- Matches played must be non-negative

## Match Entity

### Description
Represents a pool/billiards match between two players with detailed scoring information.

### Fields
- **id**: string (unique identifier)
- **date**: Date (match date)
- **eventId**: string (reference to the tournament/event)
- **eventTier**: enum (local, regional, national, major)
- **format**: enum (alternate, winner)
- **discipline**: string (e.g., 9-ball, 10-ball)
- **ballsPerRack**: number (typical: 9, 10, 15)
- **raceTo**: number (target for the winner, e.g., 9 in race-to-9)
- **playerI**: string (reference to player I)
- **playerJ**: string (reference to player J)
- **racksI**: number (racks won by player I)
- **racksJ**: number (racks won by player J)
- **ballsI**: number (balls pocketed by player I, optional)
- **ballsJ**: number (balls pocketed by player J, optional)
- **fieldAvg**: number (event field average rating, optional)

### Validation Rules
- Date is required
- Event tier must be one of the defined enum values
- Format must be one of the defined enum values
- Race to must be a positive integer
- Racks won must be non-negative integers
- Balls pocketed must be non-negative integers (if provided)

## Tournament Entity

### Description
Represents a pool/billiards tournament with participants and results.

### Fields
- **id**: string (unique identifier)
- **name**: string (tournament name)
- **date**: Date (tournament date)
- **location**: string (tournament location)
- **prizePool**: number (total prize money)
- **tier**: enum (local, regional, national, major)
- **fieldAvgRating**: number (average rating of participants)
- **participants**: array of Player references
- **results**: array of {playerId, position, prize} objects
- **status**: enum (upcoming, ongoing, completed)
- **description**: string (tournament details)

### Validation Rules
- Name is required
- Date is required
- Status must be one of the defined enum values
- Tier must be one of the defined enum values

## User Entity

### Description
Represents a registered user of the website with personal dashboard settings.

### Fields
- **id**: string (unique identifier)
- **username**: string (unique username)
- **email**: string (user's email address)
- **displayName**: string (display name)
- **avatarUrl**: string (URL to user's avatar image)
- **favoritePlayers**: array of Player references
- **recentlyViewed**: array of {entityType, entityId, timestamp} objects
- **preferences**: object (user preferences for dashboard layout, notifications, etc.)
- **createdAt**: Date (account creation date)
- **lastLogin**: Date (last login timestamp)

### Validation Rules
- Username is required and unique
- Email is required and must be valid format
- DisplayName is required

## Relationships

### Player ↔ Tournament
- Many-to-Many: Players can participate in multiple tournaments
- Tournaments can have multiple players
- Results table represents the relationship with additional data (position, prize)

### User ↔ Player
- Many-to-Many: Users can have multiple favorite players
- Players can be favorites of multiple users

## State Transitions

### Tournament Status
- upcoming → ongoing (when tournament starts)
- ongoing → completed (when tournament ends)