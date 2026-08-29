import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getLearnerActivity, recordLearnerActivity } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

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
  activity: router({
    list: protectedProcedure.query(({ ctx }) => getLearnerActivity(ctx.user.id)),
    record: protectedProcedure.input(z.object({
      pathId: z.string().min(1).max(64),
      activityType: z.enum(["module_completed", "study_session"]),
      title: z.string().min(1).max(255),
      minutes: z.number().int().min(0).max(1440).default(18),
    })).mutation(({ ctx, input }) => recordLearnerActivity({ ...input, userId: ctx.user.id })),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
