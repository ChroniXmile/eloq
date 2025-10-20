# Product Requirements Document: ELOQ

**Version:** 1.0  
**Last Updated:** 2025  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Overview
ELOQ is a modern pool/billiards score tracking and ranking platform that implements a sophisticated Elo-like rating system specifically designed for professional pool players. The platform provides comprehensive tournament management, detailed player statistics, and real-time ranking updates with transparent rating calculations.

### 1.2 Problem Statement
Current pool/billiards ranking systems lack:
- Accurate rating algorithms that account for match nuances (rack-share, race length, event strength)
- Transparent rating calculations that players can understand and verify
- Real-time tournament tracking and live updates
- Comprehensive player analytics and historical performance data
- Modern, accessible user interfaces

### 1.3 Solution
ELOQ delivers a specialized rating system adapted for pool/billiards that considers rack-share scoring, race length scaling, event tier multipliers, and field strength adjustments. The platform combines this with a modern web application providing tournament management, player profiles, and real-time updates.

### 1.4 Success Metrics
- Player adoption rate and active user engagement
- Tournament organizer usage and event creation rate
- Rating calculation accuracy and player satisfaction
- Platform performance (page load times, real-time update latency)
- Accessibility compliance (WCAG 2.1 AA)

---

## 2. Target Users

### 2.1 Primary User Personas

#### Professional Pool Players
- **Needs:** Track personal ratings, view rankings, analyze performance trends
- **Goals:** Understand rating changes, compare with peers, improve performance
- **Pain Points:** Opaque rating systems, lack of detailed statistics

#### Tournament Organizers
- **Needs:** Manage events, record results, maintain accurate player ratings
- **Goals:** Streamline tournament administration, provide fair rankings
- **Pain Points:** Manual result tracking, complex rating calculations

#### Pool Enthusiasts
- **Needs:** Follow professional players, view rankings, track tournament results
- **Goals:** Stay informed about the competitive scene
- **Pain Points:** Fragmented information sources, outdated rankings

---

## 3. Core Features

### 3.1 Rating System

#### 3.1.1 Elo-like Algorithm
**Priority:** Critical  
**Status:** Implemented (Python reference)

**Requirements:**
- Rack-share scoring as primary observed score metric
- Race length scaling factor: `sqrt(max(T, 1) / T0)` where T is race length
- Event tier multipliers:
  - Local: 1.0x
  - Regional: 1.2x
  - National: 1.5x
  - Major: 2.0x
- Format offset for winner-break vs alternate-break
- Logarithmic margin dampening to prevent rating inflation
- Uncertainty-aware K-factors:
  - Provisional (< 20 matches): K = 80
  - Established (20-100 matches): K = 40
  - Elite (> 100 matches): K = 20
- Field strength adjustment based on average event rating
- Optional balls-made micro-scoring blending

**Acceptance Criteria:**
- Rating calculations match Python reference implementation
- All rating changes are auditable and explainable
- System handles edge cases (forfeits, incomplete matches)
- Performance: Calculate ratings for 1000+ matches in < 5 seconds

#### 3.1.2 Rating Transparency
**Priority:** High  
**Status:** Required

**Requirements:**
- Display detailed rating change breakdown for each match
- Show contributing factors (K-factor, expected score, race factor, event multiplier)
- Provide rating history visualization with timeline
- Export rating calculation details

**Acceptance Criteria:**
- Users can view step-by-step rating calculation
- Rating changes include all contributing factors
- Historical rating data accessible for all matches

### 3.2 Player Management

#### 3.2.1 Player Rankings
**Priority:** Critical  
**Status:** In Development

**Requirements:**
- Display top 100 players ranked by Elo rating
- Real-time ranking updates after match results
- Filtering by discipline (9-ball, 10-ball, etc.)
- Search and filter capabilities
- Pagination for large datasets

**Acceptance Criteria:**
- Rankings update within 1 second of match result entry
- Support 10,000+ players without performance degradation
- Mobile-responsive table/list view

#### 3.2.2 Player Profiles
**Priority:** High  
**Status:** In Development

**Requirements:**
- Detailed player information (name, rating, ranking, avatar)
- Performance statistics (wins, losses, win rate, average rack-share)
- Rating history chart with interactive timeline
- Match history with detailed results
- Head-to-head comparison tool
- Tournament participation history

**Acceptance Criteria:**
- Profile loads in < 2 seconds
- Charts render smoothly with 100+ data points
- All statistics accurate and up-to-date

#### 3.2.3 User Authentication
**Priority:** Critical  
**Status:** Implemented (Clerk)

**Requirements:**
- User registration and login via Clerk
- Email/password and social authentication
- Session management and security
- User profile management
- Role-based access (player, organizer, admin)

**Acceptance Criteria:**
- Secure authentication flow
- Session persistence across devices
- Password reset functionality
- GDPR-compliant data handling

### 3.3 Tournament Management

