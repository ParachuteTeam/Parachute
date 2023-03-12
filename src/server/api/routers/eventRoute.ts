import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
import Email from "next-auth/providers/email";

const prisma = new PrismaClient();
// const moment = require('moment');
// const mysql_datetime = 'YYYY-MM-DD hh:mm:ss';


export const eventRouter = createTRPCRouter({
    createEvent: protectedProcedure
        .input(
            z.object({
                occuringAt: z.string().datetime(), //"2020-01-01T00:00:00Z"
                owner: z.string(),
                ownerID: z.string().uuid(),
                address: z.string(),
                participant: z.array(z.string()),
                email: z.string().email()
            })
        )
        .mutation(async (req) => {
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.email,
                },
            });
            if (!userCheck) {
                throw new Error("User does not exist");
            }
            const newEvent = prisma.event.create({
                data: {
                    occuringAt: req.input.occuringAt,
                    owner: req.input.owner,
                    ownerID: req.input.ownerID,
                    address: req.input.address,
                    participant: req.input.participant,
                },
            });
            const newParticipate = prisma.Participate.create({
                data: {
                    event: newEvent,
                    eventID: newEvent.id,
                    user: userCheck,
                    userID: userCheck.id,
                    timeSlots: {} = {},
                },
            });
            return prisma.user.update({
                where: {
                    email: req.input.email,
                },
                data: {
                    event: {
                        push: newEvent,
                    },
                    participate: {
                        push: newParticipate,
                    },
                    updatedAt: new Date(),
                },
              });
        }),
    getEventList: protectedProcedure
        .input(z.object({ email: z.string().email() }))
        .query(async (req) => {
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.email,
                },
            });
            if (!userCheck) {
                throw new Error("User does not exist");
            }
            return prisma.user.findUnique({
                where: { email: req.input.email },
                select: { id: true, event: true },
            });
        }),
    getEvent: protectedProcedure
        .input(z.object({ 
            email: z.string().email(),
            eventId: z.string()
        }))
        .query(async (req) => {
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.email,
                },
            });
            if (!userCheck) {
                throw new Error("User does not exist");
            }
            const eventCheck = await prisma.Event.findUnique({
                where: {
                    id: req.input.eventId,
                },
            });
            if (!eventCheck) {
                throw new Error("Event does not exist");
            }
            const participantCheck = await prisma.Participate.findUnique({
                where: {
                    userID: userCheck.id,
                    eventID: eventCheck.id,
                },
            });
            if (!participantCheck) {
                throw new Error("User is not qualified");
            }
            return eventCheck;
        }),
    updateEvent_list: protectedProcedure
        .input(z.object({ 
            host_email: z.string().email(),
            person_to_add: z.string().email(),
            eventId: z.string()
        }))
        .mutation(async (req) => {
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.host_email,
                },
            });
            if (!userCheck) {
                throw new Error("User does not exist");
            };
            const eventCheck = await prisma.Event.findUnique({
                where: {
                    id: req.input.eventId,
                },
            });
            if (!eventCheck) {
                throw new Error("Event does not exist");
            };
            const personCheck = await prisma.Event.findUnique({
                where: {
                    id: req.input.person_to_add,
                },
            });
            if (!personCheck) {
                throw new Error("Event does not exist");
            };
            if (userCheck.id != eventCheck.ownerID) {
                throw new Error("not qualified");
            }
            const newParticipate = prisma.Participate.create({
                data: {
                    event: eventCheck,
                    eventID: eventCheck.id,
                    user: userCheck,
                    userID: userCheck.id,
                    timeSlots: {} = {},
                },
            });
            const event_update = prisma.event.update({
                where: {
                    id: req.input.eventId,
                },
                data: {
                    participate: {
                        push: newParticipate,
                    },
                },
            });
            prisma.user.update({
                where: {
                    id: userCheck.id,
                },
                data: {
                    participate: {
                        push: newParticipate,
                    },
                    event: {
                        push: event_update
                    }
                },
            });
            return event_update;
        }),
    updateEvent_addresss: protectedProcedure
        .input(z.object({
            host_email: z.string().email(),
            address: z.string(),
            eventId: z.string()
        }))
        .mutation(async (req) => {
            const eventCheck = await prisma.Event.findUnique({
                where: {
                    id: req.input.eventId,
                },
            });
            if (!eventCheck) {
                throw new Error("Event does not exist");
            }
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.host_email,
                },
            });
            if (userCheck.id != eventCheck.ownerID ) {
                throw new Error("not qualified");
            };
            return prisma.event.update({
                where: {
                    id: req.input.eventId,
                },
                data: {
                    address: req.input.address,
                },
            });
        }),
    deleteEvent: protectedProcedure
        .input(z.object({
            host_email: z.string().email(),
            address: z.string(),
            eventId: z.string()
        }))
        .mutation(async (req) => {
            const eventCheck = await prisma.Event.findUnique({
                where: {
                    id: req.input.eventId,
                },
            });
            if (!eventCheck) {
                throw new Error("Event does not exist");
            }
            const userCheck = await prisma.User.findUnique({
                where: {
                    email: req.input.host_email,
                },
            });
            if (userCheck.id != eventCheck.ownerID ) {
                throw new Error("not qualified");
            };
            return prisma.user.delete({
                where: {
                    id: req.input.eventId,
                },
            });
        }),
});
