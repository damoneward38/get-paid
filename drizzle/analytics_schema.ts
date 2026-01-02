/**
 * Analytics Schema
 * Track plays, downloads, and listener metrics
 */

import { mysqlTable, int, varchar, timestamp, decimal, date } from "drizzle-orm/mysql-core";
import { users, musicUploads } from "./schema";

/**
 * Track Plays
 */
export const trackPlays = mysqlTable(
  "trackPlays",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    playedAt: timestamp("playedAt").defaultNow().notNull(),
    duration: int("duration"), // Duration played in seconds
    deviceType: varchar("deviceType", { length: 50 }), // mobile, desktop, tablet
    country: varchar("country", { length: 2 }), // ISO country code
  }
);

export type TrackPlay = typeof trackPlays.$inferSelect;
export type InsertTrackPlay = typeof trackPlays.$inferInsert;

/**
 * Track Downloads
 */
export const trackDownloads = mysqlTable(
  "trackDownloads",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
    format: varchar("format", { length: 20 }), // mp3, wav, flac, etc.
    country: varchar("country", { length: 2 }),
  }
);

export type TrackDownload = typeof trackDownloads.$inferSelect;
export type InsertTrackDownload = typeof trackDownloads.$inferInsert;

/**
 * Daily Analytics Summary
 */
export const dailyAnalyticsSummary = mysqlTable(
  "dailyAnalyticsSummary",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    plays: int("plays").default(0).notNull(),
    downloads: int("downloads").default(0).notNull(),
    uniqueListeners: int("uniqueListeners").default(0).notNull(),
    totalDuration: int("totalDuration").default(0).notNull(), // Total seconds played
    avgDuration: decimal("avgDuration", { precision: 10, scale: 2 }), // Average seconds per play
  }
);

export type DailyAnalyticsSummary = typeof dailyAnalyticsSummary.$inferSelect;
export type InsertDailyAnalyticsSummary = typeof dailyAnalyticsSummary.$inferInsert;

/**
 * Listener Demographics
 */
export const listenerDemographics = mysqlTable(
  "listenerDemographics",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    country: varchar("country", { length: 2 }).notNull(),
    plays: int("plays").default(0).notNull(),
    downloads: int("downloads").default(0).notNull(),
    uniqueListeners: int("uniqueListeners").default(0).notNull(),
    lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  }
);

export type ListenerDemographics = typeof listenerDemographics.$inferSelect;
export type InsertListenerDemographics = typeof listenerDemographics.$inferInsert;

/**
 * Revenue Tracking
 */
export const revenueTracking = mysqlTable(
  "revenueTracking",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    source: varchar("source", { length: 50 }).notNull(), // paypal, spotify, apple_music, etc.
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    date: date("date").notNull(),
    transactionId: varchar("transactionId", { length: 255 }),
  }
);

export type RevenueTracking = typeof revenueTracking.$inferSelect;
export type InsertRevenueTracking = typeof revenueTracking.$inferInsert;
