# Symbio - NMIMS Resource Sharing

## Current State
- 6-tab app (Home, Borrow, Food, Study, Profile, Requests) with full interactive logic
- App.tsx holds shared state: `greenPoints` (320 default), `borrowedCount` (45), `foodClaimedCount` (23), `borrowItems` array
- ProfileScreen receives: `greenPoints`, `borrowItems`, `onReturnItem`
- ProfileScreen currently shows: Profile card with level/progress, My Borrowed Items section with Return buttons, Points Breakdown, Leaderboard, Achievement Badges
- `handleReturnItem` in App.tsx decrements `borrowedCount` when an item is returned
- No session-level return counter exists yet

## Requested Changes (Diff)

### Add
- `returnCount` state in App.tsx (integer, starts at 2 to match mock pre-set of 2 pre-borrowed items being returnable) -- incremented by `handleReturnItem`, never decremented
- Impact Card component at the TOP of ProfileScreen (above the existing Profile Card), styled as a green achievement badge showing:
  - Green Score (from `greenPoints`)
  - Items Borrowed (derived from `borrowedCount`)
  - Food Claimed (derived from `foodClaimedCount`)
  - Items Returned (from new `returnCount` prop, pre-filled to 2 for mock)
- "Share My Impact" button inside the Impact Card that:
  - Copies text to clipboard: `"I've saved X kg CO2 on Symbio! 🌱 Green Score: Y pts | Items Borrowed: A | Food Claimed: B | Items Returned: C — #Symbio #NMIMS"`
  - Shows toast: "Impact card copied to clipboard!"
  - CO2 formula: `(borrowedCount × 0.5) + (foodClaimedCount × 0.3)` rounded to 1 decimal
- Pass `returnCount` and `foodClaimedCount` and `borrowedCount` as new props to ProfileScreen

### Modify
- `handleReturnItem` in App.tsx: also increment `returnCount` on each return
- ProfileScreen props interface: add `returnCount: number`, `borrowedCount: number`, `foodClaimedCount: number`
- Mock data baseline in App.tsx: `returnCount` starts at 2 (matches 2 pre-set borrowed items)

### Remove
- Nothing removed

## Implementation Plan
1. Add `returnCount` state (initial: 2) to App.tsx
2. Update `handleReturnItem` in App.tsx to also call `setReturnCount(prev => prev + 1)`
3. Pass `returnCount`, `borrowedCount`, `foodClaimedCount` as new props to `<ProfileScreen />`
4. Update `ProfileScreenProps` interface in ProfileScreen.tsx to accept new props
5. Build the Impact Card UI at top of ProfileScreen:
   - Gradient green card (bg-emerald-500 or similar), badge/achievement aesthetic
   - 4 stat tiles: Green Score (Leaf icon), Items Borrowed (Package icon), Food Claimed (Utensils icon), Items Returned (RotateCcw icon)
   - Pre-filled with 150 Green Points mock appearance -- actual values come from live props
   - "Share My Impact" button at bottom of card
6. Implement share logic: compute CO2, build text string, copy to clipboard via `navigator.clipboard.writeText`, show toast "Impact card copied to clipboard!"
7. Apply deterministic data-ocid markers to Impact Card and Share button
8. Ensure card values update live when Borrow/Food/Return actions are taken
