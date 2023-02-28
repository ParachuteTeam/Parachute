import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  // create a new user
  userCreate: publicProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation((req) => {
      return prisma.user.create({
        data: {
          email: req.input.email,
          name: req.input.name,
        },
      });
    }),
  getUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query((req) => {
      return prisma.user.findUnique({
        where: {
          email: req.input.email,
        },
      });
    }),
});
