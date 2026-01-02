# TypeScript Errors - Fixes Needed (117 Total)

## Priority 1: advancedFeatures.ts (27 errors)
**Issue:** z.object() input validation expects string IDs but receiving numbers

**Errors:**
- Lines 22, 28, 32, 36, 47, 58, 65, 69, 73, 83, 92, 96, 100, 104, 113, 139, 145, 154, 158, 173, 177, 181, 185, 206, 221, 233, 245
- **Fix:** Change all `.input(z.object({ ... }))` to accept string IDs, then convert to numbers in the procedure handler

**Action:** Convert all numeric IDs to strings in z.object validation

---

## Priority 2: advancedSearch.ts (13 errors)
**Issue:** BPM field doesn't exist in tracks table schema

**Errors:**
- Line 56: Property 'bpm' does not exist
- Line 70: Property 'bpm' does not exist  
- Line 77: Property 'bpm' does not exist
- Line 83: Type mismatch on query builder
- Line 89, 92, 95, 98, 101: Query builder type issues
- Line 128, 129: Property 'bpm' doesn't exist on track object
- Line 154: Property 'artist' should be 'artistId'

**Fix:** Either:
1. Add BPM column to tracks table schema, OR
2. Remove BPM filtering from advancedSearch.ts

**Action:** Remove BPM references from advancedSearch.ts (simpler fix)

---

## Priority 3: songPurchase.ts (12 errors)
**Issue:** Database type casting and null checks

**Errors:**
- Line 194: Property 'songPurchases' does not exist on type '{}'
- Line 199: 'db' is possibly 'null'
- Line 199: Property 'albumPurchases' does not exist

**Fix:** Ensure getDb() returns properly typed database instance

**Action:** Fix getDb() import and type casting

---

## Priority 4: trendingDashboard.ts (9 errors)
**Issue:** Type mismatches in database queries

**Errors:**
- Lines 50, 51, 52, 57, 58, 84, 85, 91, 92: Type mismatches in aggregation queries

**Fix:** Ensure query builder methods match Drizzle ORM API

**Action:** Review and fix query syntax

---

## Priority 5: socialSharingService.ts (8 errors)
**Issue:** Type mismatches in database operations

**Errors:**
- Lines 57, 58, 60, 79, 113, 133, 134, 135: Database query type issues

**Fix:** Ensure all database queries use correct Drizzle syntax

**Action:** Review and fix query syntax

---

## Priority 6: genreFilter.ts (6 errors)
**Issue:** Referencing non-existent table properties

**Errors:**
- Line 47: Property 'artist' should be 'artistId'
- Line 48: Property 'album' should be 'albumId'
- Line 54: Property 'album' should be 'albumId'
- Line 92: Property 'album' should be 'albumId'
- Line 98, 99: 'input.searchTerm' is possibly 'undefined'

**Fix:** Replace 'artist' with 'artistId', 'album' with 'albumId', add null checks

**Action:** Fix property names and add null checks

---

## Priority 7: features.ts (3 errors)
**Issue:** PushNotificationService method name mismatch

**Errors:**
- Line 140: Property 'registerDeviceToken' does not exist
- Line 150: Expected 2-3 arguments, but got 1
- Line 153: Property 'sendPushNotification' should be 'sendNotification'

**Fix:** Check PushNotificationService exports and method names

**Action:** Fix method names to match actual service exports

---

## Priority 8: Other Files (39 errors)
- **playlistService.ts** (3 errors): Type mismatches
- **bulkUpload.ts** (3 errors): Type mismatches
- **audioQuality.ts** (3 errors): Type mismatches
- **analytics.ts** (3 errors): Type mismatches
- **realtimeNotifications.ts** (4 errors): Type mismatches
- **NotificationCenter.tsx** (5 errors): Missing imports
- **PlaylistCollaboration.tsx** (3 errors): Missing imports
- **UploadDashboard.tsx** (3 errors): Missing imports
- **Other** (7 errors): Various type issues

---

## Fix Strategy

1. **Phase 1:** Fix advancedFeatures.ts (27 errors) - Change ID validation to strings
2. **Phase 2:** Fix advancedSearch.ts (13 errors) - Remove BPM references
3. **Phase 3:** Fix songPurchase.ts (12 errors) - Fix getDb() type casting
4. **Phase 4:** Fix trendingDashboard.ts (9 errors) - Fix query syntax
5. **Phase 5:** Fix socialSharingService.ts (8 errors) - Fix query syntax
6. **Phase 6:** Fix genreFilter.ts (6 errors) - Fix property names
7. **Phase 7:** Fix features.ts (3 errors) - Fix method names
8. **Phase 8:** Fix remaining 39 errors in other files

---

## Tracking

- [ ] Phase 1: advancedFeatures.ts (27 errors)
- [ ] Phase 2: advancedSearch.ts (13 errors)
- [ ] Phase 3: songPurchase.ts (12 errors)
- [ ] Phase 4: trendingDashboard.ts (9 errors)
- [ ] Phase 5: socialSharingService.ts (8 errors)
- [ ] Phase 6: genreFilter.ts (6 errors)
- [ ] Phase 7: features.ts (3 errors)
- [ ] Phase 8: Other files (39 errors)

**Total: 117 errors to fix**
