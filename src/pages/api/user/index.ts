import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  });
  return res.status(201).json(result);
}