/**
 * Reviews and Ratings Schema
 * Extends the existing schema with user reviews and ratings for tracks
 */

import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, unique } from "drizzle-orm/mysql-core";
import { users, tracks } from "./schema";

/**
 * Track Reviews - User reviews for gospel tracks
 */
export const trackReviews = mysqlTable(
  "trackReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    rating: int("rating").notNull(), // 1-5 stars
    title: varchar("title", { length: 255 }),
    content: text("content"), // Review text
    helpful: int("helpful").default(0).notNull(), // Count of helpful votes
    unhelpful: int("unhelpful").default(0).notNull(), // Count of unhelpful votes
    isVerifiedPurchase: int("isVerifiedPurchase").default(0).notNull(), // 0 = false, 1 = true
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    // Ensure one review per user per track
    userTrackUnique: unique("userTrackUnique").on(table.userId, table.trackId),
  })
);

export type TrackReview = typeof trackReviews.$inferSelect;
export type InsertTrackReview = typeof trackReviews.$inferInsert;

/**
 * Track Ratings - Aggregate ratings for tracks
 */
export const trackRatings = mysqlTable(
  "trackRatings",
  {
    id: int("id").autoincrement().primaryKey(),
    trackId: int("trackId").notNull().unique().references(() => tracks.id, { onDelete: "cascade" }),
    averageRating: varchar("averageRating", { length: 4 }).notNull(), // e.g., "4.5"
    totalReviews: int("totalReviews").default(0).notNull(),
    fiveStarCount: int("fiveStarCount").default(0).notNull(),
    fourStarCount: int("fourStarCount").default(0).notNull(),
    threeStarCount: int("threeStarCount").default(0).notNull(),
    twoStarCount: int("twoStarCount").default(0).notNull(),
    oneStarCount: int("oneStarCount").default(0).notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type TrackRating = typeof trackRatings.$inferSelect;
export type InsertTrackRating = typeof trackRatings.$inferInsert;

/**
 * Review Helpfulness Votes - Track which users found reviews helpful
 */
export const reviewHelpfulnessVotes = mysqlTable(
  "reviewHelpfulnessVotes",
  {
    id: int("id").autoincrement().primaryKey(),
    reviewId: int("reviewId").notNull().references(() => trackReviews.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    isHelpful: int("isHelpful").notNull(), // 1 = helpful, 0 = unhelpful
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    // Ensure one vote per user per review
    userReviewUnique: unique("userReviewUnique").on(table.userId, table.reviewId),
  })
);

export type ReviewHelpfulnessVote = typeof reviewHelpfulnessVotes.$inferSelect;
export type InsertReviewHelpfulnessVote = typeof reviewHelpfulnessVotes.$inferInsert;

/**
 * Album Reviews - User reviews for albums
 */
export const albumReviews = mysqlTable(
  "albumReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    albumId: int("albumId").notNull(), // Reference to albums table
    rating: int("rating").notNull(), // 1-5 stars
    title: varchar("title", { length: 255 }),
    content: text("content"),
    helpful: int("helpful").default(0).notNull(),
    unhelpful: int("unhelpful").default(0).notNull(),
    isVerifiedPurchase: int("isVerifiedPurchase").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userAlbumUnique: unique("userAlbumUnique").on(table.userId, table.albumId),
  })
);

export type AlbumReview = typeof albumReviews.$inferSelect;
export type InsertAlbumReview = typeof albumReviews.$inferInsert;
