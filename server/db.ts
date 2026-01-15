import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertSurveyResponse, surveyResponses, surveyAnswers, allowedDashboardUsers, InsertAllowedDashboardUser } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * الاستبيانات - Survey Functions
 */

export async function createSurveyResponse(
  data: InsertSurveyResponse & { answers: { questionId: number; rating: number }[] }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // إنشاء الاستبيان الرئيسي
    const [result] = await db.insert(surveyResponses).values({
      fullName: data.fullName,
      college: data.college,
      specialization: data.specialization,
      academicLevel: data.academicLevel,
      suggestions: data.suggestions,
    });

    const responseId = result.insertId;

    // إنشاء الإجابات
    for (const answer of data.answers) {
      await db.insert(surveyAnswers).values({
        responseId: responseId as number,
        questionId: answer.questionId,
        rating: answer.rating,
      });
    }

    return { id: responseId };
  } catch (error) {
    console.error("[Database] Failed to create survey response:", error);
    throw error;
  }
}

export async function getAllSurveyResponses() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const responses = await db.select().from(surveyResponses);
    return responses;
  } catch (error) {
    console.error("[Database] Failed to get survey responses:", error);
    throw error;
  }
}

export async function getSurveyResponseWithAnswers(responseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const response = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.id, responseId))
      .limit(1);

    if (response.length === 0) return null;

    const answersData = await db
      .select()
      .from(surveyAnswers)
      .where(eq(surveyAnswers.responseId, responseId));

    return { ...response[0], answers: answersData };
  } catch (error) {
    console.error("[Database] Failed to get survey response with answers:", error);
    throw error;
  }
}

export async function getAnalyticsData() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const totalResponses = await db.select().from(surveyResponses);
    const answers = await db.select().from(surveyAnswers);

    return { totalResponses, answers };
  } catch (error) {
    console.error("[Database] Failed to get analytics data:", error);
    throw error;
  }
}

/**
 * Dashboard Access Control
 */

export async function isUserAllowedForDashboard(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db
      .select()
      .from(allowedDashboardUsers)
      .where(eq(allowedDashboardUsers.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to check dashboard access:", error);
    throw error;
  }
}

export async function getAllowedDashboardUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    return await db.select().from(allowedDashboardUsers);
  } catch (error) {
    console.error("[Database] Failed to get allowed users:", error);
    throw error;
  }
}

export async function addAllowedDashboardUser(
  data: InsertAllowedDashboardUser
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(allowedDashboardUsers).values(data);
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to add allowed user:", error);
    throw error;
  }
}

export async function removeAllowedDashboardUser(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .delete(allowedDashboardUsers)
      .where(eq(allowedDashboardUsers.email, email));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to remove allowed user:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.
