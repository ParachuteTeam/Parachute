import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
        timeZone: z.string(),
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
          code: "NOT_FOUND",
          message: "Joincode is invalid!",
        });
      }
      return await prisma.participate.create({
        data: {
          eventID: eventCheck.id,
          userID: req.input.userID,
          timeZone: req.input.timeZone,
        },
      });
    }),

  /**
   This function return all eventID that this person participates.
   */
  getParticipateEvents: protectedProcedure.query(async (req) => {
    const eventID = await prisma.participate.findMany({
      where: { userID: req.ctx.session.user.id },
      select: { eventID: true },
    });
    //fetch event from eventID
    const event = await prisma.event.findMany({
      where: { id: { in: eventID.map((e) => e.eventID) } },
      select: {
        id: true,
        name: true,
        begins: true,
        ends: true,
        joinCode: true,
        occuringDays: true,
        type: true,
        ownerID: true,
        partCount: true,
      },
      orderBy: { begins: "asc" },
    });
    return event;
  }),

  /**
   This function are used to update the timeZone of a participation
   */
  updateTimeZone: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
        timeZone: z.string(),
      })
    )
    .mutation(async (req) => {
      return await prisma.participate.update({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: req.input.userID,
          },
        },
        data: {
          timeZone: req.input.timeZone,
        },
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

  deleteParticipants: protectedProcedure
    .input(
      z.object({
        userIDs: z.array(z.string()),
        eventID: z.string(),
      })
    )
    .mutation(async (req) => {
      await prisma.timeSlots.deleteMany({
        where: {
          participateEventID: req.input.eventID,
          participateUserID: { in: req.input.userIDs },
        },
      });
      return await prisma.participate.deleteMany({
        where: {
          eventID: req.input.eventID,
          userID: { in: req.input.userIDs },
        },
      });
    }),
});
