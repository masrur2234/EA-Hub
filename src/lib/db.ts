import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const db = new PrismaClient(
  process.env.NODE_ENV === 'production'
    ? { log: ['error'] }
    : { log: ['query'] }
)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export { db }
