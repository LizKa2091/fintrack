import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export const connectDB = async () => {
   try {
      await prisma.$connect()
      console.log('[database]: PostgreSQL connected successfully via Prisma Client')
   } 
   catch (error) {
      console.error('[database]: Connection error:', error)
      process.exit(1)
   }
}