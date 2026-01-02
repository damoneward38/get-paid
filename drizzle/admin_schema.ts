/**
 * Admin Schema
 * Admin authentication and access control
 */

import { mysqlTable, int, varchar, timestamp, boolean, text } from "drizzle-orm/mysql-core";
import { users } from "./schema";

/**
 * Admin Users
 */
export const adminUsers = mysqlTable(
  "adminUsers",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    gmailId: varchar("gmailId", { length: 255 }).unique(),
    passcodeHash: varchar("passcodeHash", { length: 255 }),
    passcodeVerified: boolean("passcodeVerified").default(false).notNull(),
    verificationCode: varchar("verificationCode", { length: 6 }),
    verificationCodeExpiry: timestamp("verificationCodeExpiry"),
    lastLogin: timestamp("lastLogin"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Admin Sessions
 */
export const adminSessions = mysqlTable(
  "adminSessions",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: varchar("userAgent", { length: 500 }),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

/**
 * Admin Activity Log
 */
export const adminActivityLog = mysqlTable(
  "adminActivityLog",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(), // login, logout, create, update, delete, etc.
    entityType: varchar("entityType", { length: 50 }), // user, track, payment, etc.
    entityId: int("entityId"),
    details: text("details"),
    ipAddress: varchar("ipAddress", { length: 45 }),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  }
);

export type AdminActivityLog = typeof adminActivityLog.$inferSelect;
export type InsertAdminActivityLog = typeof adminActivityLog.$inferInsert;

/**
 * Admin Permissions
 */
export const adminPermissions = mysqlTable(
  "adminPermissions",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    permission: varchar("permission", { length: 100 }).notNull(), // view_analytics, manage_users, manage_payments, etc.
    grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  }
);

export type AdminPermission = typeof adminPermissions.$inferSelect;
export type InsertAdminPermission = typeof adminPermissions.$inferInsert;

/**
 * Admin Settings
 */
export const adminSettings = mysqlTable(
  "adminSettings",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
    settingKey: varchar("settingKey", { length: 100 }).notNull(),
    settingValue: text("settingValue"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;
