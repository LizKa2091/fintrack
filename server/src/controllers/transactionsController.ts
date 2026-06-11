import { Request, Response } from 'express'
import { transactionsService } from '../services/transactionsService.js'

export const transactionsController = {
   getTransactions: async (req: Request, res: Response) => {
      try {
         const userId = (req as any).user?.userId 
         
         if (!userId) {
            return res.status(401).json({ error: 'Не забудь залогиниться' })
         }

         const page = Number(req.query.page) || 1
         const limit = Number(req.query.limit) || 10

         const result = await transactionsService.getAll(userId, page, limit)
         
         res.json(result)
      } 
      catch (error) {
         res.status(500).json({ error: 'Ошибка при получении транзакций' })
      }
   },

   createTransaction: async (req: Request, res: Response) => {
      try {
         const { title, amount, type, categoryId } = req.body
         const userId = (req as any).user?.userId 

         if (!userId) return res.status(401).json({ error: 'Не забудь залогиниться' })
         if (!title || !amount || !type || !categoryId) {
            return res.status(400).json({ error: 'Все поля обязательны' })
         }

         const newTransaction = await transactionsService.create({
            title, amount: Number(amount), type, categoryId, userId,
         })
         res.status(201).json(newTransaction)
      } catch (error) {
         res.status(500).json({ error: 'Ошибка при создании транстанции' })
      }
   },

   deleteTransaction: async (req: Request, res: Response) => {
      try {
         const { id } = req.params
         const userId = (req as any).user?.userId
         if (!userId) return res.status(401).json({ error: 'Не забудь залогиниться' })
         if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Неверный формат ID' })

         await transactionsService.delete(id, userId)
         res.json({ message: 'Транзакция успешно удалена' })
      } catch (error) {
         res.status(500).json({ error: 'Ошибка при удалении' })
      }
  },
}