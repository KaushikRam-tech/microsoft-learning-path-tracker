import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

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

export const learnerActivity = mysqlTable("learner_activity", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  pathId: varchar("pathId", { length: 64 }).notNull(),
  activityType: mysqlEnum("activityType", ["module_completed", "study_session"]).notNull(),
  title: text("title").notNull(),
  minutes: int("minutes").default(0).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, table => ({
  userCompletedAtIdx: index("learner_activity_user_completed_at_idx").on(table.userId, table.completedAt),
}));

export type LearnerActivity = typeof learnerActivity.$inferSelect;
export type InsertLearnerActivity = typeof learnerActivity.$inferInsert;