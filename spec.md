# Symbio - NMIMS Resource Sharing App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Mobile-first React app with 5-tab bottom navigation (Home, Borrow, Food, Study, Profile)
- Home Dashboard: Green Score widget at top + 4 clickable cards (Borrow, Food, Study, Green Score)
- Smart Borrow System: List of 10 borrowable items with name, category, status (Available/Borrowed)
- Food Rescue: List of 5 food alerts with source, quantity, time left, claim button
- Study Space Finder: List of 5 study rooms with room number, location, status (Available/Busy)
- Sustainability/Green Score: Points widget on Home + full leaderboard with 3 sample students on Profile
- NMIMS-specific mock data throughout (Vile Parle Campus, Cafeteria Block A, etc.)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend
- Store borrowable items: id, name, category, status (Available/Borrowed), owner
- Store food alerts: id, source, quantity, timeLeft, claimed
- Store study rooms: id, roomNo, location, capacity, status (Available/Busy)
- Store user profiles: id, name, department, greenPoints, avatar
- Queries: getItems, getFoodAlerts, getStudyRooms, getLeaderboard, getUserProfile
- Updates: claimItem, claimFood, bookRoom, updateGreenPoints

### Frontend
- App shell with bottom navigation bar (5 tabs, active state, icons)
- Home screen: GreenScoreWidget component + 4 QuickAccessCard components linking to tabs
- BorrowScreen: item card list with status badge, category tag, borrow button
- FoodScreen: food alert card list with urgency indicator, quantity, time, claim button
- StudyScreen: room card list with availability badge, capacity, book button
- ProfileScreen: user info card, green score display, leaderboard table
- Eco-friendly color palette: primary green #10B981, secondary blue #3B82F6, neutral white/gray backgrounds
- Inter/system-ui font, card-based layout, fully mobile-responsive (max-width 480px centered)
