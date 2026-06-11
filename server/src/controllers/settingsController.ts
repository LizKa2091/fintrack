import { Request, Response } from 'express'
import { settingsService } from '@/services/settingsService.js'

export const settingsController = {
   updateProfile: async (req: Request, res: Response) => {
      try {
         const userId = (req as any).user?.id || (req as any).user?.userId
         
         if (!userId) {
            return res.status(401).json({ error: 'Пользователь не авторизован' })
         }

         const { username, currency, currentPassword, newPassword } = req.body

         const result = await settingsService.updateProfile(userId, {
            username,
            currency,
            currentPassword,
            newPassword
         })

         res.json({ message: 'Профиль успешно обновлен', user: result })
      } catch (error: any) {
         res.status(400).json({ error: error.message || 'Ошибка при обновлении профиля' })
      }
   }
}