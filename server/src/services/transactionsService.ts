import { prisma } from '@/config/db.js'

export const transactionsService = {
   getAll: async () => {
      return await prisma.transaction.findMany({
         orderBy: {
         createdAt: 'desc',
         },
      })
   },

   create: async (data: { title: string; amount: number; type: string; category: string }) => {
      return await prisma.transaction.create({
         data: {
         title: data.title,
         amount: data.amount,
         type: data.type,
         category: data.category,
         },
      })
   },

   delete: async (id: string) => {
      return await prisma.transaction.delete({
         where: { id },
      })
   },
}