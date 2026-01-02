# User Reviews & Ratings Feature - Implementation Guide

## Overview

This guide documents the complete implementation of user reviews and ratings for gospel tracks on the Gifted Eternity streaming platform.

## Database Schema

### New Tables

#### 1. `trackReviews` Table
Stores individual user reviews for tracks.

```sql
CREATE TABLE trackReviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  trackId INT NOT NULL,
  rating INT NOT NULL (1-5),
  title VARCHAR(255),
  content TEXT,
  helpful INT DEFAULT 0,
  unhelpful INT DEFAULT 0,
  isVerifiedPurchase TINYINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trackId) REFERENCES tracks(id) ON DELETE CASCADE,
  UNIQUE KEY userTrackUnique (userId, trackId)
);
```

**Key Features:**
- One review per user per track (enforced by unique constraint)
- Rating scale: 1-5 stars
- Tracks helpful/unhelpful votes
- Verified purchase flag for authenticated transactions

#### 2. `trackRatings` Table
Aggregate ratings for each track (denormalized for performance).

```sql
CREATE TABLE trackRatings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trackId INT NOT NULL UNIQUE,
  averageRating VARCHAR(4) NOT NULL,
  totalReviews INT DEFAULT 0,
  fiveStarCount INT DEFAULT 0,
  fourStarCount INT DEFAULT 0,
  threeStarCount INT DEFAULT 0,
  twoStarCount INT DEFAULT 0,
  oneStarCount INT DEFAULT 0,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trackId) REFERENCES tracks(id) ON DELETE CASCADE
);
```

**Key Features:**
- Denormalized for fast queries
- Automatically updated when reviews change
- Stores distribution of star ratings

#### 3. `reviewHelpfulnessVotes` Table
Tracks which users found reviews helpful/unhelpful.

```sql
CREATE TABLE reviewHelpfulnessVotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewId INT NOT NULL,
  userId INT NOT NULL,
  isHelpful INT NOT NULL (1 = helpful, 0 = unhelpful),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewId) REFERENCES trackReviews(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY userReviewUnique (userId, reviewId)
);
```

**Key Features:**
- One vote per user per review
- Users can change their vote
- Automatically updates review helpful/unhelpful counts

#### 4. `albumReviews` Table
Similar to `trackReviews` but for albums.

```sql
CREATE TABLE albumReviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  albumId INT NOT NULL,
  rating INT NOT NULL (1-5),
  title VARCHAR(255),
  content TEXT,
  helpful INT DEFAULT 0,
  unhelpful INT DEFAULT 0,
  isVerifiedPurchase TINYINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY userAlbumUnique (userId, albumId)
);
```

## Backend Implementation

### Service Layer (`server/_core/reviews.ts`)

The `ReviewsService` class provides all business logic:

#### Key Methods

1. **createReview(input: CreateReviewInput)**
   - Creates a new review for a track
   - Validates rating (1-5)
   - Prevents duplicate reviews
   - Updates track rating aggregate

2. **updateReview(input: UpdateReviewInput)**
   - Updates existing review
   - Recalculates track ratings

3. **deleteReview(reviewId: number)**
   - Deletes a review
   - Updates track ratings

4. **getTrackReviews(trackId, limit, offset)**
   - Retrieves paginated reviews
   - Sorted by newest first

5. **getTrackRating(trackId)**
   - Returns aggregate rating data
   - Includes star distribution

6. **voteReviewHelpfulness(reviewId, userId, isHelpful)**
   - Records helpful/unhelpful votes
   - Updates review helpful counts
   - Allows vote changes

7. **getTopRatedTracks(limit)**
   - Returns highest-rated tracks
   - Used for recommendations

### tRPC Router (`server/routers/reviews.ts`)

Exposes the following procedures:

#### Public Procedures
- `getTrackReviews` - Get reviews for a track
- `getTrackRating` - Get rating aggregate
- `getTopRatedTracks` - Get top-rated tracks

#### Protected Procedures (Requires Authentication)
- `createReview` - Submit a new review
- `updateReview` - Edit existing review
- `deleteReview` - Remove a review
- `voteReviewHelpfulness` - Vote on review helpfulness

## Frontend Implementation

### TrackReviews Component (`client/src/components/TrackReviews.tsx`)

A complete React component for displaying and managing reviews.

#### Features
- **Rating Summary Display**
  - Average rating with star visualization
  - Total review count
  - Star distribution breakdown

- **Review Form**
  - Interactive star rating selector
  - Title and content inputs
  - Submit/cancel actions
  - Form validation

- **Reviews List**
  - Paginated review display
  - Star ratings visualization
  - Verified purchase badge
  - Creation date
  - Helpful/unhelpful voting

#### Usage

```tsx
import { TrackReviews } from '@/components/TrackReviews';

function TrackDetailPage({ trackId, trackTitle }) {
  return (
    <div>
      {/* Other track details */}
      <TrackReviews trackId={trackId} trackTitle={trackTitle} />
    </div>
  );
}
```

## Integration Steps

### Step 1: Update Database Schema

