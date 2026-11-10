import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function checkDatabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, message: 'Prisma database connected successfully.' };
  } catch (error: any) {
    return { ok: false, message: `Database connection failed: ${error?.message || error}` };
  }
}

