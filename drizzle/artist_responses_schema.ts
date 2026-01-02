/**
 * Artist Responses Schema
 * Allows artists to respond to user reviews
 */

import { mysqlTable, int, varchar, text, timestamp, unique } from "drizzle-orm/mysql-core";
import { users, trackReviews } from "./schema";

/**
 * Artist Responses - Artist replies to track reviews
 */
export const artistResponses = mysqlTable(
  "artistResponses",
  {
    id: int("id").autoincrement().primaryKey(),
    reviewId: int("reviewId").notNull().unique().references(() => trackReviews.id, { onDelete: "cascade" }),
    artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type ArtistResponse = typeof artistResponses.$inferSelect;
export type InsertArtistResponse = typeof artistResponses.$inferInsert;
