import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import { TRPCError, initTRPC } from '@trpc/server';

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

export const eventRouter = createTRPCRouter({
    /*
        async function that creates a new event.
        First check existence of user according to the email.
        Then, create new event, participate.
    */
    createEvent: protectedProcedure
        .input(
            z.object({
                email: z.string().email(),
                address: z.string(),
                occuringAt: z.string().datetime(),
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
            const newEvent = await prisma.event.create({
                data: {
                    occuringAt: req.input.occuringAt,
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
                select: { id: true, occuringAt: true},
                orderBy: { occuringAt: 'asc' }
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
            return await prisma.event.delete({
                where: {
                    id: req.input.eventId,
                },
            });
        }),

});
