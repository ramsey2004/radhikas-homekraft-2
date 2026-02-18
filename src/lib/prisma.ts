import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

// Create a mock Prisma client for build time when database is not available
const createMockPrisma = () => {
  return new Proxy({} as any, {
    get: () => {
      return new Proxy(() => {}, {
        apply: () => Promise.resolve({}),
        get: () => new Proxy(() => {}, {
          apply: () => Promise.resolve({}),
        }),
      });
    },
  });
};

let prismaClient: PrismaClient | any;

try {
  prismaClient =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      errorFormat: 'minimal',
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }
} catch (error) {
  // During build time or when DATABASE_URL is invalid, use mock
  console.warn('[Prisma] Using mock client (database not available)');
  prismaClient = createMockPrisma();
}

export const prisma = prismaClient;
export default prisma;
