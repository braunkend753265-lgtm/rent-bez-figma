import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  listingId: varchar("listingId", { length: 96 }).notNull(),
  listingTitle: varchar("listingTitle", { length: 255 }).notNull(),
  applicantName: varchar("applicantName", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "closed"]).default("new").notNull(),
  consentAt: timestamp("consentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const otpChallenges = mysqlTable("otp_challenges", {
  id: int("id").autoincrement().primaryKey(),
  phoneHash: varchar("phoneHash", { length: 64 }).notNull(),
  codeHash: varchar("codeHash", { length: 64 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  nextAllowedAt: timestamp("nextAllowedAt").notNull(),
  attempts: int("attempts").default(0).notNull(),
  consumedAt: timestamp("consumedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;
export type OtpChallenge = typeof otpChallenges.$inferSelect;
