import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
          fullName: z.string().min(1),
          college: z.string().min(1),
          specialization: z.string().min(1),
          academicLevel: z.string().min(1),
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
            title: "استبيان جديد من الطالب: " + input.fullName,
            content: `تم استقبال استبيان جديد من ${input.fullName}\nالكلية: ${input.college}\nالتخصص: ${input.specialization}\nالمستوى: ${input.academicLevel}`,
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
  }),
});

export type AppRouter = typeof appRouter;
