import { prisma } from '@/config/db.js'
import bcrypt from 'bcrypt'

export const settingsService = {
   updateProfile: async (
      userId: string, 
      data: { username?: string; currentPassword?: string; newPassword?: string }
   ) => {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
         throw new Error('Пользователь не найден')
      }

      const updateData: { name?: string; passwordHash?: string } = {}

      if (data.username && data.username.trim() !== '') {
         updateData.name = data.username.trim()
      }

      if (data.newPassword) {
         if (!data.currentPassword) {
            throw new Error('Необходимо ввести текущий пароль для подтверждения изменений')
         }

         const isPasswordMatch = await bcrypt.compare(data.currentPassword, user.passwordHash)
         if (!isPasswordMatch) {
            throw new Error('Текущий пароль введен неверно')
         }

         updateData.passwordHash = await bcrypt.hash(data.newPassword, 10)
      }

      if (Object.keys(updateData).length === 0) {
         return { id: user.id, username: user.name, email: user.email }
      }

      const updatedUser = await prisma.user.update({
         where: { id: userId },
         data: updateData,
      })

      return {
         id: updatedUser.id,
         username: updatedUser.name,
         email: updatedUser.email
      }
   }
}