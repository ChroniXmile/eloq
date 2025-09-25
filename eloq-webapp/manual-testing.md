# Manual Testing Guide

This document outlines the manual testing procedures to verify the ELOQ website functionality according to the quickstart scenarios.

## Test Environment

- Browser: Latest Chrome, Firefox, Safari, and Edge
- Device: Desktop, tablet, and mobile
- Network: WiFi and cellular (3G simulation)
- Screen readers: NVDA, VoiceOver, JAWS

## Quickstart Scenarios

### Scenario 1: View Top 100 Players Ranking

**Preconditions:**
- Website is accessible
- Database contains 100 players with ratings

**Steps:**
1. Navigate to the landing page (http://localhost:3000)
2. Observe the player ranking list
3. Verify that exactly 100 players are displayed
4. Check that players are sorted by ranking (1 to 100)
5. Verify that each player entry displays:
   - Name
   - Ranking (with # prefix)
   - Wins
   - Losses
   - Win rate (with % suffix)
6. Resize browser window to verify responsive design
7. Test keyboard navigation through the list

**Expected Results:**
- 100 players displayed in ranking order
- All required information visible for each player
- Responsive design adapts to screen size
- Keyboard navigation works correctly

### Scenario 2: View Player Details Page

**Preconditions:**
- On the landing page with player rankings

**Steps:**
1. Click on any player's name in the rankings list
2. Observe the player details page
3. Verify that the page displays:
   - Player's full name
   - Current ranking
   - Current Elo-like rating
   - Win/loss record
   - Win rate
   - Career statistics
   - Recent activity
   - Brief bio/description
   - Rating history chart (if applicable)
4. Test the back button to return to rankings
5. Verify that the browser back button works correctly

**Expected Results:**
- Player details page loads correctly
- All player information displayed accurately
- Navigation between pages works correctly
- Rating history chart displays if data available

### Scenario 3: Access User Dashboard

**Preconditions:**
- User account exists (mock login)
- User has favorite players

**Steps:**
1. Navigate to the dashboard page (http://localhost:3000/dashboard)
2. Observe the dashboard layout
3. Verify that the dashboard displays:
   - User's display name
   - Favorite players with current rankings
   - Recently viewed players/tournaments
   - Upcoming tournaments
4. Click on a favorite player to navigate to their details page
5. Use the browser back button to return to the dashboard
6. Verify that the recently viewed section updates correctly

**Expected Results:**
- Dashboard loads with personalized information
- All dashboard sections display correctly
- Navigation to linked pages works correctly
- Recently viewed items update appropriately

### Scenario 4: View Tournaments List

**Preconditions:**
- Website is accessible
- Database contains tournaments

**Steps:**
1. Navigate to the tournaments page (http://localhost:3000/tournaments)
2. Observe the tournaments list
3. Verify that tournaments are grouped by status:
   - Upcoming
   - Ongoing
   - Completed
4. Check that each tournament entry displays:
   - Name
   - Date
   - Location
   - Prize pool
   - Tier
   - Participant count (for upcoming/ongoing)
   - Results count (for completed)
5. Click on any tournament to view details
6. Use the browser back button to return to the list

**Expected Results:**
- Tournaments displayed grouped by status
- All required information visible for each tournament
- Navigation to tournament details works correctly

### Scenario 5: View Player Rating History

**Preconditions:**
- On a player details page
- Player has match history

**Steps:**
1. Navigate to a player details page
2. Locate the rating history section
3. Observe the rating history chart
4. Verify that the chart displays:
   - Rating progression over time
   - Data points for individual matches
5. Click on specific data points
6. Verify that match details are displayed
7. Test filtering by time period or tournament tier

**Expected Results:**
- Rating history chart displays correctly
- Data points represent actual match history
- Clicking data points shows match details
- Filtering works as expected

## Accessibility Testing

### Screen Reader Testing

1. Enable screen reader (NVDA, VoiceOver, or JAWS)
2. Navigate through all pages using keyboard only
3. Verify that all interactive elements are announced
4. Check that headings are properly structured
5. Test form inputs and validation messages
6. Verify that charts and complex content have alternative descriptions

### Keyboard Navigation

1. Disable mouse and navigate using keyboard only
2. Verify that all interactive elements are reachable
3. Check that focus indicators are visible
4. Test tab order is logical
5. Verify that all functionality is accessible via keyboard

### High Contrast Mode

1. Enable Windows High Contrast Mode or macOS Increase Contrast
2. Verify that all content remains visible
3. Check that focus indicators are distinguishable
4. Verify that charts and graphics remain understandable

## Performance Testing

### Page Load Times

1. Open browser developer tools
2. Navigate to each main page
3. Record load times from Network tab
4. Verify that page loads are under 200ms for static content
5. Check First Contentful Paint under 1.5s on 3G networks

### Responsiveness

1. Interact with UI elements
2. Verify that there are no delays or freezes
3. Test scrolling performance on long lists
4. Check animation smoothness

## Cross-Browser Testing

### Chrome

1. Test all scenarios on latest Chrome
2. Verify layout and functionality
3. Check console for errors

### Firefox

1. Test all scenarios on latest Firefox
2. Verify layout and functionality
3. Check console for errors

### Safari

1. Test all scenarios on latest Safari
2. Verify layout and functionality
3. Check console for errors

### Edge

1. Test all scenarios on latest Edge
2. Verify layout and functionality
3. Check console for errors

## Mobile Testing

### iOS Safari

1. Test all scenarios on iPhone/iPad
2. Verify touch interactions work correctly
3. Check orientation changes
4. Test offline functionality if applicable

### Android Chrome

1. Test all scenarios on Android device
2. Verify touch interactions work correctly
3. Check orientation changes
4. Test offline functionality if applicable

## Error Handling

### Network Errors

1. Disconnect network while loading page
2. Verify that appropriate error messages are displayed
3. Check that retry mechanism works

### Server Errors

1. Simulate server errors (500, 404, etc.)
2. Verify that user-friendly error messages are displayed
3. Check that users can recover from errors

## Security Testing

### Input Validation

1. Test form inputs with malicious data
2. Verify that input validation prevents attacks
3. Check that error messages don't expose sensitive information

### Authentication

1. Test login with valid credentials
2. Test login with invalid credentials
3. Verify that sessions are handled securely
4. Check that logout functionality works correctly

## Test Completion Checklist

### Functional Tests
- [ ] Scenario 1: View Top 100 Players Ranking
- [ ] Scenario 2: View Player Details Page
- [ ] Scenario 3: Access User Dashboard
- [ ] Scenario 4: View Tournaments List
- [ ] Scenario 5: View Player Rating History

### Accessibility Tests
- [ ] Screen Reader Testing
- [ ] Keyboard Navigation
- [ ] High Contrast Mode

### Performance Tests
- [ ] Page Load Times
- [ ] Responsiveness

### Cross-Browser Tests
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Tests
- [ ] iOS Safari
- [ ] Android Chrome

### Error Handling Tests
- [ ] Network Errors
- [ ] Server Errors

### Security Tests
- [ ] Input Validation
- [ ] Authentication

## Test Results

Document any issues found during testing in the GitHub Issues tracker with the following information:

1. **Issue Title**: Brief description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Expected Result**: What should happen
4. **Actual Result**: What actually happened
5. **Environment**: Browser, device, OS versions
6. **Screenshots**: If applicable
7. **Severity**: Low, Medium, High, Critical

## Sign-off

Once all tests are completed and issues are resolved, the following stakeholders should sign off:

- [ ] Lead Developer
- [ ] QA Engineer
- [ ] Product Owner
- [ ] Accessibility Specialist

Date: _________

This concludes the manual testing procedures for the ELOQ website.