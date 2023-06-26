import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const timesloteRouter = createTRPCRouter({
  /**
   This function return all timeslots of given userId and eventId.
   The function return the several days, begins, ends in ascending order.
   */
  getAllTimeSlots: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
      })
    )
    .query(async (req) => {
      return await prisma.timeSlots.findMany({
        where: {
          participateUserID: req.ctx.session.user.id,
          participateEventID: req.input.eventID,
        },
        orderBy: { begins: "asc" },
      });
    }),

  /**
      This function return all timeslots of given eventId.
      The function return the several days, begins, ends in ascending order.
      */
  getAllTimeSlots_Event: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
      })
    )
    .query(async (req) => {
      return await prisma.timeSlots.findMany({
        where: {
          participateEventID: req.input.eventID,
        },
        orderBy: { begins: "asc" },
      });
    }),

  /**
      Delete timeslots of whole event.
      */
  deleteTimeslotEvent: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
        date: z.string().datetime(),
        begins: z.string().datetime(),
        ends: z.string().datetime(),
      })
    )
    .mutation(async (req) => {
      return await prisma.timeSlots.deleteMany({
        where: {
          participateEventID: req.input.eventID,
          date: req.input.date,
          begins: req.input.begins,
          ends: req.input.ends,
        },
      });
    }),

  /**
   Delete all timeslots according to input userID and eventID.
   Then create add time slots in arr timeslots.
   */
  timeslotsReplace: protectedProcedure
    .input(
      z.object({
        eventID: z.string(),
        defaultTimeZone: z.string(),
        timeslots: z.array(
          z.object({
            begins: z.string().datetime(),
            ends: z.string().datetime(),
          })
        ),
      })
    )
    .mutation(async (req) => {
      const userId = req.ctx.session.user.id;

      if (
        (await prisma.participate.count({
          where: {
            eventID: req.input.eventID,
            userID: userId,
          },
        })) == 0
      ) {
        await prisma.participate.create({
          data: {
            eventID: req.input.eventID,
            userID: userId,
            timeZone: req.input.defaultTimeZone,
          },
        });
      }

      await prisma.timeSlots.deleteMany({
        where: {
          participateUserID: userId,
          participateEventID: req.input.eventID,
        },
      });
      const createdTimeSlots = [];

      for (const slot of req.input.timeslots) {
        const newTimeSlot = await prisma.timeSlots.create({
          data: {
            participateUserID: userId,
            participateEventID: req.input.eventID,
            date: slot.begins,
            begins: slot.begins,
            ends: slot.ends,
          },
        });
        createdTimeSlots.push(newTimeSlot);
      }
      return createdTimeSlots;
    }),
});
