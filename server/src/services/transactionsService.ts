import { prisma } from '@/config/db.js'

export const transactionsService = {
   getAll: async (userId: string, page: number, limit: number) => {
      const skip = (page - 1) * limit

      const [items, total] = await prisma.$transaction([
         prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { date: 'desc' },
            skip: skip,
            take: limit,
         }),
         prisma.transaction.count({
            where: { userId }
         })
      ])

      return {
         items,
         total,
         page,
         limit,
         hasMore: skip + items.length < total
      }
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