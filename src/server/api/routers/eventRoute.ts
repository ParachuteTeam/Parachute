import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const moment = require('moment');
const mysql_datetime = 'YYYY-MM-DD hh:mm:ss';

export const eventRouter = createTRPCRouter({
    createEvent: protectedProcedure
        .input(
            z.object({
                occuringAt: z.string().transform((val) => moment(val, mysql_datetime).toDate()),
                owner: z.string(),
                ownerID: z.string(),
                address: z.string(),
                participant: z.array(z.string())
            })
        )
        .mutation(async (req) => {
            const userCheck = await prisma.User.findUnique({
                where: {
                    id: req.input.ownerID,
                },
            });
            if (!userCheck) {
                throw new Error("User does not exist");
            }
            return prisma.event.create({
                data: {
                    occuringAt: req.input.occuringAt,
                    owner: req.input.owner,
                    ownerID: req.input.ownerID,
                    address: req.input.address,
                    participant: req.input.participant,
                },
            });
        }),
});