#### 3.3.1 Tournament Creation
**Priority:** High  
**Status:** In Development

**Requirements:**
- Create tournaments with metadata (name, date, location, discipline)
- Set event tier (local, regional, national, major)
- Define format (alternate break, winner break)
- Set race length
- Add participants from player database
- Generate brackets (single elimination, double elimination, round robin)

**Acceptance Criteria:**
- Tournament creation wizard with validation
- Support 4-128 player brackets
- Bracket generation in < 3 seconds

#### 3.3.2 Match Result Entry
**Priority:** Critical  
**Status:** In Development

**Requirements:**
- Record match results (winner, loser, score)
- Enter rack-share data
- Optional balls-made micro-scoring
- Validate data entry (score consistency, player eligibility)
- Support bulk result import (CSV)
- Edit/delete results with audit trail

**Acceptance Criteria:**
- Result entry form with real-time validation
- Bulk import processes 100+ matches in < 10 seconds
- All changes logged for audit

#### 3.3.3 Live Tournament Tracking
**Priority:** Medium  
**Status:** Planned

**Requirements:**
- Real-time match updates via WebSocket
- Live bracket visualization with current matches highlighted
- Push notifications for match completions
- Live leaderboard updates
- Spectator view mode

**Acceptance Criteria:**
- Updates propagate to all clients within 1 second
- Support 100+ concurrent viewers per tournament
- Graceful degradation if WebSocket unavailable

#### 3.3.4 Bracket Visualization
**Priority:** High  
**Status:** In Development

**Requirements:**
- Interactive bracket display (single/double elimination)
- Round robin standings table
- Match cards with player info and scores
- Highlight completed vs pending matches
- Responsive layout for mobile/desktop
- Print-friendly view

**Acceptance Criteria:**
- Brackets render correctly for all tournament sizes
- Interactive elements accessible via keyboard
- Print layout maintains readability

### 3.4 User Dashboard

#### 3.4.1 Personalized Dashboard
**Priority:** Medium  
**Status:** Planned

**Requirements:**
- Overview of user's rating and ranking
- Recent match results
- Upcoming tournaments
- Performance trends and insights
- Notifications and alerts

**Acceptance Criteria:**
- Dashboard loads in < 2 seconds
- Personalized content based on user activity
- Responsive design for all devices

---

## 4. Technical Requirements

### 4.1 Architecture

#### 4.1.1 Frontend
- Next.js 15.5.3 with App Router and Turbopack
- React 19.1.0 with TypeScript 5
- Server components for performance optimization
- Client components for interactivity
- Component-based architecture with composition patterns

#### 4.1.2 Backend
- Next.js API routes for server-side logic
- Service layer pattern for business logic separation
- PostgreSQL database with pg driver
- Python 3 rating engine for calculations

#### 4.1.3 Styling & UI
- Tailwind CSS 4 for utility-first styling
- shadcn/ui component library for consistency
- Radix UI primitives for accessibility
- Dark/light theme support via next-themes
- Responsive mobile-first design

### 4.2 Performance Requirements

- **Page Load Time:** < 2 seconds for initial load
- **Time to Interactive:** < 3 seconds
- **API Response Time:** < 500ms for 95th percentile
- **Real-time Updates:** < 1 second latency
- **Database Queries:** < 100ms for common queries
- **Concurrent Users:** Support 1,000+ simultaneous users

### 4.3 Accessibility Requirements

- **WCAG 2.1 AA Compliance:** All pages and components
- **Keyboard Navigation:** Full functionality without mouse
- **Screen Reader Support:** Semantic HTML and ARIA labels
- **Color Contrast:** Minimum 4.5:1 for normal text
- **Focus Indicators:** Visible focus states for all interactive elements
- **Responsive Text:** Support browser zoom up to 200%

### 4.4 Security Requirements

- **Authentication:** Clerk-managed secure authentication
- **Authorization:** Role-based access control
- **Data Encryption:** HTTPS for all communications
- **Input Validation:** Server-side validation for all inputs
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Content sanitization
- **CSRF Protection:** Token-based protection

### 4.5 Data Requirements

#### 4.5.1 Data Models
- **Player:** id, name, rating, ranking, wins, losses, match_count, avatar_url
- **Match:** id, tournament_id, player_a_id, player_b_id, winner_id, score_a, score_b, rack_share_a, rack_share_b, balls_made_a, balls_made_b, rating_change_a, rating_change_b
- **Tournament:** id, name, date, location, discipline, tier, format, race_length, status
- **User:** id, clerk_id, player_id, email, role, created_at

#### 4.5.2 Data Integrity
- Foreign key constraints for referential integrity
- Unique constraints on player names and user emails
- Check constraints for valid rating ranges
- Audit logging for all data modifications

### 4.6 Testing Requirements

- **Unit Tests:** 80%+ code coverage for business logic
- **Integration Tests:** API endpoints and database interactions
- **Contract Tests:** API contract validation
- **E2E Tests:** Critical user flows
- **Accessibility Tests:** Automated WCAG compliance checks
- **Performance Tests:** Load testing for concurrent users

