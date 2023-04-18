import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { eventRouter } from "./routers/eventRoute";
import { participateRouter } from "./routers/participateRoute";
import { timesloteRouter } from "./routers/timesloteRoute";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  events: eventRouter,
  participates: participateRouter,
  timeslots: timesloteRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
