# Quickstart: Pool/Billiards Website

## Overview
This document provides a quickstart guide for using the pool/billiards website, covering the main user flows and features.

## User Flows

### 1. View Top 100 Players
1. Navigate to the landing page
2. View the top 100 ranked players in a list
3. Each player entry shows name, ranking, and key statistics
4. Click on a player to view detailed information

### 2. View Player Details
1. From the rankings list, click on any player
2. View detailed player information including:
   - Full name and ranking
   - Current Elo-like rating
   - Win/loss record and win rate
   - Career statistics
   - Recent activity
   - Brief bio/description
   - Rating history chart (if applicable)

### 3. Access User Dashboard
1. Log in to the website
2. Navigate to the dashboard page
3. View personalized information including:
   - Favorite players with current rankings
   - Recently viewed players/tournaments
   - Upcoming tournaments

### 4. View Tournaments
1. Navigate to the tournaments page
2. View list of upcoming, ongoing, and completed tournaments
3. Click on any tournament to view detailed information including:
   - Tournament name, date, and location
   - Prize pool information
   - Participant list with ratings
   - Results (for completed tournaments)

### 5. View Player Rating History
1. From the player details page, navigate to the rating history section
2. View a chart showing the player's rating progression over time
3. Click on specific data points to see details of individual matches that affected the rating
4. Filter rating history by time period or tournament tier

## Validation Steps

### Test Scenario 1: Landing Page Rankings
- **Given** a user visits the landing page
- **When** they view the rankings
- **Then** they see a list of 100 players sorted by ranking
- **And** each player entry displays name, ranking, wins, losses, and win rate

### Test Scenario 2: Player Details Page
- **Given** a user is viewing the rankings
- **When** they click on a player's name
- **Then** they are taken to the player details page
- **And** they see all relevant information about that player

### Test Scenario 3: User Dashboard Access
- **Given** a logged-in user
- **When** they navigate to the dashboard
- **Then** they see their personalized dashboard
- **And** the dashboard includes favorite players and recently viewed items

### Test Scenario 4: Tournaments Page
- **Given** a user visits the tournaments page
- **When** they view the list
- **Then** they see upcoming, ongoing, and completed tournaments
- **And** they can click on any tournament to view details