# Community Features Implementation Guide

## Overview

This guide documents three new community features for the Gifted Eternity platform:

1. **Artist Responses** - Artists can reply to user reviews
2. **Review Moderation** - Admin dashboard to manage flagged reviews
3. **Listener Badges** - Achievement system for active community members

## Feature 1: Artist Responses

### Purpose
Allow artists (like Damone Ward Sr.) to engage with listeners by responding to their reviews, building community and showing appreciation for feedback.

### Database Schema

```sql
CREATE TABLE artistResponses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewId INT NOT NULL UNIQUE,
  artistId INT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewId) REFERENCES trackReviews(id) ON DELETE CASCADE,
  FOREIGN KEY (artistId) REFERENCES users(id) ON DELETE CASCADE
);
```

### Backend Service (`server/_core/artistResponses.ts`)

**Key Methods:**
- `createResponse(input)` - Artist creates response to a review
- `updateResponse(responseId, content)` - Edit existing response
- `deleteResponse(responseId)` - Remove response
- `getResponseForReview(reviewId)` - Get response for specific review
- `getArtistResponses(artistId)` - Get all responses from artist

### tRPC Procedures (`server/routers/community.ts`)

```typescript
// Create response (protected - artist only)
trpc.community.createArtistResponse.mutate({
  reviewId: 5,
  content: "Thank you for the kind words! This means a lot to me."
})

// Get response for review (public)
trpc.community.getResponseForReview.useQuery({ reviewId: 5 })

// Get artist's responses (public)
trpc.community.getArtistResponses.useQuery({ artistId: 1 })
```

### Frontend Component (`client/src/components/ArtistResponse.tsx`)

**Features:**
- Display artist responses with timestamp
- Allow artists to edit/delete their responses
- Form to submit new responses
- Beautiful purple-themed card design

**Usage:**
```tsx
import { ArtistResponse } from '@/components/ArtistResponse';

function ReviewCard({ reviewId, artistId }) {
  return (
    <div>
      {/* Review content */}
      <ArtistResponse 
        reviewId={reviewId} 
        artistId={artistId}
        isArtist={currentUser.id === artistId}
      />
    </div>
  );
}
```

### User Experience Flow

1. **Listener** posts a review
2. **Artist** sees notification of new review
3. **Artist** clicks "Respond to Review"
4. **Artist** types response and submits
5. **Listener** sees artist's response on their review
6. **Community** sees engagement and appreciates interaction

---

## Feature 2: Review Moderation

### Purpose
Provide admins with tools to manage inappropriate, spam, or irrelevant reviews, maintaining community quality.

### Database Schema

```sql
CREATE TABLE reviewModeration (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewId INT NOT NULL,
  flaggedBy INT NOT NULL,
  reason ENUM('spam', 'offensive', 'irrelevant', 'duplicate', 'other') NOT NULL,
  description TEXT,
  status ENUM('pending', 'approved', 'rejected', 'resolved') DEFAULT 'pending',
  moderatorNotes TEXT,
  reviewedBy INT,
  reviewedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewId) REFERENCES trackReviews(id) ON DELETE CASCADE,
  FOREIGN KEY (flaggedBy) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(id) ON DELETE SET NULL
);
```

### Backend Service (`server/_core/moderation.ts`)

**Key Methods:**
- `flagReview(input)` - User flags a review
- `getPendingModerations()` - Get all pending cases
- `approveModerationCase(caseId, moderatorId, notes)` - Keep review
- `rejectModerationCase(caseId, moderatorId, notes)` - Delete review
- `getReviewModerationHistory(reviewId)` - View moderation history

### tRPC Procedures

```typescript
// Flag a review (protected)
trpc.community.flagReview.mutate({
  reviewId: 5,
  reason: 'spam',
  description: 'This looks like spam'
})

// Get pending cases (admin only)
trpc.community.getPendingModerations.useQuery()

// Approve case (admin only)
trpc.community.approveModerationCase.mutate({
  caseId: 1,
  notes: 'Review is legitimate'
})

// Reject case (admin only)
trpc.community.rejectModerationCase.mutate({
  caseId: 1,
  notes: 'Review violates community guidelines'
})
```

### Frontend Component (`client/src/components/ModerationDashboard.tsx`)

**Features:**
- List of pending moderation cases
- Case details with reason and description
- Approve/reject buttons
- Moderator notes field
- Case count indicator

**Usage:**
```tsx
import { ModerationDashboard } from '@/components/ModerationDashboard';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ModerationDashboard />
    </div>
  );
}
```

### Flag Reasons

- **spam** - Promotional content, irrelevant links
- **offensive** - Hateful, discriminatory, or abusive language
- **irrelevant** - Off-topic or not about the track
- **duplicate** - Duplicate of existing review
- **other** - Other reasons

### Moderation Workflow

1. **User** flags a review
2. **Admin** sees pending case in dashboard
3. **Admin** reviews case details
4. **Admin** decides: approve (keep) or reject (delete)
5. **Admin** adds notes explaining decision
6. **System** updates review status and notifies user

---

## Feature 3: Listener Badges

### Purpose
Recognize and reward active community members with achievement badges, encouraging engagement and quality participation.

### Database Schema

```sql
CREATE TABLE listenerBadges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(255),
  criteria VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#9333ea',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE userBadgeAssignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  badgeId INT NOT NULL,
  earnedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY userBadgeUnique (userId, badgeId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badgeId) REFERENCES listenerBadges(id) ON DELETE CASCADE
);

CREATE TABLE badgeCriteriaTracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  badgeId INT NOT NULL,
  progress INT DEFAULT 0,
  target INT NOT NULL,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY userBadgeCriteriaUnique (userId, badgeId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badgeId) REFERENCES listenerBadges(id) ON DELETE CASCADE
);
```

