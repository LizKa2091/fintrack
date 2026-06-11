import { prisma } from '@/config/db.js'
import bcrypt from 'bcrypt'

export const settingsService = {
updateProfile: async (
   userId: string, 
   data: { username?: string; currentPassword?: string; newPassword?: string; currency?: string }
) => {
   const user = await prisma.user.findUnique({ where: { id: userId } })
   if (!user) throw new Error('Пользователь не найден')

   const updateData: { name?: string; passwordHash?: string; currency?: string } = {}

   if (data.username && data.username.trim() !== '') {
      updateData.name = data.username.trim()
   }

   if (data.currency) {
      const allowedCurrencies = ['RUB', 'USD', 'EUR', 'KZT']
      if (!allowedCurrencies.includes(data.currency)) {
         throw new Error('Неподдерживаемая валюта')
      }
      updateData.currency = data.currency
   }

   if (data.newPassword) {
      if (!data.currentPassword) throw new Error('Введите текущий пароль')
      const isPasswordMatch = await bcrypt.compare(data.currentPassword, user.passwordHash)
      if (!isPasswordMatch) throw new Error('Текущий пароль введен неверно')
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10)
   }

   if (Object.keys(updateData).length === 0) {
      return { id: user.id, username: user.name, email: user.email, currency: user.currency }
   }

   const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
   })

   return {
      id: updatedUser.id,
      username: updatedUser.name,
      email: updatedUser.email,
      currency: updatedUser.currency
   }
}
}