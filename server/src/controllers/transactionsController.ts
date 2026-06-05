import { Request, Response } from 'express'
import { transactionsService } from '@/services/transactionsService.js'

export const transactionsController = {
   getTransactions: async (req: Request, res: Response) => {
      try {
         const transactions = await transactionsService.getAll()
         res.json(transactions)
      } 
      catch (error) {
         res.status(500).json({ error: 'Ошибка при получении транзакций' })
      }
   },

   createTransaction: async (req: Request, res: Response) => {
      try {
         const { title, amount, type, category } = req.body
         
         const userId = (req as any).user?.userId 

         if (!userId) {
            return res.status(401).json({ error: 'Не забудь залогиниться' })
         }

         if (!title || !amount || !type || !category) {
            return res.status(400).json({ error: 'Все поля обязательны для заполнения' })
         }

         const newTransaction = await transactionsService.create({
            title,
            amount: Number(amount),
            type,
            category,
            userId,
         })

         res.status(201).json(newTransaction)
      } 
      catch (error) {
         console.error('[Create Transaction Error]:', error)
         res.status(500).json({ error: 'Ошибка при создании транстанции' })
      }
   },

   deleteTransaction: async (req: Request, res: Response) => {
      try {
         const { id } = req.params

         if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Неверный формат ID транзакции' })
         }

         await transactionsService.delete(id)
         res.json({ message: 'Транзакция успешно удалена' })
      } 
      catch (error) {
         res.status(500).json({ error: 'Ошибка при удалении транзакции' })
      }
  },
}