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

  updateCurrentUserTimeZone: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
        timeZone: z.string(),
      })
    )
    .mutation(async (req) => {
      const userId = req.ctx.session.user.id;
      return await prisma.participate.update({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: userId,
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
      await prisma.timeSlots.deleteMany({
        where: {
          participateEventID: req.input.eventID,
          participateUserID: req.input.userID,
        },
      });
      return await prisma.participate.delete({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: req.input.userID,
          },
        },
      });
    }),

  deleteCurrentUserParticipate: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
      })
    )
    .mutation(async (req) => {
      const userId = req.ctx.session.user.id;
      await prisma.timeSlots.deleteMany({
        where: {
          participateEventID: req.input.eventID,
          participateUserID: userId,
        },
      });
      return await prisma.participate.delete({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: userId,
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

  getParticipateEvents: protectedProcedure.query(async (req) => {
    const selectResult = await prisma.participate.findMany({
      where: {
        userID: req.ctx.session.user.id,
      },
      select: {
        event: {
          select: {
            id: true,
            name: true,
            begins: true,
            ends: true,
            joinCode: true,
            timeZone: true,
            occuringDays: true,
            type: true,
            ownerID: true,
            _count: {
              select: {
                participant: true,
              },
            },
          },
        },
      },
      orderBy: { event: { createdAt: "desc" } },
    });

    return selectResult.map((result) => ({
      ...result.event,
      participantCount: result.event._count.participant,
    }));
  }),
});