---

## 5. User Experience Requirements

### 5.1 Design Principles

- **Clarity:** Information presented clearly without clutter
- **Consistency:** Uniform design patterns across platform
- **Feedback:** Immediate feedback for user actions
- **Efficiency:** Minimize clicks to complete tasks
- **Accessibility:** Inclusive design for all users

### 5.2 Responsive Design

- **Mobile (< 768px):** Single column layout, touch-optimized controls
- **Tablet (768px - 1024px):** Adaptive layout with collapsible sidebars
- **Desktop (> 1024px):** Multi-column layout with full feature set

### 5.3 Navigation

- **Primary Navigation:** Home, Rankings, Tournaments, Players, Profile
- **Breadcrumbs:** Show current location in hierarchy
- **Search:** Global search for players and tournaments
- **Quick Actions:** Contextual actions based on user role

---

## 6. Integration Requirements

### 6.1 External Services

#### 6.1.1 Clerk Authentication
- User registration and login
- Session management
- Profile management
- Webhook integration for user events

#### 6.1.2 PostgreSQL Database
- Primary data storage
- Connection pooling for performance
- Backup and recovery procedures
- Migration management

#### 6.1.3 Python Rating Engine
- Standalone pool_elo.py script
- CSV-based data exchange
- Batch rating calculations
- Validation against reference implementation

### 6.2 API Design

- **RESTful Endpoints:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Format:** Request and response bodies
- **Error Handling:** Consistent error response format
- **Versioning:** API version in URL path
- **Rate Limiting:** Prevent abuse and ensure fair usage

---

## 7. Deployment & Operations

### 7.1 Deployment Requirements

- **Hosting:** Vercel or similar Next.js-optimized platform
- **Database:** Managed PostgreSQL (AWS RDS, Supabase, etc.)
- **CDN:** Static asset delivery via CDN
- **SSL/TLS:** HTTPS for all traffic
- **Environment Variables:** Secure configuration management

### 7.2 Monitoring & Logging

- **Application Monitoring:** Error tracking and performance monitoring
- **Database Monitoring:** Query performance and connection pooling
- **User Analytics:** Usage patterns and feature adoption
- **Audit Logging:** Security-relevant events and data changes

### 7.3 Backup & Recovery

- **Database Backups:** Daily automated backups with 30-day retention
- **Point-in-Time Recovery:** Ability to restore to specific timestamp
- **Disaster Recovery Plan:** Documented recovery procedures
- **Data Export:** User data export functionality

---

## 8. Constraints & Assumptions

### 8.1 Technical Constraints

- WCAG 2.1 AA accessibility compliance mandatory
- Mobile-first responsive design required
- Real-time updates for live tournaments
- Transparent rating calculations (users must understand changes)
- Performance optimization (memoization, lazy loading, conditional rendering)

### 8.2 Business Constraints

- Initial launch targets professional pool community
- Rating system must maintain compatibility with Python reference
- Platform must support multiple pool disciplines
- Free tier for players, potential premium features for organizers

### 8.3 Assumptions

- Users have modern browsers (last 2 versions)
- Stable internet connection for real-time features
- Tournament organizers have basic technical literacy
- Players are familiar with Elo-like rating concepts

---

## 9. Future Enhancements

### 9.1 Phase 2 Features

- **Mobile Apps:** Native iOS and Android applications
- **Video Integration:** Match video uploads and playback
- **Social Features:** Player following, comments, discussions
- **Advanced Analytics:** Predictive modeling, performance insights
- **Multi-language Support:** Internationalization (i18n)

### 9.2 Phase 3 Features

- **Live Streaming Integration:** Embed live match streams
- **Betting Integration:** Odds and predictions (where legal)
- **Sponsorship Management:** Sponsor profiles and advertising
- **API for Third Parties:** Public API for external integrations
- **Machine Learning:** Shot analysis and performance prediction

---

## 10. Appendices

### 10.1 Glossary

- **Rack-share:** Proportion of racks won in a match (primary scoring metric)
- **Race length:** Number of racks needed to win (e.g., race to 7)
- **K-factor:** Rating volatility parameter based on player experience
- **Event tier:** Tournament classification (local, regional, national, major)
- **Field strength:** Average rating of tournament participants
- **Margin dampening:** Logarithmic adjustment to prevent rating inflation

### 10.2 References

- pool_rating_spec.md - Detailed rating system specification
- .amazonq/rules/memory-bank/ - Development guidelines and patterns
- eloq-webapp/openspec/project.md - Project context and conventions

### 10.3 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025 | System | Initial PRD creation |

---

**Document Owner:** ELOQ Development Team  
**Stakeholders:** Professional Pool Players, Tournament Organizers, Pool Enthusiasts  
**Review Cycle:** Quarterly or as needed for major feature additions
