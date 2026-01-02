/**
 * Artist Dashboard Schema
 * Track artist-specific metrics and trends
 */

import { mysqlTable, int, varchar, timestamp, decimal, date } from "drizzle-orm/mysql-core";
import { users, musicUploads } from "./schema";

/**
 * Artist Review Trends
 */
export const artistReviewTrends = mysqlTable(
  "artistReviewTrends",
  {
    id: int("id").autoincrement().primaryKey(),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    totalReviews: int("totalReviews").default(0).notNull(),
    averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0.00").notNull(),
    positiveReviews: int("positiveReviews").default(0).notNull(),
    negativeReviews: int("negativeReviews").default(0).notNull(),
    neutralReviews: int("neutralReviews").default(0).notNull(),
  }
);

export type ArtistReviewTrend = typeof artistReviewTrends.$inferSelect;
export type InsertArtistReviewTrend = typeof artistReviewTrends.$inferInsert;

/**
 * Artist Listener Demographics
 */
export const artistListenerDemographics = mysqlTable(
  "artistListenerDemographics",
  {
    id: int("id").autoincrement().primaryKey(),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    ageGroup: varchar("ageGroup", { length: 20 }), // 13-17, 18-24, 25-34, 35-44, 45-54, 55+
    gender: varchar("gender", { length: 20 }), // male, female, other
    country: varchar("country", { length: 2 }),
    listenerCount: int("listenerCount").default(0).notNull(),
    playCount: int("playCount").default(0).notNull(),
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  }
);

export type ArtistListenerDemographic = typeof artistListenerDemographics.$inferSelect;
export type InsertArtistListenerDemographic = typeof artistListenerDemographics.$inferInsert;

/**
 * Artist Engagement Metrics
 */
export const artistEngagementMetrics = mysqlTable(
  "artistEngagementMetrics",
  {
    id: int("id").autoincrement().primaryKey(),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    followers: int("followers").default(0).notNull(),
    newFollowers: int("newFollowers").default(0).notNull(),
    shares: int("shares").default(0).notNull(),
    saves: int("saves").default(0).notNull(),
    comments: int("comments").default(0).notNull(),
    engagementRate: decimal("engagementRate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  }
);

export type ArtistEngagementMetric = typeof artistEngagementMetrics.$inferSelect;
export type InsertArtistEngagementMetric = typeof artistEngagementMetrics.$inferInsert;

/**
 * Most Helpful Reviews
 */
export const mostHelpfulReviews = mysqlTable(
  "mostHelpfulReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    reviewId: int("reviewId"),
    reviewerName: varchar("reviewerName", { length: 255 }),
    reviewText: varchar("reviewText", { length: 1000 }),
    rating: int("rating"), // 1-5
    helpfulCount: int("helpfulCount").default(0).notNull(),
    unhelpfulCount: int("unhelpfulCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type MostHelpfulReview = typeof mostHelpfulReviews.$inferSelect;
export type InsertMostHelpfulReview = typeof mostHelpfulReviews.$inferInsert;
