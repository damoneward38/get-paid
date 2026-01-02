/**
 * Community Leaderboard Schema
 * Track rankings and achievements
 */

import { mysqlTable, int, varchar, timestamp, decimal, date } from "drizzle-orm/mysql-core";
import { users, musicUploads } from "./schema";

/**
 * Top Reviewers Leaderboard
 */
export const topReviewersLeaderboard = mysqlTable(
  "topReviewersLeaderboard",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    userName: varchar("userName", { length: 255 }).notNull(),
    userAvatar: varchar("userAvatar", { length: 500 }),
    reviewCount: int("reviewCount").default(0).notNull(),
    helpfulCount: int("helpfulCount").default(0).notNull(),
    averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0.00").notNull(),
    rank: int("rank").notNull(),
    period: varchar("period", { length: 20 }).default("weekly").notNull(), // weekly, monthly, alltime
    weekStartDate: date("weekStartDate"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type TopReviewersLeaderboardEntry = typeof topReviewersLeaderboard.$inferSelect;
export type InsertTopReviewersLeaderboardEntry = typeof topReviewersLeaderboard.$inferInsert;

/**
 * Most Helpful Comments Leaderboard
 */
export const mostHelpfulCommentsLeaderboard = mysqlTable(
  "mostHelpfulCommentsLeaderboard",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    userName: varchar("userName", { length: 255 }).notNull(),
    commentCount: int("commentCount").default(0).notNull(),
    totalHelpful: int("totalHelpful").default(0).notNull(),
    helpfulRate: decimal("helpfulRate", { precision: 5, scale: 2 }).default("0.00").notNull(),
    rank: int("rank").notNull(),
    period: varchar("period", { length: 20 }).default("weekly").notNull(),
    weekStartDate: date("weekStartDate"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type MostHelpfulCommentsLeaderboardEntry = typeof mostHelpfulCommentsLeaderboard.$inferSelect;
export type InsertMostHelpfulCommentsLeaderboardEntry = typeof mostHelpfulCommentsLeaderboard.$inferInsert;

/**
 * Trending Tracks Leaderboard
 */
export const trendingTracksLeaderboard = mysqlTable(
  "trendingTracksLeaderboard",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    trackTitle: varchar("trackTitle", { length: 255 }).notNull(),
    artistName: varchar("artistName", { length: 255 }).notNull(),
    plays: int("plays").default(0).notNull(),
    newPlays: int("newPlays").default(0).notNull(),
    downloads: int("downloads").default(0).notNull(),
    shares: int("shares").default(0).notNull(),
    saves: int("saves").default(0).notNull(),
    trendingScore: decimal("trendingScore", { precision: 8, scale: 2 }).default("0.00").notNull(),
    rank: int("rank").notNull(),
    period: varchar("period", { length: 20 }).default("weekly").notNull(),
    weekStartDate: date("weekStartDate"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type TrendingTracksLeaderboardEntry = typeof trendingTracksLeaderboard.$inferSelect;
export type InsertTrendingTracksLeaderboardEntry = typeof trendingTracksLeaderboard.$inferInsert;

/**
 * Trending Artists Leaderboard
 */
export const trendingArtistsLeaderboard = mysqlTable(
  "trendingArtistsLeaderboard",
  {
    id: int("id").autoincrement().primaryKey(),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    artistName: varchar("artistName", { length: 255 }).notNull(),
    artistAvatar: varchar("artistAvatar", { length: 500 }),
    followers: int("followers").default(0).notNull(),
    newFollowers: int("newFollowers").default(0).notNull(),
    totalPlays: int("totalPlays").default(0).notNull(),
    newPlays: int("newPlays").default(0).notNull(),
    trendingScore: decimal("trendingScore", { precision: 8, scale: 2 }).default("0.00").notNull(),
    rank: int("rank").notNull(),
    period: varchar("period", { length: 20 }).default("weekly").notNull(),
    weekStartDate: date("weekStartDate"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type TrendingArtistsLeaderboardEntry = typeof trendingArtistsLeaderboard.$inferSelect;
export type InsertTrendingArtistsLeaderboardEntry = typeof trendingArtistsLeaderboard.$inferInsert;
