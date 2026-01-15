import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("survey.submit", () => {
  it("should successfully submit a survey with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const surveyData = {
      fullName: "أحمد محمد علي السلمي",
      college: "الطب البشري",
      specialization: "طب عام",
      academicLevel: "أول",
      suggestions: "تحسين جودة التسجيلات الصوتية",
      answers: [
        { questionId: 1, rating: 5 },
        { questionId: 2, rating: 4 },
        { questionId: 3, rating: 5 },
        { questionId: 4, rating: 4 },
        { questionId: 5, rating: 5 },
        { questionId: 6, rating: 4 },
        { questionId: 7, rating: 5 },
        { questionId: 8, rating: 4 },
        { questionId: 9, rating: 5 },
        { questionId: 10, rating: 4 },
        { questionId: 11, rating: 5 },
        { questionId: 12, rating: 4 },
        { questionId: 13, rating: 5 },
        { questionId: 14, rating: 4 },
        { questionId: 15, rating: 5 },
      ],
    };

    const result = await caller.survey.submit(surveyData);

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("should reject survey with missing full name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const surveyData = {
      fullName: "",
      college: "الطب البشري",
      specialization: "طب عام",
      academicLevel: "أول",
      suggestions: "تحسين جودة التسجيلات",
      answers: [
        { questionId: 1, rating: 5 },
        { questionId: 2, rating: 4 },
        { questionId: 3, rating: 5 },
        { questionId: 4, rating: 4 },
        { questionId: 5, rating: 5 },
        { questionId: 6, rating: 4 },
        { questionId: 7, rating: 5 },
        { questionId: 8, rating: 4 },
        { questionId: 9, rating: 5 },
        { questionId: 10, rating: 4 },
        { questionId: 11, rating: 5 },
        { questionId: 12, rating: 4 },
        { questionId: 13, rating: 5 },
        { questionId: 14, rating: 4 },
        { questionId: 15, rating: 5 },
      ],
    };

    try {
      await caller.survey.submit(surveyData);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should reject survey with invalid rating (out of range)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const surveyData = {
      fullName: "أحمد محمد علي السلمي",
      college: "الطب البشري",
      specialization: "طب عام",
      academicLevel: "أول",
      suggestions: "تحسين جودة التسجيلات",
      answers: [
        { questionId: 1, rating: 6 }, // Invalid: should be 1-5
        { questionId: 2, rating: 4 },
        { questionId: 3, rating: 5 },
        { questionId: 4, rating: 4 },
        { questionId: 5, rating: 5 },
        { questionId: 6, rating: 4 },
        { questionId: 7, rating: 5 },
        { questionId: 8, rating: 4 },
        { questionId: 9, rating: 5 },
        { questionId: 10, rating: 4 },
        { questionId: 11, rating: 5 },
        { questionId: 12, rating: 4 },
        { questionId: 13, rating: 5 },
        { questionId: 14, rating: 4 },
        { questionId: 15, rating: 5 },
      ],
    };

    try {
      await caller.survey.submit(surveyData);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should accept survey with optional suggestions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const surveyData = {
      fullName: "فاطمة أحمد محمد الشامسي",
      college: "الهندسة والحاسوب",
      specialization: "تكنولوجيا معلومات",
      academicLevel: "ثاني",
      answers: [
        { questionId: 1, rating: 5 },
        { questionId: 2, rating: 4 },
        { questionId: 3, rating: 5 },
        { questionId: 4, rating: 4 },
        { questionId: 5, rating: 5 },
        { questionId: 6, rating: 4 },
        { questionId: 7, rating: 5 },
        { questionId: 8, rating: 4 },
        { questionId: 9, rating: 5 },
        { questionId: 10, rating: 4 },
        { questionId: 11, rating: 5 },
        { questionId: 12, rating: 4 },
        { questionId: 13, rating: 5 },
        { questionId: 14, rating: 4 },
        { questionId: 15, rating: 5 },
      ],
    };

    const result = await caller.survey.submit(surveyData);

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });
});

describe("survey.getAll", () => {
  it("should retrieve all survey responses", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.survey.getAll();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("survey.getAnalytics", () => {
  it("should retrieve analytics data with totalResponses and answers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.survey.getAnalytics();

    expect(result).toHaveProperty("totalResponses");
    expect(result).toHaveProperty("answers");
    expect(Array.isArray(result.totalResponses)).toBe(true);
    expect(Array.isArray(result.answers)).toBe(true);
  });
});
