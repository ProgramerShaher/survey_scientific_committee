import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

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

/**
 * Roles Table - جدول الأدوار
 */
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  level: int("level").notNull(), // مستوى الدور (1-5) حيث 5 هو الأعلى
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

/**
 * Permissions Table - جدول الصلاحيات
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // مثل: survey, users, reports, settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * Role Permissions Table - جدول ربط الأدوار بالصلاحيات
 */
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").autoincrement().primaryKey(),
  roleId: int("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: int("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

/**
 * Allowed Users Table - يحفظ المستخدمين المسموحين بالوصول لوحة التحكم
 */
export const allowedDashboardUsers = mysqlTable("allowed_dashboard_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  roleId: int("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AllowedDashboardUser = typeof allowedDashboardUsers.$inferSelect;
export type InsertAllowedDashboardUser = typeof allowedDashboardUsers.$inferInsert;

/**
 * Notification Emails Table - جدول الايميلات المستقبلة للإشعارات
 */
export const notificationEmails = mysqlTable("notification_emails", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NotificationEmail = typeof notificationEmails.$inferSelect;
export type InsertNotificationEmail = typeof notificationEmails.$inferInsert;
