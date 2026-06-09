import { prisma } from '@/config/db.js'

export const transactionsService = {
   getAll: async (userId: string) => {
      return await prisma.transaction.findMany({
         where: { userId },
         include: {
            category: true,
         },
         orderBy: {
            date: 'desc',
         },
      })
   },

   create: async (data: { title: string; amount: number; type: string; categoryId: string; userId: string }) => {
      return await prisma.transaction.create({
         data: {
            title: data.title,
            amount: data.amount,
            type: data.type,
            categoryId: data.categoryId,
            userId: data.userId,
         },
         include: {
            category: true,
         }
      })
   },

   delete: async (id: string, userId: string) => {
      return await prisma.transaction.deleteMany({
         where: { 
            id,
            userId
         },
      })
   },
}