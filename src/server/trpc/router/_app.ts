import { router } from "../trpc";
import { authRouter } from "./auth";
import { dateRouter } from "./day";
import { goalRouter } from "./goal";

export const appRouter = router({
  day: dateRouter,
  goal: goalRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
