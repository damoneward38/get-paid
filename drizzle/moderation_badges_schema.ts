/**
 * Moderation and Badges Schema
 * Review moderation and listener achievement badges
 */

import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, unique } from "drizzle-orm/mysql-core";
import { users, trackReviews } from "./schema";

/**
 * Review Moderation - Flag and manage inappropriate reviews
 */
export const reviewModeration = mysqlTable(
  "reviewModeration",
  {
    id: int("id").autoincrement().primaryKey(),
    reviewId: int("reviewId").notNull().references(() => trackReviews.id, { onDelete: "cascade" }),
    flaggedBy: int("flaggedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    reason: varchar("reason", { length: 255 }).notNull(), // e.g., "spam", "offensive", "irrelevant"
    description: text("description"),
    status: mysqlEnum("status", ["pending", "approved", "rejected", "resolved"]).default("pending").notNull(),
    moderatorNotes: text("moderatorNotes"),
    reviewedBy: int("reviewedBy").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type ReviewModeration = typeof reviewModeration.$inferSelect;
export type InsertReviewModeration = typeof reviewModeration.$inferInsert;

/**
 * Listener Badges - Achievements for active community members
 */
export const listenerBadges = mysqlTable(
  "listenerBadges",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 255 }), // URL to badge icon
    criteria: varchar("criteria", { length: 255 }).notNull(), // e.g., "10_helpful_reviews"
    color: varchar("color", { length: 7 }).default("#9333ea"), // Hex color
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type ListenerBadge = typeof listenerBadges.$inferSelect;
export type InsertListenerBadge = typeof listenerBadges.$inferInsert;

/**
 * User Badge Assignments - Track which users have earned which badges
 */
export const userBadgeAssignments = mysqlTable(
  "userBadgeAssignments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    badgeId: int("badgeId").notNull().references(() => listenerBadges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  },
  (table) => ({
    userBadgeUnique: unique("userBadgeUnique").on(table.userId, table.badgeId),
  })
);

export type UserBadgeAssignment = typeof userBadgeAssignments.$inferSelect;
export type InsertUserBadgeAssignment = typeof userBadgeAssignments.$inferInsert;

/**
 * Badge Criteria Tracking - Track progress toward earning badges
 */
export const badgeCriteriaTracking = mysqlTable(
  "badgeCriteriaTracking",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    badgeId: int("badgeId").notNull().references(() => listenerBadges.id, { onDelete: "cascade" }),
    progress: int("progress").default(0).notNull(), // Current progress toward badge
    target: int("target").notNull(), // Target needed to earn badge
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userBadgeCriteriaUnique: unique("userBadgeCriteriaUnique").on(table.userId, table.badgeId),
  })
);

export type BadgeCriteriaTracking = typeof badgeCriteriaTracking.$inferSelect;
export type InsertBadgeCriteriaTracking = typeof badgeCriteriaTracking.$inferInsert;
