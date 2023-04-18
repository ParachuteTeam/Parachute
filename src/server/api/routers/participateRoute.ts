import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

export const participateRouter = createTRPCRouter({
  /**
   This function create a new participate.
   joinCode should be a valid 6-digit string.
   */
  createParticipate: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        joinCode: z.string(),
      })
    )
    .mutation(async (req) => {
      const eventCheck = await prisma.event.findUnique({
        where: {
          joinCode: req.input.joinCode,
        },
      });
      if (!eventCheck) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Joincode is invalid!',
        });
      }
      return await prisma.participate.create({
        data: {
          eventID: eventCheck.id,
          userID: req.input.userID,
        },
      });
    }),

  /**
   This function return all eventID that this person participates.
   */
  getParticipateEvents: protectedProcedure
    .input(z.object({ userID: z.string() }))
    .query(async (req) => {
      return await prisma.participate.findMany({
        where: { userID: req.input.userID },
        select: { eventID: true},
      });
    }),

  /**
   Delete a participate according to userID and eventID
   */
  deleteParticipate: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
      })
    )
    .mutation(async (req) => {
      return await prisma.participate.delete({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: req.input.userID,
          },
        },
      });
    }),
});