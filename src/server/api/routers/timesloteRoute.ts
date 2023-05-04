import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
          code: "NOT_FOUND",
          message: "This user is not participants of this event",
        });
      }
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
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
      })
    )
    .query(async (req) => {
      return await prisma.timeSlots.findMany({
        where: {
          participateUserID: req.input.userID,
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
     Delete one timeslot.
     */
  deleteTimeslot: protectedProcedure
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
   Then create all time slots in arr beginsToAdd.
   */
  ModifyManyTimeslot: protectedProcedure
    .input(
      z.object({
        userID: z.string(),
        eventID: z.string(),
        beginsToAdd: z.array(z.string().datetime()),
      })
    )
    .mutation(async (req) => {
      await prisma.timeSlots.deleteMany({
        where: {
          participateUserID: req.input.userID,
          participateEventID: req.input.eventID,
        },
      });
      const createdTimeSlots = [];

      for (const beginTime of req.input.beginsToAdd) {
        const newTimeSlot = await prisma.timeSlots.create({
          data: {
            participateUserID: req.input.userID,
            participateEventID: req.input.eventID,
            date: beginTime,
            begins: beginTime,
            ends: beginTime,
          },
        });
        createdTimeSlots.push(newTimeSlot);
      }
      return createdTimeSlots;
    }),
});
