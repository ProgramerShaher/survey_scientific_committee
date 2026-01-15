import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { SURVEY_QUESTIONS } from "@shared/surveyData";
import { generateExcelFile } from "./exportToExcel";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  survey: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "الاسم مطلوب"),
          college: z.string().min(1, "الكلية مطلوبة"),
          specialization: z.string().min(1, "التخصص مطلوب"),
          academicLevel: z.string().min(1, "المستوى مطلوب"),
          suggestions: z.string().optional(),
          answers: z.array(
            z.object({
              questionId: z.number(),
              rating: z.number().min(1).max(5),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await db.createSurveyResponse({
            fullName: input.fullName,
            college: input.college,
            specialization: input.specialization,
            academicLevel: input.academicLevel,
            suggestions: input.suggestions || null,
            answers: input.answers,
          });

          // Send email notification
          await notifyOwner({
            title: "استبيان جديد: " + input.fullName,
            content: `تم استقبال استبيان جديد\n\nالاسم: ${input.fullName}\nالكلية: ${input.college}\nالتخصص: ${input.specialization}\nالمستوى: ${input.academicLevel}\n\nسيتم إرسال البيانات إلى:\nشاهر خالد اليعري\nmohammad.alhosni@example.com`,
          });

          return { success: true, id: result.id };
        } catch (error) {
          console.error("Failed to submit survey:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit survey",
          });
        }
      }),

    getAll: publicProcedure.query(async () => {
      try {
        return await db.getAllSurveyResponses();
      } catch (error) {
        console.error("Failed to get surveys:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get surveys",
        });
      }
    }),

    getAnalytics: publicProcedure.query(async () => {
      try {
        return await db.getAnalyticsData();
      } catch (error) {
        console.error("Failed to get analytics:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get analytics",
        });
      }
    }),

    checkDashboardAccess: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        try {
          const user = await db.isUserAllowedForDashboard(input.email);
          return { allowed: !!user, roleId: user?.roleId || null };
        } catch (error) {
          console.error("Failed to check dashboard access:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to check access",
          });
        }
      }),

    exportToExcel: publicProcedure.query(async () => {
      try {
        const { totalResponses, answers } = await db.getAnalyticsData();

        const buffer = generateExcelFile(
          totalResponses as any,
          answers as any,
          SURVEY_QUESTIONS
        );

        return {
          success: true,
          buffer: buffer.toString('base64'),
          filename: `survey_report_${new Date().toISOString().split('T')[0]}.xlsx`,
        };
      } catch (error) {
        console.error("Failed to export to Excel:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to export data",
        });
      }
    }),

    addAllowedUser: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
          roleId: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await db.addAllowedDashboardUser({
            email: input.email,
            name: input.name,
            roleId: input.roleId,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to add allowed user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add user",
          });
        }
      }),

    removeAllowedUser: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          await db.removeAllowedDashboardUser(input.email);
          return { success: true };
        } catch (error) {
          console.error("Failed to remove allowed user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to remove user",
          });
        }
      }),

    getAllowedUsers: publicProcedure.query(async () => {
      try {
        return await db.getAllowedDashboardUsers();
      } catch (error) {
        console.error("Failed to get allowed users:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get users",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