Add the new tables to your database:

```bash
pnpm db:push
```

This will run migrations based on the schema files.

### Step 2: Import Reviews Router

Update `server/routers.ts` to include the reviews router:

```typescript
import { reviewsRouter } from './routers/reviews';

export const appRouter = router({
  // ... existing routers
  reviews: reviewsRouter,
});
```

### Step 3: Add Reviews to Track Detail Page

Update your track detail page to include the reviews component:

```tsx
import { TrackReviews } from '@/components/TrackReviews';

export function TrackDetailPage({ trackId, trackTitle }) {
  return (
    <div className="space-y-8">
      {/* Track player and details */}
      <div className="mt-8">
        <TrackReviews trackId={trackId} trackTitle={trackTitle} />
      </div>
    </div>
  );
}
```

### Step 4: Add Top Rated Tracks Section

Create a component to display top-rated tracks:

```tsx
import { trpc } from '@/lib/trpc';

export function TopRatedTracks() {
  const { data: topTracks } = trpc.reviews.getTopRatedTracks.useQuery({ limit: 10 });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Rated Tracks</h2>
      {topTracks?.map((track) => (
        <div key={track.trackId} className="flex items-center justify-between">
          <span>{track.trackId}</span>
          <span className="text-lg font-semibold">{track.averageRating} ⭐</span>
        </div>
      ))}
    </div>
  );
}
```

## Testing

Run the review tests:

```bash
pnpm test server/reviews.test.ts
```

Test coverage includes:
- Creating reviews
- Updating reviews
- Deleting reviews
- Rating aggregation
- Helpfulness voting
- Pagination
- Duplicate prevention

## Performance Considerations

1. **Denormalized Ratings Table**
   - Avoids expensive aggregation queries
   - Updated incrementally when reviews change
   - Indexed for fast lookups

2. **Pagination**
   - Reviews are paginated (default 10 per page)
   - Prevents loading all reviews at once

3. **Unique Constraints**
   - Prevents duplicate reviews
   - Prevents duplicate votes
   - Enforced at database level

## Future Enhancements

1. **Review Moderation**
   - Flag inappropriate reviews
   - Admin approval workflow
   - Spam detection

2. **Review Analytics**
   - Track review trends
   - Identify helpful reviewers
   - Review sentiment analysis

3. **Social Features**
   - Follow reviewers
   - Review recommendations
   - Community badges

4. **Review Filtering**
   - Filter by rating
   - Filter by verified purchases
   - Sort by helpfulness

5. **Review Responses**
   - Artist responses to reviews
   - Community discussion threads

## API Examples

### Create a Review

```typescript
const result = await trpc.reviews.createReview.mutate({
  trackId: 1,
  rating: 5,
  title: "Amazing Gospel Track",
  content: "This track is absolutely beautiful and uplifting!",
  isVerifiedPurchase: true,
});
```

### Get Track Reviews

```typescript
const { data } = await trpc.reviews.getTrackReviews.useQuery({
  trackId: 1,
  limit: 10,
  offset: 0,
});
```

### Get Track Rating

```typescript
const { data: rating } = await trpc.reviews.getTrackRating.useQuery({
  trackId: 1,
});

console.log(rating.averageRating); // "4.5"
console.log(rating.totalReviews); // 42
```

### Vote on Review Helpfulness

```typescript
await trpc.reviews.voteReviewHelpfulness.mutate({
  reviewId: 5,
  isHelpful: true,
});
```

### Get Top Rated Tracks

```typescript
const { data: topTracks } = await trpc.reviews.getTopRatedTracks.useQuery({
  limit: 10,
});
```

## Database Maintenance

### Recalculate All Ratings

If you need to recalculate all track ratings:

```sql
-- Clear existing ratings
DELETE FROM trackRatings;

-- Recalculate from reviews
INSERT INTO trackRatings (trackId, averageRating, totalReviews, fiveStarCount, fourStarCount, threeStarCount, twoStarCount, oneStarCount)
SELECT 
  trackId,
  ROUND(AVG(rating), 1),
  COUNT(*),
  SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END),
  SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END),
  SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END),
  SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END),
  SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END)
FROM trackReviews
GROUP BY trackId;
```

## Troubleshooting

### Reviews Not Showing
1. Verify database tables are created: `pnpm db:push`
2. Check reviews router is imported in main router
3. Verify trackId is correct

### Rating Not Updating
1. Check if review was created successfully
2. Verify trackRatings table has entry for track
3. Check database for orphaned reviews

### Helpful Votes Not Working
1. Verify user is authenticated
2. Check reviewHelpfulnessVotes table has entries
3. Verify vote is updating helpful/unhelpful counts

## Files Created

- `drizzle/reviews_schema.ts` - Database schema definitions
- `server/_core/reviews.ts` - Business logic service
- `server/routers/reviews.ts` - tRPC API endpoints
- `client/src/components/TrackReviews.tsx` - React component
- `server/reviews.test.ts` - Unit tests
- `REVIEWS_IMPLEMENTATION_GUIDE.md` - This guide
