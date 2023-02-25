import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const GoalSchema = z.object({
  title: z.string({ required_error: "A goal title is required" }),
  description: z.string().default(""),
  id: z.string().optional(),
  emoji: z.string().optional(),
  overallNumber: z.number({
    required_error: "A goal total number is required",
  }),
  currentDoneNumber: z.number().optional(),
});

export type GoalType = z.infer<typeof GoalSchema>;

export const goalRouter = router({
  create: protectedProcedure.input(GoalSchema).mutation(({ ctx, input }) => {
    const { session } = ctx;
    const userId = session.user.id;

    const { title, description, emoji, overallNumber } = input;

    return ctx.prisma.goal.create({
      data: {
        title,
        description,
        emoji: emoji || "+1",
        overallNumber,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string({ required_error: "id is required" }),
      })
    )
    .query(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const userId = session.user.id;

      return prisma.goal.findFirstOrThrow({
        where: {
          userId,
          id: input.id,
        },
        include: {
          days: true,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    const { prisma, session } = ctx;
    const userId = session.user.id;
    return prisma.goal.findMany({
      where: {
        userId,
      },
    });
  }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string({ required_error: "id is required" }) }))
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;

      return prisma.goal.delete({ where: { id: input.id } });
    }),
});
