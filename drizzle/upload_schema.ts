/**
 * Music Upload Schema
 * Manages uploaded music files, artwork, and metadata
 */

import { mysqlTable, int, varchar, text, timestamp, decimal, mysqlEnum, unique } from "drizzle-orm/mysql-core";
import { users } from "./schema";

/**
 * Uploaded Music Files
 */
export const musicUploads = mysqlTable(
  "musicUploads",
  {
    id: int("id").autoincrement().primaryKey(),
    uploadedBy: int("uploadedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    artist: varchar("artist", { length: 255 }).notNull(),
    album: varchar("album", { length: 255 }),
    genre: varchar("genre", { length: 100 }),
    description: text("description"),
    duration: int("duration"), // Duration in seconds
    fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 file key
    fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 file URL
    mimeType: varchar("mimeType", { length: 100 }).notNull(), // e.g., "audio/mpeg"
    fileSize: int("fileSize"), // File size in bytes
    status: mysqlEnum("status", ["draft", "processing", "published", "archived"]).default("draft").notNull(),
    releaseDate: timestamp("releaseDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type MusicUpload = typeof musicUploads.$inferSelect;
export type InsertMusicUpload = typeof musicUploads.$inferInsert;

/**
 * Album Artwork/Cover Art
 */
export const albumArtwork = mysqlTable(
  "albumArtwork",
  {
    id: int("id").autoincrement().primaryKey(),
    uploadedBy: int("uploadedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    albumName: varchar("albumName", { length: 255 }).notNull(),
    artworkKey: varchar("artworkKey", { length: 500 }).notNull(), // S3 file key
    artworkUrl: varchar("artworkUrl", { length: 500 }).notNull(), // S3 file URL
    mimeType: varchar("mimeType", { length: 100 }).notNull(), // e.g., "image/jpeg"
    fileSize: int("fileSize"), // File size in bytes
    width: int("width"), // Image width in pixels
    height: int("height"), // Image height in pixels
    status: mysqlEnum("status", ["draft", "approved", "published"]).default("draft").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type AlbumArtwork = typeof albumArtwork.$inferSelect;
export type InsertAlbumArtwork = typeof albumArtwork.$inferInsert;

/**
 * Upload Sessions - Track ongoing uploads
 */
export const uploadSessions = mysqlTable(
  "uploadSessions",
  {
    id: int("id").autoincrement().primaryKey(),
    uploadedBy: int("uploadedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    sessionId: varchar("sessionId", { length: 255 }).notNull().unique(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileType: varchar("fileType", { length: 100 }).notNull(),
    totalSize: int("totalSize").notNull(),
    uploadedSize: int("uploadedSize").default(0).notNull(),
    status: mysqlEnum("status", ["pending", "uploading", "completed", "failed"]).default("pending").notNull(),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"), // Session expiration
  }
);

export type UploadSession = typeof uploadSessions.$inferSelect;
export type InsertUploadSession = typeof uploadSessions.$inferInsert;

/**
 * Music Metadata - Detailed track information
 */
export const musicMetadata = mysqlTable(
  "musicMetadata",
  {
    id: int("id").autoincrement().primaryKey(),
    musicUploadId: int("musicUploadId").notNull().unique().references(() => musicUploads.id, { onDelete: "cascade" }),
    composer: varchar("composer", { length: 255 }),
    lyricist: varchar("lyricist", { length: 255 }),
    producer: varchar("producer", { length: 255 }),
    recordLabel: varchar("recordLabel", { length: 255 }),
    isrc: varchar("isrc", { length: 20 }), // International Standard Recording Code
    iswc: varchar("iswc", { length: 20 }), // International Standard Musical Work Code
    bpm: int("bpm"), // Beats per minute
    key: varchar("key", { length: 10 }), // Musical key (e.g., "C Major")
    language: varchar("language", { length: 10 }), // ISO 639-1 code
    lyrics: text("lyrics"), // Full lyrics text
    tags: varchar("tags", { length: 500 }), // Comma-separated tags
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type MusicMetadata = typeof musicMetadata.$inferSelect;
export type InsertMusicMetadata = typeof musicMetadata.$inferInsert;
