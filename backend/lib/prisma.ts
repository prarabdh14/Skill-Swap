// prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Avoid instantiating multiple PrismaClient instances during hot reloads in development
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Optional: useful during development
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
