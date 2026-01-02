/**
 * Collaboration Schema
 * Manage shared access and permissions for music uploads
 */

import { mysqlTable, int, varchar, timestamp, mysqlEnum, unique } from "drizzle-orm/mysql-core";
import { users, musicUploads } from "./schema";

/**
 * Collaboration Invites
 */
export const collaborationInvites = mysqlTable(
  "collaborationInvites",
  {
    id: int("id").autoincrement().primaryKey(),
    invitedBy: int("invitedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    invitedUser: int("invitedUser").notNull().references(() => users.id, { onDelete: "cascade" }),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["viewer", "editor", "admin"]).default("viewer").notNull(),
    status: mysqlEnum("status", ["pending", "accepted", "rejected", "revoked"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    respondedAt: timestamp("respondedAt"),
  },
  (table) => ({
    uniqueInvite: unique("unique_invite").on(table.invitedUser, table.musicUploadId),
  })
);

export type CollaborationInvite = typeof collaborationInvites.$inferSelect;
export type InsertCollaborationInvite = typeof collaborationInvites.$inferInsert;

/**
 * Collaborators - Active collaborations
 */
export const collaborators = mysqlTable(
  "collaborators",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["viewer", "editor", "admin"]).default("viewer").notNull(),
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  },
  (table) => ({
    uniqueCollaborator: unique("unique_collaborator").on(table.userId, table.musicUploadId),
  })
);

export type Collaborator = typeof collaborators.$inferSelect;
export type InsertCollaborator = typeof collaborators.$inferInsert;

/**
 * Collaboration Activity Log
 */
export const collaborationActivityLog = mysqlTable(
  "collaborationActivityLog",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    musicUploadId: int("musicUploadId").notNull().references(() => musicUploads.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(), // e.g., "edited_metadata", "published", "commented"
    details: varchar("details", { length: 500 }),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  }
);

export type CollaborationActivityLog = typeof collaborationActivityLog.$inferSelect;
export type InsertCollaborationActivityLog = typeof collaborationActivityLog.$inferInsert;