### Default Badges

| Badge | Criteria | Target | Color |
|-------|----------|--------|-------|
| First Review | Post first review | 1 | Blue |
| Helpful Reviewer | Receive helpful votes | 10 | Green |
| Super Reviewer | Post reviews | 25 | Amber |
| Community Champion | Post reviews | 100 | Purple |
| Gospel Expert | Receive helpful votes | 50 | Pink |
| Verified Listener | Purchase + review | 1 | Cyan |

### Backend Service (`server/_core/badges.ts`)

**Key Methods:**
- `initializeDefaultBadges()` - Set up default badges
- `getAllBadges()` - Get all badge definitions
- `getUserBadges(userId)` - Get user's earned badges
- `getUserBadgeProgress(userId)` - Get progress toward badges
- `checkAndAwardBadges(userId)` - Check criteria and award
- `checkBadgeCriteria(userId, criteria)` - Verify criteria met

### tRPC Procedures

```typescript
// Get all badges (public)
trpc.community.getAllBadges.useQuery()

// Get user's badges (public)
trpc.community.getUserBadges.useQuery({ userId: 5 })

// Get my progress (protected)
trpc.community.getUserBadgeProgress.useQuery()

// Check and award badges (protected)
trpc.community.checkAndAwardBadges.mutate()

// Initialize badges (admin only)
trpc.community.initializeDefaultBadges.mutate()
```

### Frontend Component (`client/src/components/ListenerBadges.tsx`)

**Features:**
- Display earned badges with colors
- Show progress toward next badges
- Progress bars for in-progress badges
- Hover tooltips with badge details
- Empty state when no badges

**Usage:**
```tsx
import { ListenerBadges } from '@/components/ListenerBadges';

// View user's badges
function UserProfile({ userId }) {
  return <ListenerBadges userId={userId} />;
}

// View my progress (with progress bars)
function MyProfile() {
  return <ListenerBadges showProgress={true} />;
}
```

### Badge Earning Flow

1. **User** posts a review
2. **System** checks badge criteria
3. **User** earns badges automatically
4. **Notification** sent to user
5. **Badge** displayed on profile

### Badge Progress Tracking

```typescript
// User has 8 helpful votes, needs 10 for "Helpful Reviewer"
{
  badgeId: 2,
  badgeName: "Helpful Reviewer",
  progress: 8,
  target: 10,
  percentage: 80
}
```

---

## Integration Steps

### Step 1: Add Database Tables

```bash
pnpm db:push
```

This will create all new tables for artist responses, moderation, and badges.

### Step 2: Import Community Router

Update `server/routers.ts`:

```typescript
import { communityRouter } from './routers/community';

export const appRouter = router({
  // ... existing routers
  community: communityRouter,
});
```

### Step 3: Add Components to Track Detail Page

```tsx
import { ArtistResponse } from '@/components/ArtistResponse';

function TrackDetailPage({ trackId, artistId }) {
  return (
    <div className="space-y-8">
      {/* Track player */}
      {/* Reviews section */}
      <TrackReviews trackId={trackId} />
      
      {/* Artist responses */}
      <ArtistResponse 
        reviewId={reviewId}
        artistId={artistId}
        isArtist={isCurrentUserArtist}
      />
    </div>
  );
}
```

### Step 4: Add Moderation Dashboard to Admin Panel

```tsx
import { ModerationDashboard } from '@/components/ModerationDashboard';

function AdminPanel() {
  return (
    <div>
      <h2>Review Moderation</h2>
      <ModerationDashboard />
    </div>
  );
}
```

### Step 5: Add Badges to User Profile

```tsx
import { ListenerBadges } from '@/components/ListenerBadges';

function UserProfile({ userId }) {
  return (
    <div>
      <h2>Achievements</h2>
      <ListenerBadges userId={userId} showProgress={false} />
    </div>
  );
}
```

---

## Testing

### Artist Responses Tests
```bash
pnpm test server/artistResponses.test.ts
```

### Moderation Tests
```bash
pnpm test server/moderation.test.ts
```

### Badges Tests
```bash
pnpm test server/badges.test.ts
```

---

## Performance Considerations

### Artist Responses
- Indexed on `reviewId` for fast lookups
- One response per review (unique constraint)
- Minimal data per response

### Review Moderation
- Indexed on `reviewId` and `status` for filtering
- Pending cases retrieved efficiently
- Moderation history available per review

### Listener Badges
- Denormalized progress tracking for performance
- Criteria checking optimized with early returns
- Badge initialization runs once

---

## Future Enhancements

1. **Badge Tiers** - Multiple levels of badges
2. **Badge Notifications** - Notify users when earning badges
3. **Leaderboards** - Top reviewers, most helpful, etc.
4. **Review Editing** - Allow artists to edit responses
5. **Response Notifications** - Notify reviewers of artist responses
6. **Moderation Appeals** - Allow users to appeal rejections
7. **Badge Sharing** - Share badges on social media
8. **Custom Badges** - Create custom badges for events

---

## Files Created

- `drizzle/artist_responses_schema.ts` - Artist responses schema
- `drizzle/moderation_badges_schema.ts` - Moderation and badges schema
- `server/_core/artistResponses.ts` - Artist responses service
- `server/_core/moderation.ts` - Moderation service
- `server/_core/badges.ts` - Badges service
- `server/routers/community.ts` - Community tRPC router
- `client/src/components/ArtistResponse.tsx` - Artist response component
- `client/src/components/ModerationDashboard.tsx` - Moderation dashboard
- `client/src/components/ListenerBadges.tsx` - Badges display component
- `COMMUNITY_FEATURES_GUIDE.md` - This guide
