import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  // create a new user
  createUser: publicProcedure
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
  updateUser: protectedProcedure
    .input(z.object({ email: z.string().email(), name: z.string() }))
    .mutation((req) => {
      return prisma.user.update({
        where: {
          email: req.input.email,
        },
        data: {
          name: req.input.name,
        },
      });
    }),
  deleteUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation((req) => {
      return prisma.user.delete({
        where: {
          email: req.input.email,
        },
      });
    }),
});
