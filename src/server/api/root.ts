import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { eventRouter } from "./routers/eventRoute";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
