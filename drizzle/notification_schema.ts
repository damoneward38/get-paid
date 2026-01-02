/**
 * Notification Schema
 * Real-time notifications for user activities
 */

import { mysqlTable, int, varchar, timestamp, boolean, mysqlEnum } from "drizzle-orm/mysql-core";
import { users } from "./schema";

/**
 * Notifications
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", [
      "review_response",
      "badge_earned",
      "new_release",
      "collaboration_invite",
      "comment_reply",
      "follow",
      "mention",
      "message",
    ]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: varchar("message", { length: 500 }).notNull(),
    relatedId: int("relatedId"), // ID of related entity (review, badge, track, etc.)
    relatedType: varchar("relatedType", { length: 50 }), // Type of related entity
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    readAt: timestamp("readAt"),
  }
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification Preferences
 */
export const notificationPreferences = mysqlTable(
  "notificationPreferences",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    reviewResponses: boolean("reviewResponses").default(true).notNull(),
    badgesEarned: boolean("badgesEarned").default(true).notNull(),
    newReleases: boolean("newReleases").default(true).notNull(),
    collaborationInvites: boolean("collaborationInvites").default(true).notNull(),
    commentReplies: boolean("commentReplies").default(true).notNull(),
    follows: boolean("follows").default(true).notNull(),
    mentions: boolean("mentions").default(true).notNull(),
    messages: boolean("messages").default(true).notNull(),
    emailNotifications: boolean("emailNotifications").default(false).notNull(),
    pushNotifications: boolean("pushNotifications").default(true).notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
