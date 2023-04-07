import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified: Date;
//     image: string;
//     createdAt: Date;
//     updatedAt: Date;
//   }
//
// interface Event {
//     id: string;
//     occuringAt: Date;
//     ownerID: string;
//     address: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
//
// interface Participate {
//     eventID: string;
//     userID: Date;
//     timeSlots: JSON;
// }

const VALUES = ['DAYSOFWEEK', 'DATES'] as const

function generateRandomSixDigitNumber(): string {
    const min = 100000;
    const max = 999999;
    const randomSixDigitNumber = Math.floor(Math.random() * (max - min + 1) + min);
    return randomSixDigitNumber.toString();
}

async function generateUniqueJoinCode(): Promise<string> {
    let joinCode_cur: string;

    do {
        joinCode_cur = generateRandomSixDigitNumber();
        const event = await prisma.event.findUnique({
            where: {
                joinCode: joinCode_cur,
            },
        });

        if (!event) {
            break;
        }
    } while (true);

    return joinCode_cur;
}

export const eventRouter = createTRPCRouter({
    /*
        async function that creates a new event.
        First check existence of user according to the email.
        Then, create new event, participate.
    */
    createEvent: protectedProcedure
      .input(
        z.object({
            occuringDays: z.string(),
            begins: z.string().datetime(),
            ends: z.string().datetime(),
            type: z.enum(VALUES),
            email: z.string().email(),
            address: z.string(),
        })
      )
      .mutation(async (req) => {
          const userCheck = await prisma.user.findUnique({
              where: {
                  email: req.input.email,
              },
          });
          if (!userCheck) {
              throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'User does not exist',
              });
          }
          const randomSixDigitString : string = await generateUniqueJoinCode();
          const newEvent = await prisma.event.create({
              data: {
                  occuringDays: req.input.occuringDays,
                  joinCode: randomSixDigitString,
                  begins: req.input.begins,
                  ends: req.input.ends,
                  type: req.input.type,
                  ownerID: userCheck.id,
                  address: req.input.address,
              },
          });
          await prisma.participate.create({
              data: {
                  eventID: newEvent.id,
                  userID: userCheck.id,
                  timeSlots: {} = {},
              },
          });
          return newEvent;
      }),
    /*
        async function that get whole event list of an user.
        First check the existance of user, then return the list of event objects.
    */
    getEventList: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async (req) => {
          const userCheck = await prisma.user.findUnique({
              where: {
                  email: req.input.email,
              },
          });
          if (!userCheck) {
              throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'User does not exist',
              });
          }
          return await prisma.event.findMany({
              where: { ownerID: userCheck.id },
              select: { id: true, begins: true, joinCode: true},
              orderBy: { begins: 'asc' }
          });
      }),

    getEvent: protectedProcedure
      .input(z.object({
          eventId: z.string()
      }))
      .query((req) => {
          return prisma.event.findUnique({
              where: {
                  id: req.input.eventId,
              },
          });
          // if (!eventCheck) {
          //     throw new TRPCError({
          //         code: 'NOT_FOUND',
          //         message: 'Event does not exist',
          //     });
          // }
          // return eventCheck;
      }),

    /**
     * Verify the status of event host and check the existance of event.
     * Then update event address.
     */
    updateEvent_addresss: protectedProcedure
      .input(z.object({
          host_email: z.string().email(),
          address: z.string(),
          eventId: z.string()
      }))
      .mutation(async (req) => {
          const eventCheck = await prisma.event.findUnique({
              where: {
                  id: req.input.eventId,
              },
          });
          if (!eventCheck) {
              throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'Event does not exist',
              });
          }
          const userCheck = await prisma.user.findUnique({
              where: {
                  email: req.input.host_email,
              },
          });
          if (!userCheck) {
              throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'User does not exist',
              });
          }
          if (userCheck.id != eventCheck.ownerID ) {
              throw new TRPCError({
                  code: 'UNAUTHORIZED',
                  message: 'User is not event holder',
              });
          }
          return await prisma.event.update({
              where: {
                  id: req.input.eventId,
              },
              data: {
                  address: req.input.address,
              },
          });
      }),

    /**
     * After varifying the existance of the event and and the host of event, delete the event.
     */
    deleteEvent: protectedProcedure
      .input(z.object({
          host_email: z.string().email(),
          eventId: z.string(),
      }))
      .mutation(async (req) => {
          const eventCheck = await prisma.event.findUnique({
              where: {
                  id: req.input.eventId,
              },
          });
          if (!eventCheck) {
              throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'Event does not exist',
              });
          }
          const userCheck = await prisma.user.findUnique({
              where: {
                  email: req.input.host_email,
              },
          });
          if (!userCheck) {
              throw new TRPCError({
                  code: 'FORBIDDEN',
                  message: 'User does not exist',
              });
          }
          if (userCheck.id != eventCheck.ownerID ) {
              throw new TRPCError({
                  code: 'UNAUTHORIZED',
                  message: 'User is not event holder',
              });
          }
          await prisma.participate.deleteMany({
              where: {
                  eventID: req.input.eventId,
              },
          })
          return await prisma.event.delete({
              where: {
                  id: req.input.eventId,
              },
          });
      }),

});