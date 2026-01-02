# First 20 Errors to Fix (84 Total)

## BATCH 1: advancedSearch.ts (13 errors)

### Error 1: Line 56 - Property 'bpm' does not exist
**Current:** `where(eq(tracks.bpm, filters.bpm))`
**Fix:** Remove this line - BPM field doesn't exist in schema

### Error 2: Line 70 - Property 'artist' does not exist
**Current:** `where(eq(tracks.artist, filters.artist))`
**Fix:** Change to `where(eq(tracks.artistId, filters.artist))`

### Error 3: Line 77 - Property 'album' does not exist
**Current:** `where(eq(tracks.album, filters.album))`
**Fix:** Change to `where(eq(tracks.albumId, filters.album))`

### Errors 4-13: Lines 83, 89, 92, 95, 98, 101, 128, 129, 154
**Issue:** Query builder type mismatches after fixing above
**Fix:** Will resolve automatically once lines 56, 70, 77 are fixed

---

## BATCH 2: songPurchase.ts (12 errors)

### Errors 1-12: Lines 194, 199 (repeated)
**Issue:** Property 'songPurchases' and 'albumPurchases' don't exist on type '{}'
**Root Cause:** getDb() is not properly typed
**Fix:** Import getDb from db.ts and ensure it returns typed database instance

**Action:**
```typescript
// Change from:
import { db } from '../db';
const getDb = () => { if (!db) throw new Error(...); return db as any; };

// To:
import { getDb } from '../db';
// Use getDb() directly - it's already properly typed
```

---

## BATCH 3: trendingDashboard.ts (9 errors)

### Errors 1-9: Lines 50-92
**Issue:** Type mismatches in aggregation queries
**Fix:** Review query builder syntax and ensure all methods are valid Drizzle ORM

---

## BATCH 4: socialSharingService.ts (8 errors)

### Errors 1-8: Lines 57-135
**Issue:** Type mismatches in database operations
**Fix:** Review and fix database query syntax

---

## BATCH 5: genreFilter.ts (6 errors)

### Error 1: Line 47 - Property 'artist' does not exist
**Fix:** Change `tracks.artist` to `tracks.artistId`

### Error 2: Line 48 - Property 'album' does not exist
**Fix:** Change `tracks.album` to `tracks.albumId`

### Error 3: Line 54 - Property 'album' does not exist
**Fix:** Change `tracks.album` to `tracks.albumId`

### Error 4: Line 92 - Property 'album' does not exist
**Fix:** Change `tracks.album` to `tracks.albumId`

### Errors 5-6: Lines 98, 99 - 'input.searchTerm' is possibly 'undefined'
**Fix:** Add null check: `if (!input.searchTerm) return [];`

---

## Summary of First 20 Fixes

1. **advancedSearch.ts** - Remove BPM references, fix artist/album to artistId/albumId
2. **songPurchase.ts** - Fix getDb() import and typing
3. **trendingDashboard.ts** - Review query syntax
4. **socialSharingService.ts** - Review query syntax
5. **genreFilter.ts** - Fix artist/album references, add null checks

**Expected Result:** Down to ~64 errors
