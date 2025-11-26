import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Optionally clear DB or prepare test data
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});