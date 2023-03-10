import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const createDaySchema = z.object({
  date: z.date({
    required_error: "Day date is required",
  }),
  done: z.boolean(),
  goalId: z.string({ required_error: "Goal id needs to be set" }),
});

export const updateDaySchema = createDaySchema.extend({
  id: z.string(),
});

export const dateRouter = router({
  create: protectedProcedure
    .input(createDaySchema)
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { date, goalId, done } = input;

      return prisma.day.create({
        data: {
          date,
          done,
          goal: {
            connect: {
              id: goalId,
            },
          },
        },
      });
    }),
  getDaysByGoalId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const { prisma } = ctx;

      return prisma.day.findMany({ where: { goalId: input.id } });
    }),
  update: protectedProcedure
    .input(updateDaySchema)
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;

      return prisma.day.upsert({
        where: { id: input.id },
        update: {
          done: input.done,
        },
        create: {
          done: input.done,
          date: input.date,
          goal: {
            connect: {
              id: input.goalId,
            },
          },
        },
      });
    }),
});
