import { prisma } from '../config/db.js'

export const categoriesService = {
   getAll: async (userId: string) => {
      return await prisma.category.findMany({
         where: { userId },
         orderBy: { name: 'asc' }
      })
   },

   create: async (data: { name: string; type: string; userId: string }) => {
      return await prisma.category.create({
         data
      })
   },

   delete: async (id: string, userId: string) => {
      return await prisma.category.deleteMany({
         where: { id, userId }
      })
   }
}