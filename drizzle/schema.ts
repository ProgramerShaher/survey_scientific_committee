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

/**
 * Survey Responses Table - يحفظ جميع ردود الاستبيانات
 */
export const surveyResponses = mysqlTable("survey_responses", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  college: varchar("college", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  academicLevel: varchar("academic_level", { length: 50 }).notNull(), // أول، ثاني، ثالث، رابع
  suggestions: text("suggestions"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

/**
 * Survey Answers Table - يحفظ إجابات كل سؤال
 */
export const surveyAnswers = mysqlTable("survey_answers", {
  id: int("id").autoincrement().primaryKey(),
  responseId: int("response_id")
    .notNull()
    .references(() => surveyResponses.id, { onDelete: "cascade" }),
  questionId: int("question_id").notNull(),
  rating: int("rating").notNull(), // 1-5 نجوم
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SurveyAnswer = typeof surveyAnswers.$inferSelect;
export type InsertSurveyAnswer = typeof surveyAnswers.$inferInsert;