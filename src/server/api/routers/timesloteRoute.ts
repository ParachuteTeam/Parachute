import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

export const timesloteRouter = createTRPCRouter({
  /**
   This function create a new timeslot.
   Note that date, begins, and ends are all need to be datetime.
   */
  createtimeslote: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
        date: z.string().datetime(),
        begins: z.string().datetime(),
        ends: z.string().datetime(),
      })
    )
    .mutation(async (req) => {
      const participateCheck = await prisma.participate.findUnique({
        where: {
          eventID_userID: {
            eventID: req.input.eventID,
            userID: req.input.userID,
          },
        },
      });
      if (!participateCheck) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'This user is not participants of this event',
        });
      };
      return await prisma.timeSlots.create({
        data: {
          participateEventID: req.input.eventID,
          participateUserID: req.input.userID,
          date: req.input.date,
          begins: req.input.begins,
          ends: req.input.ends,
        },
      });
    }),

  /**
   This function return all timeslots of given userId and eventId.
   The function return the several days, begins, ends in ascending order.
   */
  getAllTimeSlots: protectedProcedure
    .input(z.object({
      userID: z.string(),
      eventID: z.string(),
    }))
    .query(async (req) => {
      return await prisma.timeSlots.findMany({
        where: {
          participateUserID: req.input.userID,
          participateEventID: req.input.eventID,
        },
        orderBy: { begins: 'asc' },
      });
    }),

  /**
   Delete one timeslot.
   */
  deleteParticipate: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
        date: z.string().datetime(),
        begins: z.string().datetime(),
        ends: z.string().datetime(),
      })
    )
    .mutation(async (req) => {
      return await prisma.timeSlots.deleteMany({
        where: {
          participate: {
            eventID: req.input.eventID,
            userID: req.input.userID,
          },
          date: req.input.date,
          begins: req.input.begins,
          ends: req.input.ends,
        },
      });
    }),
});